const User = require("../models/user");
const bcrypt = require("bcryptjs");

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
    console.error("Error in registration:", error);
    return res.status(500).json({ error: "Internal server error!" });
  }
};

module.exports = { register };
