import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  photo: { type: String, required: true }, // Path to the image file
});

const Project = mongoose.model('Project', projectSchema);
export default Project;