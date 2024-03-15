const Movie = require("../models/Movie");
const User = require("../models/User");

const movieController = {
  addMovieToFavourites: async (req, res) => {
    try {
      console.log(
        "Recibida solicitud para agregar película a favoritos:",
        req.body
      );
      const { userId, movieId } = req.body;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      if (
        !user.favouriteItems ||
        !user.favouriteItems.some((item) => item && item === movieId)
      ) {
        if (!user.favouriteItems) {
          user.favouriteItems = [];
        }

        user.favouriteItems.push(movieId);

        await user.save();

        res
          .status(200)
          .json({ message: "Película agregada a favoritos con éxito" });
      } else {
        res.status(200).json({ message: "La película ya está en favoritos" });
      }
    } catch (error) {
      console.error("Error al agregar película a favoritos", error);
    }
  },
  deleteMovieFromFavorites: async (req, res) => {
    try {
      console.log("Received request to delete movie from favorites:", req.body);
      const { userId, movieId } = req.body;
      console.log(
        "Deleting from favorites. User ID:",
        userId,
        "Movie Title:",
        movieId
      );

      const user = await User.findById(userId);

      if (!user) {
        console.log("User not found");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      if (user.favouriteItems && user.favouriteItems.length > 0) {
        const updatedFavorites = user.favouriteItems.filter(
          (item) => item && item != movieId
        );

        if (
          JSON.stringify(user.favouriteItems) !==
          JSON.stringify(updatedFavorites)
        ) {
          user.favouriteItems = updatedFavorites;
          await user.save();
          res
            .status(200)
            .json({ message: "Película eliminada de favoritos con éxito" });
        } else {
          res
            .status(200)
            .json({ message: "La película no estaba en favoritos" });
        }
      } else {
        res
          .status(200)
          .json({ message: "No hay películas en la lista de favoritos" });
      }
    } catch (error) {
      console.error("Error al quitar película de favoritos", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },

  getAllFavourites: async (req, res) => {
    try {
      const { userId } = req.query;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User Not Found" });
      }
      console.log("Favourite items sent to frontend:", user.favouriteItems);
      res.status(200).json({ favouriteItems: user.favouriteItems });
    } catch (error) {
      console.error("Error getting user's favourites", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = movieController;
