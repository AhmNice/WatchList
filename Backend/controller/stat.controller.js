import mongoose from 'mongoose'
import { Playlist } from '../model/playlist.model.js'
import Favorite from '../model/favorite.model.js'
import { Movies } from '../model/movies.model.js'

export const getUserStats = async (req, res) => {
  const { userId } = req.params

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: 'Valid user ID is required',
    })
  }

  try {
    const playlists = await Playlist.find({ userId }).select('movies').lean()
    const favorite = await Favorite.findOne({ ownerId: userId }).select('movies').lean()

    const totalPlaylists = playlists.length
    const totalMoviesInPlaylists = playlists.reduce(
      (total, playlist) => total + (playlist.movies?.length || 0),
      0
    )
    const totalFavoriteMovies = favorite?.movies?.length || 0

    const movieIds = [
      ...playlists.flatMap((playlist) => playlist.movies || []),
      ...(favorite?.movies || []),
    ]

    const uniqueMovieIds = [...new Set(movieIds)]

    let totalRuntimeMinutes = 0
    if (uniqueMovieIds.length > 0) {
      const movies = await Movies.find({ tmdbId: { $in: uniqueMovieIds } })
        .select('runtime')
        .lean()

      totalRuntimeMinutes = movies.reduce(
        (total, movie) => total + (Number(movie.runtime) || 0),
        0
      )
    }

    const totalWatchTimeHours = Number((totalRuntimeMinutes / 60).toFixed(2))

    return res.status(200).json({
      success: true,
      message: 'User stats retrieved successfully',
      stats: {
        totalPlaylists,
        totalFavoriteMovies,
        totalMoviesInPlaylists,
        totalMoviesOverall: uniqueMovieIds.length,
        totalRuntimeMinutes,
        totalWatchTimeHours,
      },
    })
  } catch (error) {
    console.error('Error getting user stats:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
