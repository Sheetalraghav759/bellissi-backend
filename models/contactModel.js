import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  message: { type: String, required: true },
  service: { type: String, required: true },
  createdAt: { type: Date, default: Date.now},
});

const Contact = mongoose.model('Contact', contactSchema);
export default Contact;