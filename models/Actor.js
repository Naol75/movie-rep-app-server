const mongoose = require("mongoose");

const actorSchema = new mongoose.schema({
  name: String,
  age: Number,
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

const Actor = mongoose.model("Actor", actorSchema);

module.exports = Actor;
