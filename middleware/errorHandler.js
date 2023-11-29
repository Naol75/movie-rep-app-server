const errorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  res.status(500).json({ error: "Internal Server Error" });
};

module.exports = errorHandler;
