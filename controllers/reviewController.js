import Review from '../models/reviewModel.js';

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const newReview = new Review({ name, rating, comment });
    await newReview.save();
    return res.status(201).json({ message: 'Review created successfully', review: newReview });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create review', error });
  }
};

// Get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
};

export const getAllReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await Review.find();
    return res.status(200).json({ reviews });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reviews', error });
  }
}

// Get a single review by ID
export const getReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json({ review });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch review', error });
  }
};

// Update a review by ID
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json({ message: 'Review updated successfully', review });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update review', error });
  }
};



// Delete a review by ID
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    return res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete review', error });
  }
};
