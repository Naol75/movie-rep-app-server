const TVShow = require("../models/TVShow");

const tvShowController = {
  getAllTVShow: async (req, res) => {
    try {
      const TVShows = await TVShow.find()
        .populate({
          path: "actors",
        })
        .populate({
          path: "season.episodes.actors",
          model: "Actor",
        })
        .populate({
          path: "director",
          model: "Director",
        });
      res.json(TVShows);
    } catch (error) {
      res.status(500).json({ error: err.message });
    }
  },
  getTVShowById: async (req, res) => {
    const tvShowId = req.params.tvShowId;
    try {
      const tvShow = await TVShow.findById(tvShowId)
        .populate({
          path: "actors",
        })
        .populate({
          path: "season.episodes.actors",
          model: "Actor",
        })
        .populate({
          path: "director",
          model: "Director",
        });
      if (!tvShow) {
        return res.status(404).json({ message: "TV Show not found" });
      }
      res.json(tvShow);
    } catch (error) {
      res.status(500).json({ error: err.message });
    }
  },
  addTVShow: async (req, res) => {
    const { title, genre, seasons, actors } = req.body;
    try {
      const newTVShow = new TVShow({ title, genre, seasons, actors });
      await newTVShow.save();
      res.status(201).json(newTVShow);
    } catch (error) {
      res.status(500).json({ error: err.message });
    }
  },
  updateTVShow: async (req, res) => {
    const tvShowId = req.params.tvShowId;
    const { title, genre, seasons, actors } = req.body;
    try {
      const updatedTVShow = await TVShow.findByIdAndUpdate(
        tvShowId,
        { title, genre, seasons, actors },
        { new: true }
      )
        .populate("actors")
        .populate("seasons.episodes.actors seasons.episodes.director");
      if (!updatedTVShow) {
        return res.status(404).json({ message: "TV Show not found" });
      }
      res.json(updatedTVShow);
    } catch (error) {
      res.status(500).json({ error: err.message });
    }
  },
  deleteTVShow: async (req, res) => {
    const tvShowId = req.params.tvShowId;
    try {
      const deletedTVShow = await TVShow.findByIdAndDelete(tvShowId);
      if (!deletedTVShow) {
        return res.status(404).json({ message: "TV Show not found" });
      }
      res.json({ message: "TV Show deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = tvShowController;
