const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    console.log("verifyToken: Before token verification");
    const authorizationHeader = req.header("Authorization");
    console.log("verifyToken: Authorization Header:", authorizationHeader);

    if (!authorizationHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authorizationHeader.split(" ")[1];
    console.log("Received Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    console.log("Decoded Token:", decoded);
    console.log("verifyToken: Token verified successfully");

    req.user = {
      userId: decoded._id,
      email: decoded.email,
    };

    next();
  } catch (error) {
    console.error("Error verifying token:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = verifyToken;
