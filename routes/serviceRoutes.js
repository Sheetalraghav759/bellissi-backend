import express from 'express';
import multer from 'multer';
import path from 'path';
const router = express.Router();

import { isLogin } from "../middleware/authMiddleware.js";
import { createService, deleteService, getAllServices, getAllServicesforAdmin, getService, updateService } from './../controllers/serviceController.js';


// Set up multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Directory to store uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // File name with timestamp
  },
});

const upload = multer({ storage: storage });

router.post('/createService', upload.single('photo'), isLogin, createService);
router.get('/getService/:id', getService);
router.get('/getAllServices', getAllServices);
router.get('/getAllServicesforAdmin', isLogin, getAllServicesforAdmin);
router.put('/updateService/:id', upload.single('photo'), isLogin, updateService);
router.delete('/deleteService/:id', isLogin, deleteService);




export default router;
