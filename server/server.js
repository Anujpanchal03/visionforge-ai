import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import userRouter from './routes/userRoutes.js';
import connectDB from './configs/mongodb.js';
import imageRouter from './routes/imageRoutes.js';

// App Config
const PORT = process.env.PORT || 4000;
const app = express();

// Connect to MongoDB
await connectDB();

// Initialize Middlewares
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors());

// API routes
app.use('/api/user', userRouter);
app.use('/api/image', imageRouter);

app.get('/', (req, res) => res.json({
    status: 'online',
    service: 'VisionForge AI API',
    version: '2.0.0'
}));

app.listen(PORT, () => console.log(`VisionForge AI Server running on port ${PORT}`));
