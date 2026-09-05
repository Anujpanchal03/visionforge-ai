import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import generationModel from "../models/generationModel.js";
import razorpay from 'razorpay';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import stripe from "stripe";

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please fill in all required fields' });
        }

        if (confirmPassword && password !== confirmPassword) {
            return res.status(400).json({ success: false, message: 'Passwords do not match' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await userModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'An account with this email already exists' });
        }

        // Hash user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            creditBalance: 50 // Minimum 50 Free Credits for every new user
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'visionforge_secret_key');

        res.json({
            success: true,
            token,
            user: { name: user.name, email: user.email },
            credits: user.creditBalance,
            message: "Welcome to VisionForge AI — you've received 50 free credits."
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: error.message || 'Registration failed' });
    }
};

// API to login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please enter both email and password' });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'visionforge_secret_key');
            res.json({
                success: true,
                token,
                user: { name: user.name, email: user.email },
                credits: user.creditBalance
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: error.message || 'Login failed' });
    }
};

// API Controller function to get user credits & usage statistics
const userCredits = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const generatedCount = await generationModel.countDocuments({ userId });
        const totalUsed = await generationModel.aggregate([
            { $match: { userId: user._id } },
            { $group: { _id: null, total: { $sum: "$creditsUsed" } } }
        ]);

        const creditsUsed = totalUsed[0]?.total || 0;

        res.json({
            success: true,
            credits: user.creditBalance,
            user: { name: user.name, email: user.email },
            stats: {
                availableCredits: user.creditBalance,
                generatedCount,
                creditsUsed
            }
        });

    } catch (error) {
        console.error('User credits error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Razorpay payment integration
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('------')) {
    razorpayInstance = new razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

// Payment API to add credits (Razorpay)
const paymentRazorpay = async (req, res) => {
    try {
        if (!razorpayInstance) {
            return res.status(400).json({
                success: false,
                message: 'Razorpay payment gateway is not configured on this server.'
            });
        }

        const { userId, planId } = req.body;
        const userData = await userModel.findById(userId);

        if (!userData || !planId) {
            return res.status(400).json({ success: false, message: 'Missing Details' });
        }

        let credits, plan, amount;

        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;
            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;
            default:
                return res.status(400).json({ success: false, message: 'Plan not found' });
        }

        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date: Date.now()
        };

        const newTransaction = await transactionModel.create(transactionData);

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY || 'USD',
            receipt: newTransaction._id.toString(),
        };

        const order = await razorpayInstance.orders.create(options);
        res.json({ success: true, order });

    } catch (error) {
        console.error('Razorpay payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API Controller function to verify razorpay payment
const verifyRazorpay = async (req, res) => {
    try {
        if (!razorpayInstance) {
            return res.status(400).json({ success: false, message: 'Payment gateway unavailable' });
        }

        const { razorpay_order_id } = req.body;
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            const transactionData = await transactionModel.findById(orderInfo.receipt);
            if (transactionData.payment) {
                return res.status(400).json({ success: false, message: 'Payment already verified' });
            }

            const userData = await userModel.findById(transactionData.userId);
            const creditBalance = userData.creditBalance + transactionData.credits;
            await userModel.findByIdAndUpdate(userData._id, { creditBalance });
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            res.json({ success: true, message: "Credits Added Successfully", creditBalance });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

    } catch (error) {
        console.error('Verify Razorpay error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Stripe Gateway
let stripeInstance = null;
if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('------')) {
    stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
}

// Payment API to add credits (Stripe)
const paymentStripe = async (req, res) => {
    try {
        if (!stripeInstance) {
            return res.status(400).json({
                success: false,
                message: 'Stripe payment gateway is not configured on this server.'
            });
        }

        const { userId, planId } = req.body;
        const { origin } = req.headers;

        const userData = await userModel.findById(userId);
        if (!userData || !planId) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        let credits, plan, amount;

        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 10;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 50;
                break;
            case 'Business':
                plan = 'Business';
                credits = 5000;
                amount = 250;
                break;
            default:
                return res.status(400).json({ success: false, message: 'Plan not found' });
        }

        const transactionData = {
            userId,
            plan,
            amount,
            credits,
            date: Date.now()
        };

        const newTransaction = await transactionModel.create(transactionData);
        const currency = (process.env.CURRENCY || 'usd').toLowerCase();

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: `VisionForge AI - ${plan} Credits Pack (${credits} Credits)`
                },
                unit_amount: transactionData.amount * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&transactionId=${newTransaction._id}`,
            cancel_url: `${origin}/verify?success=false&transactionId=${newTransaction._id}`,
            line_items,
            mode: 'payment',
        });

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.error('Stripe payment error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// API Controller function to verify stripe payment
const verifyStripe = async (req, res) => {
    try {
        const { transactionId, success } = req.body;

        if (success === 'true' || success === true) {
            const transactionData = await transactionModel.findById(transactionId);
            if (!transactionData) {
                return res.status(404).json({ success: false, message: 'Transaction not found' });
            }

            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment already processed' });
            }

            const userData = await userModel.findById(transactionData.userId);
            const creditBalance = userData.creditBalance + transactionData.credits;
            await userModel.findByIdAndUpdate(userData._id, { creditBalance });
            await transactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            res.json({ success: true, message: "Credits Added Successfully", creditBalance });
        } else {
            res.status(400).json({ success: false, message: 'Payment verification failed' });
        }

    } catch (error) {
        console.error('Verify Stripe error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    registerUser,
    loginUser,
    userCredits,
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
};