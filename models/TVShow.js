const mongoose = require("mongoose");

const tvShowSchema = new mongoose.Schema({
  title: String,
  genre: String,
  seasons: [
    {
      number: Number,
      episodes: [
        {
          title: String,
          director: { type: mongoose.Schema.Types.ObjectId, ref: "Director" },
          actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
        },
      ],
    },
  ],
  actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
});

const TVShow = mongoose.model("TVShow", tvShowSchema);

module.exports = TVShow;
