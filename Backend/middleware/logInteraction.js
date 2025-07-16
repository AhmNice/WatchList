import { Interaction } from '../model/interaction.model.js';

export const logInteraction = (action) => {
  return async (req, res, next) => {
    try {
      const userId = req.body.userId || req.params.userId || req.userId;
      const tmdbId = req.body.movieId || req.params.movieId;
      const { movies } = req.body;
      // 1️⃣ Log multiple movie interactions (e.g. when adding a whole playlist)
      if (Array.isArray(movies) && movies.length > 0 && userId) {
        await Promise.all(
          movies.map((id) =>
            new Interaction({
              userId,
              tmdbId: id.tmdbId,
              action,
            }).save()
          )
        );
        return next();
      }

      // 2️⃣ Log single movie interaction
      if (userId && tmdbId) {
        await new Interaction({
          userId,
          tmdbId,
          action,
        }).save();
      }

    } catch (err) {
      console.error('Failed to log interaction:', err.message);
    }

    next();
  };
};
