const express = require("express");
const router = express.Router();
const tvShowController = require("../controllers/tvShowController");

// Endpoint to get movies
router.get("/tvshows", tvShowController.getAllTVShow);

//Endpoint to get movie info
router.get("/:tvShowId", tvShowController.getTVShowById);

router.put("/:tvShowId", tvShowController.updateTVShow);

router.delete("/:tvShowId", tvShowController.deleteTVShow);
//Endpoint to add a movie
router.post("/add", tvShowController.addTVShow);

module.exports = router;
