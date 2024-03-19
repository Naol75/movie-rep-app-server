const express = require("express");
const authenticationController = require("../controllers/authenticationController");
const verifyToken = require("../middleware/verifyToken");
const router = express.Router();

router.get("/getIp", authenticationController.getIp);
router.get("/verify", verifyToken, (req, res) => {
  res.json(req.user);
});

router.post("/register", authenticationController.register);

router.post("/login", authenticationController.login);

router.use(verifyToken);

router.get("/getProfile", authenticationController.getProfile);

router.patch("/profileEdit", authenticationController.profileEdit);

router.post("/logout", authenticationController.logout);

module.exports = router;
