const bcrypt = require("bcrypt");
const express=require("express")
const jwt = require("jsonwebtoken");
const userRouter=express.Router()
require("dotenv").config();
const { userModel } = require("../models/userModel");

// user register route
userRouter.post('/register',async function register(req, res) {
    try {
      const { name, email, password } = req.body;
  
      // Hash the user's password
      const hash = await bcrypt.hash(password, 10);
      // Use a stronger salt factor for security.
  
      // Check if a user with the given email already exists in the database.
      const isExist = await userModel.findOne({ email });
  
      if (isExist) {
        // User with the same email already exists, return an error.
        res.status(400).json({ message: "User already exists, please login" });
      } else {
        // Create a new user document with the hashed password.
        const newUser = new userModel({ name, email, password: hash });
        await newUser.save();
  
        // User registration successful.
        res.status(201).json({ message: "User Register sucessfully" });
      }
    } catch (err) {
      // Handle internal server error.
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  })


  userRouter.post('/login',async function login(req, res) {
    try {
      const { email, password } = req.body;
  
      // Find the user by their email in the database.
      const user = await userModel.findOne({ email });
  
      if (user) {
        // Compare the provided password with the hashed password in the database.
        const passwordsMatch = await bcrypt.compare(password, user.password);
  
        if (passwordsMatch) {
          // Create a JWT token for the user's successful login.
          const token = jwt.sign({ userID: user._id }, process.env.key, {
            expiresIn: "1d", // Token expiration time (e.g., 1 day)
          });
  
          // Successful login, return a token.
          res.json({ message: "User Login SucessFully", token: token });
        } else {
          // Password does not match.
          res.status(401).json({ message: "Wrong Credentials" });
        }
      } else {
        // User with the provided email does not exist.
        res.status(401).json({ message: "User Not Found!" });
      }
    } catch (err) {
      // Handle internal server error.
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    }
  })


module.exports = { userRouter };
