import mongoose from "mongoose";

const generationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    prompt: { type: String, required: true },
    enhancedPrompt: { type: String },
    negativePrompt: { type: String },
    style: { type: String, default: 'Realistic' },
    aspectRatio: { type: String, default: '1:1' },
    resultImage: { type: String, required: true },
    creditsUsed: { type: Number, default: 1 },
    isFavorite: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now, index: true }
});

const generationModel = mongoose.models.generation || mongoose.model("generation", generationSchema);

export default generationModel;
