
import express from 'express';
const router = express.Router();
import { createPopup, getPopup, getAllPopups, deletePopup, getAllPopUpsForAdmin } from '../controllers/popUpController.js';
import { isLogin } from "../middleware/authMiddleware.js";

router.post('/createPopup', createPopup);
router.get('/getAllPopups', getAllPopups);
router.get('/getPopup/:id', getPopup);
router.get('/getAllPopupsForAdmin', isLogin, getAllPopUpsForAdmin);
router.delete('/deletePopup/:id', isLogin, deletePopup);

export default router;
