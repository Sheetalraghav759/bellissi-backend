import express from 'express';
const router = express.Router();
import { saveContact, getAllContactsController } from '../controllers/contactController.js';
import { isLogin } from "../middleware/authMiddleware.js";


// POST route to handle form submission
router.post('/send-mail', saveContact);
router.get('/allContacts', isLogin, getAllContactsController);

export default router
