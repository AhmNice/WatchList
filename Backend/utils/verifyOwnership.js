import mongoose from "mongoose"
import { User } from "../model/user.model.js"
import { Playlist } from "../model/playlist.model.js"

export const verifyOwnership = async (req, res, next) => {
  const { userId, playlistId } = req.params
  if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user id or playlist id'
    })
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found'
      })
    }
    const playlist = await Playlist.findById(playlistId) 
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'No Playlist found'
      })
    }
    if (playlist.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      })
    }
    next()
  } catch (error) {
    console.log('Error trying to verify ownership', error.message)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}