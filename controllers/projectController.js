import projectModel from "../models/projectModel.js"
import fs from "fs";

import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Error: Images Only!"));
    }
  },
}).single("photo"); // Changed to handle single file upload
  
const deleteUploadedFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Failed to delete file:", filePath, err);
    }
  });
};

export const createProductController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).send({ success: false, message: err.message });
    }

    const { name } = req.body;
    const fileName = req.file ? req.file.filename : ""; // Get only the file name

    if (!name ) {
      if (fileName)
        deleteUploadedFile(path.join(__dirname, "../uploads", fileName));
      return res
        .status(400)
        .send({ success: false, message: "Name  are required" });
    }

    try {
    
      const existingProduct = await projectModel.findOne({ name });

      if (existingProduct) {
        if (fileName)
          deleteUploadedFile(path.join(__dirname, "../uploads", fileName));
        return res.status(400).send({
          success: false,
          message: "Product with this name already exists",
        });
      }

      const product = new projectModel({
        name,
   
        photo: fileName,
    
      });

      await product.save();
      return res.status(201).send({ success: true, product });
    } catch (error) {
      if (fileName)
        deleteUploadedFile(path.join(__dirname, "../uploads", fileName));
      console.error("Error saving product:", error);
      return res.status(500).send({ success: false, message: error.message });
    }
  });
};
export const updateProductController = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Error during file upload:", err);
      return res.status(400).send({ success: false, message: err.message });
    }

    const { name } = req.body;
    const { pid } = req.params;
    const newFile = req.file ? req.file : null; // New file info if uploaded

    try {
      const product = await projectModel.findById(pid);
      if (!product) {
        if (newFile)
          deleteUploadedFile(
            path.join(__dirname, "../uploads", newFile.filename)
          );
        return res
          .status(404)
          .send({ success: false, message: "Product not found" });
      }

      // Prepare updated fields
      const updatedFields = {
        name: name || product.name,
    
        photo: newFile ? newFile.filename : product.photo, // Use new photo if uploaded
      };

      // Delete old photo if new photo is uploaded and different from the existing one
      if (newFile && product.photo && product.photo !== newFile.filename) {
        const oldPhotoPath = path.join(__dirname, "../uploads", product.photo);
        deleteUploadedFile(oldPhotoPath);
      }

      const updatedProduct = await projectModel.findByIdAndUpdate(
        pid,
        updatedFields,
        { new: true }
      );

      if (!updatedProduct) {
        if (newFile)
          deleteUploadedFile(
            path.join(__dirname, "../uploads", newFile.filename)
          );
        return res
          .status(400)
          .send({ success: false, message: "Failed to update product" });
      }

      return res.status(200).send({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      if (newFile)
        deleteUploadedFile(
          path.join(__dirname, "../uploads", newFile.filename)
        );
      console.error("Error updating product:", error);
      return res.status(500).send({ success: false, message: error.message });
    }
  });
};



export const deleteProductController = async (req, res) => {
  const { pid } = req.params;

  try {
    // Find the product by ID
    const product = await projectModel.findById(pid);
    if (!product) {
      return res
        .status(404)
        .send({ success: false, message: "Product not found" });
    }

    // Delete the photo if it exists
    if (product.photo) {
      const photoPath = path.join(__dirname, "../uploads", product.photo);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error("Error deleting photo:", err);
        }
      });
    }

    // Delete the product record
    await projectModel.findByIdAndDelete(pid);

    return res
      .status(202)
      .send({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
};


export const getAllProductsController = async (req, res) => {
  try {
    // Fetch all products
    const products = await projectModel.find({});

    if (!products || products.length === 0) {
      return res
        .status(404)
        .send({ success: false, message: "No products found" });
    }

    // Format the response to include only necessary field

    return res.status(200).send({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).send({ success: false, message: error.message });
  }
};
