const Movie = require("../models/Movie");

const movieController = {
  // Get all movies
  getAllMovies: async (req, res) => {
    try {
      const movies = await Movie.find.populate("director actors");
      res.json(movies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a movie by its ID
  getMovieById: async (req, res) => {
    const movieId = req.params.movieId;
    try {
      const movie = await Movie.findbById(movieId).populate("director actors");
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Add a new movie
  addMovie: async (req, res) => {
    const { title, genre, director, actors } = req.body;
    try {
      const newMovie = new Movie({ title, genre, director, actors });
      await newMovie.save();
      res.status(201).json(newMovie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  updateMovie: async (req, res) => {
    const movieId = req.params.movieId;
    const { title, genre, director, actors } = req.body;
    try {
      const updatedMovie = await Movie.findByIdAndUpdate(
        movieId,
        { title, genre, director, actors },
        { new: true }
      ).populate("director actors");
      if (!updatedMovie) {
        return res.status(404).json({ message: "Movie not found" });
      }
      res.json(updatedMovie);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  deleteMovie: async (req, res) => {
    const movieId = req.params.movieId;
    try {
      const deletedMovie = Movie.findByIdAndDelete(movieId);
      if (!deletedMovie) {
        res.status(404).json({ message: "Movie not found" });
      }
      res.json({ message: "Movie deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = movieController;
