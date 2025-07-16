import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  movies: {
    type: [String]
  },
}, {
  timestamps: true
});

export default mongoose.model("Favorite", favoriteSchema);
