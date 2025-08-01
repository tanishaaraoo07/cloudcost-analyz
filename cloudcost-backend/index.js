const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser()); // Required for reading cookies
app.use(cors({
  origin: "https://cloudcost-analyz-7nre.vercel.app", // your frontend
  credentials: true
}));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// API routes
app.use("/api/auth", require("./routes/auth"));

// Test route
app.get("/", (req, res) => {
  res.send("🌐 CloudCost Analyzer Backend Running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
