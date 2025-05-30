import Gallery from "../models/galleryModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name from the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up storage for Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${path.extname(file.originalname)}`);
    }
});

// Check file type
const checkFileType = (file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|svg|mp4/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only!');
    }
};

// Upload middleware
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');

// Add a new image (with upload)
export const addImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ success: false, message: err });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const { name } = req.body;
        const url = `${req.file.filename}`;

        try {
            const newImage = new Gallery({ name, url });
            await newImage.save();
            res.status(201).json({ success: true, data: newImage });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Server Error' });
        }
    });
};

// Get all images
export const getAllImages = async (req, res) => {
    try {
        const photos = await Gallery.find();
        if (!photos || photos.length === 0) {
            return res.status(404).json({ success: false, message: 'No images found' });
        }
        res.status(200).json({ success: true, data: photos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get all images for admin
export const GetAllImagesForAdmin = async (req, res) => {
    try {
        const photos = await Gallery.find();
        if (!photos || photos.length === 0) {
            return res.status(404).json({ success: false, message: 'No images found' });
        }
        res.status(200).json({ success: true, data: photos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get a single image by ID
export const getImage = async (req, res) => {
    try {
        const photo = await Gallery.findById(req.params.id);
        if (!photo) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }
        res.status(200).json({ success: true, data: photo });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};


// Delete an image  
export const deleteImage = async (req, res) => {
    const { id } = req.params;

    try {
        const image = await Gallery.findByIdAndDelete(id);
        
        if (!image) {
            return res.status(404).json({ success: false, message: 'Image not found' });
        }

        const fileName = path.basename(image.url);
        const filePath = path.join(__dirname, '../uploads', fileName);
        
        // Unlink the image file from the uploads folder
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Failed to delete file: ${unlinkErr.message}`);
                return res.status(500).json({ success: false, message: 'Failed to delete the image file' });
            }
        });

        res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
        console.error(`Error deleting image: ${error.message}`);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
