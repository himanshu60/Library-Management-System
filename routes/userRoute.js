const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const { Limiter } = require("../middlewares/rateLimit");
const userRouter = express.Router();
require("dotenv").config();
const { userModel } = require("../models/userModel");

// user register route
userRouter.post("/register", async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const isExist = await userModel.findOne({ email });
    if (isExist) {
      res.status(400).json({ message: "User already exists, please login" });
    } else {
      const newUser = new userModel({ name, email, password: hash });
      await newUser.save();
      res.status(201).json({ message: "User Register sucessfully" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

userRouter.post("/login", Limiter, async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        const token = jwt.sign({ userID: user._id }, process.env.key, {
          expiresIn: "1d", // Token expiration time (e.g., 1 day)
        });
        res.json({ message: "User Login SucessFully", token: token });
      } else {
        res.status(401).json({ message: "Wrong Credentials" });
      }
    } else {
      res.status(401).json({ message: "User Not Found!" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
});

module.exports = { userRouter };
