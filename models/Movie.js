const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  genre_ids: [Number],
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  original_language: String,
  name: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: Date,
  title: String,
  vote_average: Number,
  vote_count: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
