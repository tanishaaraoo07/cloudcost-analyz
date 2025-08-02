const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// ===== Signup =====
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    console.log("[Signup] Incoming request:", { name, email });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret");
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("[Signup] Error:", err.message);
    res.status(500).json({ error: "Server error during signup." });
  }
});

// ===== Login =====
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("[Login] Attempt:", { email });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret");

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",  // Only works if site is served over HTTPS (e.g., Render)
      secure: true
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("[Login] Error:", err.message);
    res.status(500).json({ error: "Server error during login." });
  }
});

module.exports = router;
