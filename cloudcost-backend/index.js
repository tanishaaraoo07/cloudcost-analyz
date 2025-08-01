const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "https://cloudcost-analyz-7nre.vercel.app", // exact frontend domain
  credentials: true
}));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("🌐 CloudCost Analyzer Backend Running");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.use(cors({
  origin: "https://cloudcost-analyz-7nre.vercel.app",
  credentials: true
}));

