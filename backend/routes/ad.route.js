import express from "express";
import protect from '../middleware/authMiddleware.js';
import { 
  createAd, 
  getAllAds, 
  getUserAds, 
  getAd, 
  updateAd, 
  deleteAd,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from '../controllers/adPost.controller.js';

const router = express.Router();

// Ad CRUD routes
router.post('/createAd', protect, createAd);
router.get('/getall', getAllAds);
router.get('/my-ads', protect, getUserAds);
router.get('/:id', getAd);
router.put('/:id', protect, updateAd);
router.delete('/:id', protect, deleteAd);

// Wishlist routes
router.post('/:id/wishlist', protect, addToWishlist);
router.delete('/:id/wishlist', protect, removeFromWishlist);
router.get('/wishlist/mine', protect, getWishlist);

export default router;