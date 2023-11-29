const router = require("express").Router();
const authenticationRoutes = require("./authentication.routes.js");
const movieRoutes = require("./movie.routes.js");
const tvShowRoutes = require("./tvShow.routes.js");

router.get("/", (req, res) => {
  res.json("Welcome to NovaPlay");
});

// Route handlers
router.use("/auth", authenticationRoutes);
router.use("/movies", movieRoutes);
router.use("/tvshows", tvShowRoutes);

module.exports = router;
