import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    maxlength: 180, // Maximum length for comment
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;