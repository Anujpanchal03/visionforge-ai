import express from 'express';
import {
  generateImage,
  getGenerationHistory,
  deleteGeneration,
  toggleFavoriteGeneration
} from '../controllers/imageController.js';
import authUser from '../middlewares/auth.js';

const imageRouter = express.Router();

imageRouter.post('/generate-image', authUser, generateImage);
imageRouter.get('/history', authUser, getGenerationHistory);
imageRouter.delete('/history/:id', authUser, deleteGeneration);
imageRouter.patch('/history/:id/favorite', authUser, toggleFavoriteGeneration);

export default imageRouter;