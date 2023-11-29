const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");

const authenticationController = {
  register: async (req, res) => {
    const { name, username, email, password, repeatPassword } = req.body;

    try {
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
      const newUser = new User({
        name,
        username,
        email,
        password: hashedPassword,
      });

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
        expiresIn: "1h",
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

  logout: (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logout successful" });
  },
};

module.exports = authenticationController;
