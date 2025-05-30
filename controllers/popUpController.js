
import Popup from '../models/popUpModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name from the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the uploads directory path
const uploadsDir = path.join(__dirname, '../uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Use the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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
    cb('Error: Images and videos only!');
  }
};

// Upload middleware (for single file)
const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // Limit file size to 15MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('photo'); // Use single file upload

// @desc    Create a new pop-up
export const createPopup = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err });
    }

    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { name } = req.body;

    // Path for the uploaded photo
    const photoPath = `${req.file.filename}`;

    try {
      const newPopup = new Popup({ name, photo: photoPath });
      await newPopup.save();
     return  res.status(201).json({ success: true, data: newPopup });
    } catch (error) {
    return   res.status(500).json({ success: false, message: 'Server error' });
    }
  });
};

// @desc    Get all pop-ups
export const getAllPopups = async (req, res) => {
  try {
    const popups = await Popup.find();
    if (!popups || popups.length === 0) {
      return res.status(404).json({ success: false, message: 'No pop-ups found' });
    }
  return   res.status(200).json({ success: true, data: popups });
  } catch (error) {
   return  res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get a single pop-up by ID
export const getPopup = async (req, res) => {
  try {
    const popup = await Popup.findById(req.params.id);
    if (!popup) {
      return res.status(404).json({ success: false, message: 'Pop-up not found' });
    }
 return    res.status(200).json({ success: true, data: popup });
  } catch (error) {
   return  res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const deletePopup = async (req, res) => {
  const { id } = req.params;

  try {
    const popup = await Popup.findByIdAndDelete(id);

    if (!popup) {
      return res.status(404).json({ success: false, message: 'Pop-up not found' });
    }

   
    // Ensure popup.photo is a string
    const photoFilename = Array.isArray(popup.photo) ? popup.photo[0] : popup.photo;

    // Correctly construct the path to the uploaded file
    const photoPath = path.join(__dirname, '../uploads', photoFilename);

    
    // Delete the image file
    fs.unlink(photoPath, (unlinkErr) => {
      if (unlinkErr) {
        console.error(`Failed to delete file: ${unlinkErr.message}`);
        return res.status(500).json({ success: false, message: 'Failed to delete the image file' });
      }

      res.status(200).json({ success: true, message: 'Pop-up deleted successfully' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// @desc    Get all pop-ups for admin
export const getAllPopUpsForAdmin = async (req, res) => {
  try {
    const popups = await Popup.find();
    if (!popups || popups.length === 0) {
      return res.status(200).json({ success: true, message: 'No pop-ups found' });
    }


    return  res.status(200).json({ success: true, data: popups });
  } catch (error) {
    res.status(500).json({ success: false, message:error.message });
  }
};
