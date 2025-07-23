import mongoose from "mongoose";

const playlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  movies: [{
    type: String,
    ref: 'Movie'
  }],
  sharedWith: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  shared: {
    type: Boolean,
    default: false
  },
  shareCode:{
    type:String,
    required:true
  },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export const Playlist = mongoose.model('Playlist', playlistSchema);
