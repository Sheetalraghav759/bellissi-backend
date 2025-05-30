import express from 'express';
const router = express.Router();
import { addImage, getAllImages, getImage, GetAllImagesForAdmin, deleteImage } from '../controllers/galleryController.js';
import { isLogin } from "../middleware/authMiddleware.js";


router.post('/addImage', isLogin, addImage);
router.get('/getAllImages', getAllImages);
router.get('/getImage/:id', getImage);
router.get('/getAllImagesForAdmin', isLogin, GetAllImagesForAdmin);
router.delete('/deleteImage/:id', isLogin,  deleteImage);

export default router;                      