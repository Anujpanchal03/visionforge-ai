import axios from 'axios';
import FormData from 'form-data';
import userModel from '../models/userModel.js';
import generationModel from '../models/generationModel.js';

// Style enhancement descriptors (conservative, preserving user's exact subject)
const STYLE_MODIFIERS = {
  Realistic: 'photorealistic, 8k resolution, highly detailed, realistic textures, natural lighting, sharp focus',
  Cinematic: 'cinematic lighting, 35mm film photograph, dramatic depth of field, atmospheric, 8k resolution',
  Anime: 'modern high quality anime artwork, vibrant colors, clean lineart, crisp details, studio quality',
  '3D Render': '3D digital render, Octane render, raytracing, smooth subsurface scattering, polished materials',
  Illustration: 'clean editorial digital illustration, expressive brushwork, harmonious color palette, fine art details',
  Natural: 'natural lighting, lifelike colors, authentic atmosphere, high resolution'
};

// Default negative prompt tokens to suppress common artifacts without mutating user subjects
const DEFAULT_NEGATIVE_PROMPT = 'blurry, low quality, distorted, malformed, duplicate objects, extra limbs, extra fingers, missing fingers, bad anatomy, deformed face, distorted eyes, cropped subject, text, watermark, unrelated objects';

/**
 * Deterministic prompt construction engine.
 * Preserves user's exact intent and subjects while optimizing prompt adherence.
 */
export const buildStructuredPrompt = ({ prompt, style, negativePrompt }) => {
  const cleanPrompt = (prompt || '').trim();
  if (!cleanPrompt) return '';

  let styleModifier = '';
  if (style && STYLE_MODIFIERS[style]) {
    styleModifier = STYLE_MODIFIERS[style];
  }

  // Combine subject prompt with conservative style guidance
  let structured = cleanPrompt;
  if (styleModifier && !cleanPrompt.toLowerCase().includes(style.toLowerCase())) {
    structured = `${cleanPrompt}, ${styleModifier}`;
  }

  // Format negative constraints if provided and ensure user's requested words are not suppressed
  const activeNegative = negativePrompt !== undefined ? negativePrompt.trim() : DEFAULT_NEGATIVE_PROMPT;
  if (activeNegative) {
    const userWords = new Set(cleanPrompt.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/));
    const filteredNegatives = activeNegative
      .split(',')
      .map(item => item.trim())
      .filter(token => token.length > 0 && !userWords.has(token.toLowerCase()))
      .join(', ');

    if (filteredNegatives) {
      // Append negative modifier tag cleanly for SDXL prompt adherence
      const withNegative = `${structured} --no ${filteredNegatives}`;
      if (withNegative.length <= 1000) {
        structured = withNegative;
      }
    }
  }

  // Enforce max 1000 characters limit
  if (structured.length > 1000) {
    structured = structured.substring(0, 997) + '...';
  }

  return structured;
};

/**
 * Controller function to generate image from prompt with prompt adherence & retry
 * POST /api/image/generate-image
 */
export const generateImage = async (req, res) => {
  try {
    const { userId, prompt, style = 'Realistic', negativePrompt, aspectRatio = '1:1' } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a valid prompt describing the image you want to create.' });
    }

    // Verify user & check credit balance
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found. Please log in again.' });
    }

    if (user.creditBalance < 1) {
      return res.status(400).json({
        success: false,
        message: "You don't have enough credits. Please add credits to continue.",
        creditBalance: user.creditBalance
      });
    }

    // Build structured prompt adhering strictly to user intent
    const structuredPrompt = buildStructuredPrompt({ prompt, style, negativePrompt });

    // Call Image Generation API with retry mechanism (up to 2 retries)
    let imageData = null;
    let lastError = null;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const formdata = new FormData();
        formdata.append('prompt', structuredPrompt);

        const response = await axios.post('https://clipdrop-api.co/text-to-image/v1', formdata, {
          headers: {
            'x-api-key': process.env.CLIPDROP_API,
            ...formdata.getHeaders()
          },
          responseType: 'arraybuffer',
          timeout: 45000
        });

        if (response.data && response.data.length > 0) {
          imageData = response.data;
          break;
        }
      } catch (err) {
        lastError = err;
        console.warn(`Image generation attempt ${attempt} failed:`, err.message);
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }

    if (!imageData) {
      const errorMessage = lastError?.response?.data
        ? Buffer.from(lastError.response.data).toString('utf-8')
        : lastError?.message || 'Image generation service temporarily unavailable';

      console.error('Image generation error:', errorMessage);
      return res.status(500).json({
        success: false,
        message: "We couldn't generate this image. Your credits were not charged.",
        creditBalance: user.creditBalance
      });
    }

    // Convert binary arrayBuffer to base64 Data URL
    const base64Image = Buffer.from(imageData, 'binary').toString('base64');
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Atomically deduct 1 credit
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: user._id, creditBalance: { $gte: 1 } },
      { $inc: { creditBalance: -1 } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "Credit deduction failed due to insufficient balance.",
        creditBalance: 0
      });
    }

    // Save generation to history
    const generationRecord = await generationModel.create({
      userId: user._id,
      prompt: prompt.trim(),
      enhancedPrompt: structuredPrompt,
      negativePrompt: negativePrompt || DEFAULT_NEGATIVE_PROMPT,
      style,
      aspectRatio,
      resultImage,
      creditsUsed: 1
    });

    return res.json({
      success: true,
      message: 'Image created successfully',
      resultImage,
      creditBalance: updatedUser.creditBalance,
      generation: {
        id: generationRecord._id,
        prompt: generationRecord.prompt,
        style: generationRecord.style,
        aspectRatio: generationRecord.aspectRatio,
        createdAt: generationRecord.createdAt,
        isFavorite: generationRecord.isFavorite
      }
    });

  } catch (error) {
    console.error('Generate image controller error:', error);
    res.status(500).json({
      success: false,
      message: 'An unexpected error occurred while generating your image. Your credits were not charged.'
    });
  }
};

/**
 * Controller to fetch user's personal generation history
 * GET /api/image/history
 */
export const getGenerationHistory = async (req, res) => {
  try {
    const { userId } = req.body;
    const history = await generationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(60)
      .select('-userId');

    res.json({ success: true, history });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to load generation history' });
  }
};

/**
 * Controller to delete a generation item
 * DELETE /api/image/history/:id
 */
export const deleteGeneration = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const deleted = await generationModel.findOneAndDelete({ _id: id, userId });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Image not found or unauthorized' });
    }

    res.json({ success: true, message: 'Image deleted from gallery' });
  } catch (error) {
    console.error('Delete generation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Controller to toggle favorite status
 * PATCH /api/image/history/:id/favorite
 */
export const toggleFavoriteGeneration = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;

    const item = await generationModel.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Image not found or unauthorized' });
    }

    item.isFavorite = !item.isFavorite;
    await item.save();

    res.json({ success: true, isFavorite: item.isFavorite });
  } catch (error) {
    console.error('Favorite toggle error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};