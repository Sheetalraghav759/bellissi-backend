import Service from '../models/serviceModel.js';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

// Promisify fs.unlink for async/await usage
const unlinkAsync = promisify(fs.unlink);

// Create a new service
export const createService = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file.path; // Path of the uploaded file
    const newService = new Service({ title, description, image });
    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllServicesforAdmin = async (req, res) => {
  try {
    const services = await Service.find();
    if (!services) return res.status(404).json({ message: 'No services found' });

    
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get a single service by ID
export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the service exists
    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // If a new file is uploaded
    if (req.file) {
      const oldFilePath = path.join(process.cwd(), existingService.image);

      // Check if old file exists before deleting
      if (fs.existsSync(oldFilePath)) {
        await unlinkAsync(oldFilePath); // Delete the old file
      }

      // Update the service with the new file path
      existingService.image = req.file.path;
    }

    // Update other fields (only if provided)
    existingService.title = req.body.title || existingService.title;
    existingService.description = req.body.description || existingService.description;

    const updatedService = await existingService.save();
    res.status(200).json(updatedService);
  } catch (error) {
    // Multer specific error handling
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: `Multer error: ${error.message}` });
    }

    res.status(500).json({ message: error.message });
  }
};

// Delete a service by ID
export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) return res.status(404).json({ message: 'Service not found' });

    // Delete the associated file from the uploads directory
    const filePath = path.join(process.cwd(), deletedService.image);
    await unlinkAsync(filePath);
    
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: `Error deleting service :' ${error.message}` });
  }
};
