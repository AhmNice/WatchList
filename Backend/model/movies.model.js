import mongoose from "mongoose";

const movieSchema = mongoose.Schema({

  title: {
    type: String,
    required: true
  },
  tmdbId: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    required: true
  },
  vote:{
    type:String
  },
  reviews:{
    type:String
  },
  director: { type: String },
  runtime:{type: Number},
  releaseYear: { type: Number },
  genre: { type: String },
  shared: { type: Boolean, default: false },
  addedBy: { type: String },
});


export const Movies = mongoose.model("Movie", movieSchema);
