const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("Received Data:", req.body);

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    if (username.length < 4) {
      return res
        .status(400)
        .json({ error: "Username must be at least 5 characters!" });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ error: "Password must be at least 5 characters!" });
    }

    console.log("Checking for existing user with:", { email, username });
    let checkUsers;
    try {
      checkUsers = await User.findOne({ $or: [{ email }, { username }] });
    } catch (dbError) {
      console.error("Database query error:", dbError);
      return res.status(500).json({ error: "Database query failed" });
    }

    console.log("User Found:", checkUsers);

    if (checkUsers) {
      return res
        .status(400)
        .json({ error: "Username or email already exists!" });
    }
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPass });
    await newUser.save();
    console.log("User Registered Successfully!");

    return res.status(201).json({ success: "Registration successful" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      bcrypt.compare(password, checkUser.password, (err, data) => {
        if (data) {
          const token = jwt.sign(
            { id: checkUser._id, email: checkUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "365d" }
          );
          res.cookie("taskifyUserToken", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
          });
          return res.status(200).json({ success: "Login Successfull" });
        } else {
          return res.status(400).json({ error: "Invalid Credentials" });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal server error!" });
  }
};

module.exports = { register, login };
