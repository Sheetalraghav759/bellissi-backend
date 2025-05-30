import express from 'express';
const router = express.Router();
import { createReview, getAllReviews, getReview, updateReview, getAllReviewsForAdmin, deleteReview } from '../controllers/reviewController.js';
import { isAdmin, isLogin } from "../middleware/authMiddleware.js";

router.post('/createReview', createReview);
router.get('/getAllReviews',  getAllReviews);
router.get('/getReview/:id', getReview);
router.put('/updateReview/:id', isLogin, updateReview);
router.get('/getAllReviewsForAdmin', isLogin, getAllReviewsForAdmin);
router.delete('/deleteReview/:id', isLogin, deleteReview);
export default router;      