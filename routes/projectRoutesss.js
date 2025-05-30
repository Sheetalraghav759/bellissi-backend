import express from 'express';

import {
 
  createProductController,
  getAllProductsController,
  deleteProductController,
} from "../controllers/projectController.js";
import { isLogin } from "../middleware/authMiddleware.js";


const router = express.Router();


// Define routes
router.post('/createProject', isLogin, createProductController);
// router.get('/getProject/:id', getPro);
router.get('/getAllProjects', getAllProductsController);
router.get('/getAllProjectsForAdmin', isLogin, getAllProductsController);
router.delete('/deleteProject/:pid', isLogin, deleteProductController);

export default router;
