const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const userController = {
  // Register a new user
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      throw new Error("Please all fields are required");
    }

    // Check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      throw new Error("User already exists");
    }

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user and save to the database
    const userCreated = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Respond with the created user's details
    res.json({
      username: userCreated.username,
      email: userCreated.email,
      id: userCreated._id,
    });
  }),

  // User login
  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid Login Credential");
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid Login Credential");
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, "JohnKey", { expiresIn: "30d" });

    // Respond with user details and token
    res.json({
      message: "Login Success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
    });
  }),

  // Get user profile
  profile: asyncHandler(async (req, res) => {
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    // Respond with user profile details
    res.json({
      username: user.username,
      email: user.email,
    });
  }),

  // Change user password
  changeUserPassword: asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      throw new Error("User not found");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;

    // Save the updated user
    await user.save();
    res.json({ message: "Password changed successfully" });
  }),

  // Update user profile
  updateUserProfile: asyncHandler(async (req, res) => {
    const { email, username } = req.body;

    // Find user by ID and update
    const updatedUser = await User.findByIdAndUpdate(
      req.user,
      {
        username,
        email,
      },
      {
        new: true, // Return the updated document
      }
    );

    // Respond with updated user details
    res.json({ message: "Profile updated successfully", updatedUser });
  }),
};

module.exports = userController;
