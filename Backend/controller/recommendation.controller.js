import { Interaction } from "../model/interaction.model.js";
import { Playlist } from "../model/playlist.model.js";
import axios from "axios";
const movieGenres = [
  { id: 28, name: "Action" }, { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" }, { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" }, { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" }, { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" }, { id: 36, name: "History" },
  { id: 27, name: "Horror" }, { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" }, { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" }, { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" }, { id: 10752, name: "War" },
  { id: 37, name: "Western" }
];

const movieBaseUrl = 'https://api.themoviedb.org/3';

const genreName = (genres) => {
  if (!Array.isArray(genres)) {
    console.warn("Invalid genres input:", genres); // 👀 for debugging
    return [];
  }

  return movieGenres
    .filter((genre) => genres.includes(genre.id))
    .map((genre) => genre.name);
};


export const recommendationSystem = async (req, res) => {
  const { userId } = req.body || req.params;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required"
    });
  }

  try {
    const interactions = await Interaction.find();
    const userPlaylists = await Playlist.find({ userId });

    // Get movie IDs from playlists
    const userMoviesArray = userPlaylists.flatMap(p => p.movies);

    console.log("Playlist movies:", userMoviesArray);

    const headers = {
      Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      accept: "application/json"
    };

    /*
      1️⃣ Fetch playlist movie details
    */
    const playlistMoviePromises = userMoviesArray.map(id =>
      axios.get(`${movieBaseUrl}/movie/${id}`, { headers })
    );

    /*
      2️⃣ Fetch extra movies from TMDB
      (example: popular movies)
    */
    const extraMoviesPromise = axios.get(
      `${movieBaseUrl}/movie/popular`,
      { headers }
    );

    const [playlistResults, extraMoviesResponse] = await Promise.all([
      Promise.allSettled(playlistMoviePromises),
      extraMoviesPromise
    ]);

    const allMovies = {};

    /*
      3️⃣ Add playlist movies
    */
    playlistResults.forEach(result => {
      if (result.status === "fulfilled") {
        const data = result.value.data;

        const genreIds = Array.isArray(data.genres)
          ? data.genres.map(g => g.id)
          : [];

        allMovies[String(data.id)] = {
          title: data.title,
          genres: genreName(genreIds)
        };
      }
    });

    /*
      4️⃣ Add extra TMDB movies
    */
    const extraMovies = extraMoviesResponse.data.results || [];

    extraMovies.forEach(movie => {
      // avoid duplicates
      if (!allMovies[movie.id]) {
        allMovies[String(movie.id)] = {
          title: movie.title,
          genres: genreName(movie.genre_ids || [])
        };
      }
    });

    console.log("Total movies in DB:", Object.keys(allMovies).length);

    const payload = {
      userId,
      interactions,
      allMovies
    };

    const url = process.env.RECOMMENDATION_URL;

    const recommendations = await axios.post(url, payload);

    return res.status(200).json({
      success: true,
      recommendations: recommendations.data
    });

  } catch (error) {
    console.error("Recommendation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Something went wrong with recommendations"
    });
  }
};
