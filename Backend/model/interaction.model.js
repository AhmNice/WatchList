// models/interaction.model.js
import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  tmdbId: {
    type: Number,
    required: true
  },
  action: {
    type: String,
    enum: ["search", "playlist", "favorite"],
    required: true
  },
  timestamp: { type: Date, default: Date.now }
});

export const Interaction = mongoose.model("Interaction", interactionSchema);
