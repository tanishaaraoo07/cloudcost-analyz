const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware (must be in correct order)
app.use(express.json());
app.use(cookieParser());

// ✅ CORS Setup: allow localhost + production
const allowedOrigins = [
  //"http://localhost:5173",
  "https://cloudcost-analyz-7nre.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ CORS BLOCKED:", origin);
      callback(new Error("CORS error: " + origin));
    }
  },
  credentials: true
}));

// ✅ Debug log for every request
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ Mongo error:", err));

// ✅ API Routes
app.use("/api/auth", require("./routes/auth"));     // For login/signup
app.use("/api/cloud", require("./routes/cloud"));   // For compare/discover/pdf

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🌐 CloudCost Analyzer Backend Running");
});

// ✅ Fallback 404 route
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
