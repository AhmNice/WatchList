import axios from 'axios'
const movieBaseUrl = 'https://api.themoviedb.org/3'
export const trendingMovie = async (req, res) => {
  const url = 'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1';
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        accept: 'application/json'
      }
    });
    const movieList = response.data.results.map(movie => ({
      movieId: movie.id,
      title: movie.title,
      poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    }));
    return res.status(200).json({
      success: true,
      message: 'list of all trending movies',
      movies: movieList
    })
  } catch (error) {
    console.log('Error trying to get trending movies', error.message)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
export const getMovieById = async (req, res) => {
  const { movieId } = req.params;
  if (!movieId) {
    return res.status(400).json({
      success: false,
      message: 'movie id is required'
    });
  }
  try {
    const response = await axios.get(`${movieBaseUrl}/movie/${movieId}`, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        accept: 'application/json'
      }
    });
    const movie = response.data;
    return res.status(200).json({
      success: true,
      message: 'The details for the requested movie',
      movie: movie
    });
  } catch (error) {
    console.log('Error trying to get movie by id', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
// getting 5 pages of movies from the movie database
export const getAllMovies = async (req, res) => {
  const url = `${movieBaseUrl}/discover/movie`;
  const allMovies = [];
  const maxPage = 5;

  try {
    for (let page = 1; page <= maxPage; page++) {
      const response = await axios.get(`${url}?page=${page}`, {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
          accept: 'application/json'
        }
      });

      for (const movie of response.data.results) {
        // Fetch full movie details
        const [detailsRes, creditsRes] = await Promise.all([
          axios.get(`${movieBaseUrl}/movie/${movie.id}`, {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`
            }
          }),
          axios.get(`${movieBaseUrl}/movie/${movie.id}/credits`, {
            headers: {
              Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`
            }
          })
        ]);

        const directorObj = creditsRes.data.crew.find(c => c.job === 'Director');
        const castArr = creditsRes.data.cast.slice(0, 5).map(c => c.name); // Top 5 cast

        allMovies.push({
          tmdbId: movie.id,
          title: movie.title,
          poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          genre_ids: movie.genre_ids,
          director: directorObj?.name || null,
          cast: castArr,
          runtime: detailsRes.data.runtime,
          releaseYear: movie.release_date ? Number(movie.release_date.slice(0, 4)) : undefined,
          vote: movie.vote_average?.toString()
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Movies from page 1 to ${maxPage}`,
      movieList: allMovies
    });

  } catch (error) {
    console.error('Error trying to fetch movie lists:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
// search for a movie
export const searchMovie = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }
  const url = `${movieBaseUrl}/search/movie?query=${encodeURIComponent(query)}`
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
        accept: 'application/json'
      }
    })
    res.status(200).json({
      success: true,
      message: 'Search Result',
      result: response.data.results
    })
  } catch (error) {
    console.log('Error trying to fetch search result', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
// multi search
export const multi_search = async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }
  try {
    const url = `${movieBaseUrl}/search/multi?query=${encodeURIComponent(query)}`;
    const response = await axios.get(url, {
      headers:{
        Authorization: `Bearer ${process.env.TMDB_BEARER_TOKEN}`,
      }
    });
    res.status(200).json({
      success:true,
      message:'Search result',
      results: response.data.results
    })

  } catch (error) {
    console.log('Error trying to search with multi search', error.message)
    return res.status(500).json({
      success:false,
      message:'Internal server error'
    })
  }
}
// getting movies base on genre
export const getMovieByGenre = async(req, res)=>{
  const { genre_id } = req.body
  if(!genre_id){
    return res.status(400).json({
      success:false,
      message:'Genre is required, please select a genre'
    })
  }
  try {
    const url = `${movieBaseUrl}`
  } catch (error) {

  }
}