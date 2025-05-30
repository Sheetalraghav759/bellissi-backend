import express from "express"
import { createProductController, deleteProductController, getAllProductsController, updateProductController } from "../controllers/productController.js";
import { isAdmin, isLogin } from "../middleware/authMiddleware.js";
const router = express.Router();


router.post("/create", createProductController)
router.get("/all",getAllProductsController)
router.put("/update/:pid",updateProductController)
router.delete("/delete/:pid",deleteProductController);
export default router;