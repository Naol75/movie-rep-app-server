const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.post("/addToFavourites", movieController.addMovieToFavourites);

router.post("/favourites/delete", movieController.deleteMovieFromFavourites);

module.exports = router;
