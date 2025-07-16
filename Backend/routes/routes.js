import express, { Router } from 'express'
import { changePassword, checkAuth, createUser, deactivateAccount, deactivationRequest, deleteAccountRequest, deleteUserAccount, forgetPasswordRequest, resendOTP, userLogin, userLogout, userPasswordChanged, userPasswordChangeRequest, verifyOTP } from '../controller/auth.controller.js'
import { otpResendLimiter } from '../middleware/otpResendLimiter.js'
import { verifySession } from '../utils/verifySession.js'
import { createEmptyPlaylist, createPlaylist, createSharedPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeMovieFromPlaylist, updatePlaylist } from '../controller/playlist.controller.js'
import { verifyOwnership } from '../utils/verifyOwnership.js'
import { getAllMovies, getMovieById, multi_search, searchMovie, trendingMovie } from '../controller/movie.controller.js'
import { addReview, getMovieReviews } from '../controller/review.controller.js'
import { addMovieToFavorite, getFavoriteMovies, removeFromFavorite } from '../controller/favorite.controller.js'
import { logInteraction } from '../middleware/logInteraction.js'
import { recommendationSystem } from '../controller/recommendation.controller.js'

//  authentications route
export const authRoute = express.Router()
authRoute.post('/create-account', createUser)
authRoute.post('/user-login', userLogin)
authRoute.post('/resend-otp', otpResendLimiter, resendOTP)
authRoute.post('/verify-otp', verifyOTP)
authRoute.get('/user-logout', userLogout)
authRoute.post('/account/deactivation-request', verifySession, deactivationRequest)
authRoute.post('/account/deactivation', verifySession, deactivateAccount)
authRoute.post('/account/delete-account-request', verifySession, deleteAccountRequest)
authRoute.delete('/account/delete-account', verifySession, deleteUserAccount)
authRoute.post('/account/password-reset-request', verifySession, userPasswordChangeRequest)
authRoute.post('/account/change-password', verifySession, userPasswordChanged)
authRoute.get('/account/check-auth', verifySession, checkAuth)
authRoute.post('/account/forget-password', forgetPasswordRequest)
authRoute.post('/account/password-reset', changePassword)
// playlist routes
export const playlistRoute = express.Router()
playlistRoute.post('/create-playlist', verifySession, createPlaylist)
playlistRoute.post('/create-shared-playlist', verifySession, createSharedPlaylist)
playlistRoute.post('/create-empty-playlist', verifySession, createEmptyPlaylist)
playlistRoute.get('/get-playlist/:playlistId', getPlaylistById)
playlistRoute.get('/get-userPlaylist/:userId',getUserPlaylists)
playlistRoute.patch('/update-playlist/:playlistId/:userId', verifySession, verifyOwnership,logInteraction('playlist'), updatePlaylist)
playlistRoute.delete('/delete-playlist/:playlistId/:userId', verifySession, verifyOwnership, deletePlaylist)
playlistRoute.delete('/remove-movie/:playlistId/:userId/:movieId', verifySession,verifyOwnership, removeMovieFromPlaylist)

// movie route
export const movieRoute = express.Router()
movieRoute.get('/trending', trendingMovie)
movieRoute.get('/all-movies', getAllMovies)
movieRoute.get('/search', searchMovie)
movieRoute.get('/multi-search',multi_search)
movieRoute.post('/add-review/:movieId',verifySession,  addReview)
movieRoute.get('/review/:movieId',verifySession,  getMovieReviews)
movieRoute.get('/:movieId', getMovieById)

// favorite route
export const favoriteRoute = express.Router()
favoriteRoute.get('/get-favorite/:userId',verifySession, getFavoriteMovies)
favoriteRoute.post('/addMovieToFavorite/:userId', logInteraction('favorite'), verifySession, addMovieToFavorite)
favoriteRoute.delete('/remove-movie/:movieId/:userId',verifySession,removeFromFavorite)

export const recommendationRoute = express.Router()
recommendationRoute.post('/recommend/:userId',verifySession, recommendationSystem)