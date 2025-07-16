import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewText: {
    type: String,
    required: true
  },
  addedBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movieId: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Review = mongoose.model('Review', reviewSchema);
