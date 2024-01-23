const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.post("/addToFavourites", movieController.addMovieToFavourites);

router.post("/deleteFromFavourites", movieController.deleteMovieFromFavorites);

router.get("/getAllFavourites", movieController.getAllFavourites);

module.exports = router;
