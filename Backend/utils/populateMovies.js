import { Movies } from '../model/movies.model.js'

export const populateMovies = async (movies) => {
  for (const movieData of movies) {
    let movie = await Movies.findOne({ tmdbId: movieData.tmdbId });
    if (!movie) {
      const newMovie = new Movies(movieData);
      await newMovie.save();
    }
  }
}