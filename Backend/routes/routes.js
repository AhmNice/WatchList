import express, { Router } from 'express'
import { createUser, deactivateAccount, deactivationRequest, deleteAccountRequest, deleteUserAccount, resendOTP, userLogin, userLogout, userPasswordChanged, userPasswordChangeRequest, verifyOTP } from '../controller/auth.controller.js'
import { otpResendLimiter } from '../middleware/otpResendLimiter.js'
import { verifySession } from '../utils/verifySession.js'
import { createEmptyPlaylist, createPlaylist, createSharedPlaylist, deletePlaylist, getPlaylistById, getUserPlaylists, removeMovieFromPlaylist, updatePlaylist } from '../controller/playlist.controller.js'
import { verifyOwnership } from '../utils/verifyOwnership.js'
import { getAllMovies, getMovieById, multi_search, searchMovie, trendingMovie } from '../controller/movie.controller.js'

//  authentications route
export const authRoute = express.Router()
authRoute.post('/create-account', createUser)
authRoute.post('/user-login', userLogin)
authRoute.post('/resend-otp', otpResendLimiter, resendOTP)
authRoute.post('/verify-otp', verifyOTP)
authRoute.post('/user-logout', userLogout)
authRoute.post('/account/deactivation-request', verifySession, deactivationRequest)
authRoute.post('/account/deactivation', verifySession, deactivateAccount)
authRoute.post('/account/delete-account-request', verifySession, deleteAccountRequest)
authRoute.delete('/account/delete-account', verifySession, deleteUserAccount)
authRoute.post('/account/password-reset-request', verifySession, userPasswordChangeRequest)
authRoute.post('/account/change-password', verifySession, userPasswordChanged)
// playlist routes
export const playlistRoute = express.Router()
playlistRoute.post('/create-playlist', verifySession, createPlaylist)
playlistRoute.post('/create-shared-playlist', verifySession, createSharedPlaylist)
playlistRoute.post('/create-empty-playlist', verifySession, createEmptyPlaylist)
playlistRoute.get('/get-playlist/:playlistId', getPlaylistById)
playlistRoute.get('/get-userPlaylist/:userId',getUserPlaylists)
playlistRoute.patch('/update-playlist/:playlistId/:userId', verifySession, verifyOwnership, updatePlaylist)
playlistRoute.delete('/delete-playlist/:playlistId/:userId', verifySession, verifyOwnership, deletePlaylist)
playlistRoute.delete('/remove-movie/:playlistId/:userId/:movieId', verifySession,verifyOwnership, removeMovieFromPlaylist)

// movie route
export const movieRoute = express.Router()
movieRoute.get('/trending', trendingMovie)
movieRoute.get('/all-movies', getAllMovies)
movieRoute.get('/search', searchMovie)
movieRoute.get('/multi-search',multi_search)

movieRoute.get('/:movieId', getMovieById)