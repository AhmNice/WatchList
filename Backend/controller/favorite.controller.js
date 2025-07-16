import mongoose from "mongoose";
import Favorite from "../model/favorite.model.js";


export const getFavoriteMovies = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid user id is required',
    });
  }

  try {
    const favorite = await Favorite.findOne({ ownerId: userId });

    if (!favorite || favorite.movies.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No favorite movies yet',
        favorites: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Favorites retrieved',
      favorites: favorite.movies,
    });
  } catch (error) {
    console.error('Error retrieving favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


export const addMovieToFavorite = async (req, res) => {

  const { movieId } = req.body;
  const { userId } = req.params;

  if (!userId || !movieId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid userId and movieId are required',
    });
  }

  try {
    let favorite = await Favorite.findOne({ ownerId: userId });

    if (!favorite) {
      favorite = new Favorite({
        ownerId: userId,
        movies: [movieId],
      });
      await favorite.save();
      return res.status(201).json({
        success: true,
        message: 'Movie added to favorites',
        favorites:favorite
      });
    }

    // Avoid duplicates
    if (!favorite.movies.includes(movieId)) {
      favorite.movies.push(movieId);
      await favorite.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Favorites updated',
      favorites:favorite
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


export const removeFromFavorite = async (req, res) => {
  const { userId, movieId } = req.params;
  if (!userId || !movieId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid userId and movieId are required',
    });
  }

  try {
    const favorite = await Favorite.findOne({ ownerId: userId });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorites not found',
      });
    }

    favorite.movies = favorite.movies.filter(id => id !== movieId);
    await favorite.save();

    return res.status(200).json({
      success: true,
      message: 'Movie removed from favorites',
      favorites:favorite
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
