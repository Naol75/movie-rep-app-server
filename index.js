const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const express = require("express");
const indexRoutes = require("./routes/index.routes");
const errorHandler = require("./middleware/errorHandler");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

const url = process.env.MONGODB_URI;

mongoose.connect(url);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "db connection error"));
db.once("open", () => {
  console.log("Connected to DataBase");
});

app.use((req, res, next) => {
  const ip = req.ip;
  res.locals = ip;
  next();
});

app.use(cors());

// Middleware for parsing JSON in requests
app.use(express.json());

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Cookie parser
app.use(cookieParser());

// Error handling middleware
app.use(errorHandler);

// Use el enrutador para la ruta "/api"
app.use("/api", indexRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`);
});
