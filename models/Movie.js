const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: String,
  genre: String,
  director: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Director",
  },
  actors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
  ],
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
