const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const { uploadImage, upload } = require("../middleware/cloudinary.middleware");

const verifyToken = require("../middleware/verifyToken.js");

const authenticationController = {
  register: async (req, res) => {
    const { name, username, email, password, repeatPassword } = req.body;

    try {
      console.log("Request file:", req.file);
      if (!req.file) {
        return res.status(400).json({ errorMessage: "No file provided" });
      }

      console.log("Request file path:", req.file.path);
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ errorMessage: "Username already in use" });
      }
      if (!name || !username || !email || !password || !repeatPassword) {
        return res
          .status(400)
          .json({ errorMessage: "All fields must be filled" });
      }
      if (password !== repeatPassword) {
        return res.status(400).json({
          errorMessage: "Password and Repeat password do not match.",
        });
      }
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ message: "Invalid username format" });
      }

      const passwordRegex =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          errorMessage:
            "The password must contain at least one uppercase letter, one lowercase letter, one special character, and be 8 characters or longer.",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await uploadImage(req.file.buffer);
      console.log("Result from uploadImage:", result);
      let imgUrl = null;
      if (result && result.secure_url) {
        imgUrl = result.secure_url;
      } else {
        console.log("Secure URL is not defined in the result.");
      }
      console.log("imgUrl after assignment:", imgUrl);
      const newUser = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });

      const imageUrl = await uploadImage(req.file.buffer);
      if (imageUrl) {
        newUser.image = imageUrl;
      } else {
        newUser.image = "URL de imagen predeterminada";
      }

      await newUser.save();

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        {
          algorithm: "HS256",
          expiresIn: "1h",
        }
      );

      res.status(201).json({ token, message: "User created" });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        return res.status(400).json({ errorMessage: "Email already in use" });
      } else if (error.keyPattern && error.keyPattern.name) {
        return res.status(400).json({ errorMessage: "Name already in use" });
      } else {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ errorMessage: "Invalid credentials" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ errorMessage: "Invalid credentials" });
      }

      const payload = {
        _id: user._id,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "2d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });

      res.json({ token, message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getProfile: async (req, res) => {
    console.log("Entró en la ruta getProfile");
    const { userId } = req.user;
    console.log("User ID:", userId);
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ errorMessage: "User not found" });
      }
      res.json({ user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  profileEdit: async (req, res) => {
    const { userId } = req.user;
    const { name, username, email, password, repeatPassword } = req.body;

    try {
      const existingUser = await User.findOne({ username: username });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res
          .status(400)
          .json({ errorMessage: "Username already in use" });
      }

      if (!name || !username || !email) {
        return res
          .status(400)
          .json({ errorMessage: "All fields must be filled" });
      }

      let hashedPassword = null;

      if (password) {
        const passwordRegex =
          /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
        if (!passwordRegex.test(password)) {
          return res.status(400).json({
            errorMessage:
              "The password must contain at least one uppercase letter, one lowercase letter, one special character, and be 8 characters or longer.",
          });
        }

        if (password !== repeatPassword) {
          return res.status(400).json({
            errorMessage: "Password and Repeat password do not match.",
          });
        }

        hashedPassword = await bcrypt.hash(password, 10);
      }

      const updatedUser = await User.findByIdAndUpdate(userId, {
        name,
        username,
        email,
        password: hashedPassword,
        image: req.file ? req.file.path : existingUser.image,
      });

      if (!updatedUser) {
        return res.status(404).json({ errorMessage: "User not found" });
      }

      res.json({ user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  logout: (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  },
};

module.exports = authenticationController;
