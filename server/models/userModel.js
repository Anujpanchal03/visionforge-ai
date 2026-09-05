import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    creditBalance: { type: Number, default: 50 },
    createdAt: { type: Date, default: Date.now }
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;