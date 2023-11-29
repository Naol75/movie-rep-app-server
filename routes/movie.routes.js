const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

// Endpoint to get movies
router.get("/movies", movieController.getAllMovies);

//Endpoint to get movie info
router.get("/:movieId", movieController.getMovieById);

router.put("/:movieId", movieController.updateMovie);

router.delete("/:movieId", movieController.deleteMovie);
//Endpoint to add a movie
router.post("/add", movieController.addMovie);

module.exports = router;
