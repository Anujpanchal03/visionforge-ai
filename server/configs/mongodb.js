import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("Database Connected");
    })

    try {
        if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('------')) {
            const uri = process.env.MONGODB_URI.endsWith('/')
                ? `${process.env.MONGODB_URI}ai-image`
                : `${process.env.MONGODB_URI}/ai-image`;
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            return;
        }
    } catch (error) {
        console.warn(`Could not connect to configured MongoDB URI (${error.message}). Falling back to in-memory MongoDB...`);
    }

    try {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        const mongod = await MongoMemoryServer.create();
        const memoryUri = mongod.getUri();
        await mongoose.connect(`${memoryUri}ai-image`);
        console.log("Connected to In-Memory MongoDB database.");
    } catch (memError) {
        console.error("Failed to connect to fallback in-memory MongoDB:", memError);
    }
}

export default connectDB;