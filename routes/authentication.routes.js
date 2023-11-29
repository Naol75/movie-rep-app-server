const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/verify", verifyToken, (req, res) => {
  res.json(req.payload);
});

router.post("/register", authenticationController.register);

router.post("/login", authenticationController.login);

router.post("/logout", authenticationController.logout);

module.exports = router;
