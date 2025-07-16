import mongoose from 'mongoose';
import { Review } from '../model/review.model.js'
export const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!movieId) {
    return res.status(400).json({
      success: false,
      message: 'Movie id is required'
    });
  }

  try {
    const reviews = await Review.find({ movieId })
      .populate('addedBy', 'username email profilePic')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // latest first

    const total = await Review.countDocuments({ movieId });

    res.status(200).json({
      success: true,
      message: 'Reviews retrieved',
      reviews,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.log('Error fetching reviews:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export const addReview = async (req, res) => {
  const { movieId } = req.params;
  const { review, userId } = req.body;

  // Validate input
  if (!movieId || !review || !userId) {
    return res.status(400).json({
      success: false,
      message: 'Movie ID, review, and user ID are required'
    });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user id'
    });
  }
  try {
    const newReview = new Review({
      reviewText: review,
      addedBy: userId,
      movieId: movieId
    });

    await newReview.save()
    res.status(201).json({
      success:true,
      message:'Review added'
    })

  } catch (error) {
    console.error('Error adding review:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};