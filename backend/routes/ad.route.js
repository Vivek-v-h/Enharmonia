import express from "express";
import protect from '../middleware/authMiddleware.js';
import { createAd, getAllAds, getUserAds, getAd, updateAd, deleteAd } from '../controllers/adPost.controller.js';
const router = express.Router();

router.post('/create-ad', protect, createAd);
router.get('/', getAllAds);
router.get('/my-ads', protect, getUserAds);
router.get('/:id', getAd);
router.put('/:id', protect, updateAd);
router.delete('/:id', protect, deleteAd);

export default router;