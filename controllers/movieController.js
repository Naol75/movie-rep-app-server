const Movie = require("../models/Movie");
const User = require("../models/User");

const movieController = {
  addMovieToFavourites: async (req, res) => {
    try {
      const { userId, movieTitle } = req.body;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const lowerCaseMovieTitle = movieTitle.toLowerCase();
      if (
        !user.favouriteItems ||
        !user.favouriteItems.some(
          (item) => item && item.toLowerCase() === lowerCaseMovieTitle
        )
      ) {
        if (!user.favouriteItems) {
          user.favouriteItems = [];
        }

        user.favouriteItems.push(lowerCaseMovieTitle);

        await user.save();

        res
          .status(200)
          .json({ message: "Película agregada a favoritos con éxito" });
      } else {
        res.status(200).json({ message: "La película ya está en favoritos" });
      }
    } catch (error) {
      console.error("Error al agregar película a favoritos", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  deleteMovieFromFavourites: async (req, res) => {
    try {
      const { userId, movieId } = req.body;

      const user = await User.findById(userId);

      user.favouriteItems = user.favouriteItems.filter(
        (item) => item !== movieId
      );
      await user.save();

      res
        .status(200)
        .json({ message: "Película quitada de favoritos con éxito" });
    } catch (error) {
      console.error("Error al quitar película de favoritos", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};

module.exports = movieController;
