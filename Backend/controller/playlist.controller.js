import mongoose from "mongoose";
import { Playlist } from "../model/playlist.model.js";
import { populateMovies } from "../utils/populateMovies.js";
import { Movies } from "../model/movies.model.js";

// ✅ Create Playlist
export const createPlaylist = async (req, res) => {
  const { userId, playlist_name, description, movies } = req.body;

  if (!userId || !playlist_name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Required fields are empty',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID',
    });
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Movies must be a non-empty array',
    });
  }

  try {
    const existing = await Playlist.findOne({ title: playlist_name, userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You already have a playlist with this title',
      });
    }

    const movieIds = movies.map(movie => movie.tmdbId);

    const playlist = new Playlist({
      title: playlist_name,
      description,
      userId,
      movies: movieIds,
    });

    await populateMovies(movies)

    await playlist.save();

    return res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
      playlist,
    });

  } catch (error) {
    console.error('Error creating playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ✅ Get All Playlists for User
export const getUserPlaylists = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing user ID',
    });
  }

  try {

    const playlists = await Playlist.find({ userId }).lean();
    if (playlists.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No playlists yet',
        playlists: [],
      });
    }
    const playlistsWithMovies = await Promise.all(
      playlists.map(async (playlist) => {
        const movieDocs = await Movies.find({ tmdbId: { $in: playlist.movies } });
        return {
          ...playlist,
          movies: movieDocs,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: 'Playlists retrieved successfully',
      playlists: playlistsWithMovies,
    });

  } catch (error) {
    console.error('Error getting user playlists:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


// ✅ Get Playlist by ID
export const getPlaylistById = async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing playlist ID',
    });
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'No playlist found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Playlist retrieved successfully',
      playlist,
    });

  } catch (error) {
    console.error('Error getting playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ✅ Update Playlist
export const updatePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { movies, playlist_name, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid playlist ID',
    });
  }

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'No playlist found',
      });
    }

    if (playlist_name) playlist.title = playlist_name;
    if (description) playlist.description = description;

    if (Array.isArray(movies) && movies.length > 0) {
      const moviesId = movies.map(movie => movie.tmdbId);
      playlist.movies = Array.from(new Set([...playlist.movies, ...moviesId]));
    }
    await populateMovies(movies)
    await playlist.save();

    return res.status(200).json({
      success: true,
      message: 'Playlist updated successfully',
      playlist,
    });

  } catch (error) {
    console.error('Error updating playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ✅ Delete Playlist
export const deletePlaylist = async (req, res) => {
  const { playlistId } = req.params;

  if (!playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing playlist ID',
    });
  }

  try {
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    await playlist.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ✅ Remove Movie from Playlist
export const removeMovieFromPlaylist = async (req, res) => {
  const { movieId, playlistId } = req.params;
  if (!movieId || !playlistId || !mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or missing movie or playlist ID',
    });
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    if (!playlist.movies.includes(movieId)) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found in playlist',
      });
    }

    playlist.movies = playlist.movies.filter(id => id !== movieId);
    await playlist.save();

    return res.status(200).json({
      success: true,
      message: 'Movie removed from playlist',
      playlist,
    });

  } catch (error) {
    console.error('Error removing movie:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ✅ Create Empty Playlist
export const createEmptyPlaylist = async (req, res) => {
  const { userId, playlist_name, description } = req.body;

  if (!userId || !playlist_name || !description) {
    return res.status(400).json({
      success: false,
      message: 'Required fields are empty',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID',
    });
  }

  try {
    const existing = await Playlist.findOne({ title: playlist_name, userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You already have a playlist with this title',
      });
    }

    const playlist = new Playlist({
      title: playlist_name,
      description,
      userId,
    });

    await playlist.save();

    return res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
      playlist,
    });

  } catch (error) {
    console.error('Error creating empty playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// ✅ Create Shared Playlist
export const createSharedPlaylist = async (req, res) => {
  const { userId, playlist_name, description, shared, movies, users } = req.body;

  if (!userId || !playlist_name  || typeof shared !== 'boolean') {
    return res.status(400).json({
      success: false,
      message: 'Required fields are empty or invalid',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID',
    });
  }

  if (!Array.isArray(movies) || movies.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Movies must be a non-empty array',
    });
  }
  if(!Array.isArray(users) || users.length === 0){
     return res.status(400).json({
      success: false,
      message: 'Users must be a non-empty array',
    });
  }

  try {
    const existing = await Playlist.findOne({ title: playlist_name, userId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'You already have a playlist with this title',
      });
    }

    const movieIds = movies.map(movie => movie.tmdbId);

    const playlist = new Playlist({
      title: playlist_name,
      description,
      userId,
      movies: movieIds,
      shared,
    });
    if(users) playlist.users = users

    await playlist.save();

    return res.status(201).json({
      success: true,
      message: 'Shared playlist created successfully',
      playlist,
    });

  } catch (error) {
    console.error('Error creating shared playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
// remove users to shared playlist
export const removeUserFromSharedPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { usersToRemove } = req.body;

  // Validate input
  if (!Array.isArray(usersToRemove) || usersToRemove.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Users to remove list cannot be empty',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid playlist ID',
    });
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    // Make sure playlist has sharedWith field
    if (!Array.isArray(playlist.sharedWith)) {
      playlist.sharedWith = [];
    }

    // Filter out usersToRemove from sharedWith
    playlist.sharedWith = playlist.sharedWith.filter(
      userId => !usersToRemove.includes(userId.toString())
    );

    await playlist.save();

    return res.status(200).json({
      success: true,
      message: 'Users removed from shared playlist successfully',
      updatedSharedWith: playlist.sharedWith,
    });

  } catch (error) {
    console.error('Error removing users from shared playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const addUsersToSharedPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { usersToAdd } = req.body;

  // Validate input
  if (!Array.isArray(usersToAdd) || usersToAdd.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Users to add list cannot be empty',
    });
  }

  if (!mongoose.Types.ObjectId.isValid(playlistId)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid playlist ID',
    });
  }

  try {
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: 'Playlist not found',
      });
    }

    // Ensure sharedWith exists
    if (!Array.isArray(playlist.sharedWith)) {
      playlist.sharedWith = [];
    }

    // Add users (avoid duplicates using Set)
    const currentSharedSet = new Set(playlist.sharedWith.map(id => id.toString()));
    usersToAdd.forEach(userId => currentSharedSet.add(userId));

    playlist.sharedWith = Array.from(currentSharedSet);

    await playlist.save();

    return res.status(200).json({
      success: true,
      message: 'Users added to shared playlist successfully',
      sharedWith: playlist.sharedWith,
    });

  } catch (error) {
    console.error('Error adding users to shared playlist:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
