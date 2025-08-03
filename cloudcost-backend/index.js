const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware (CORS first, before JSON parsing if using credentials)
const allowedOrigins = [
  "http://localhost:5173",
  "https://cloudcost-analyz.vercel.app"
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

// ✅ Body parser and cookie parser
app.use(express.json()); // Must come AFTER CORS
app.use(cookieParser());

// ✅ Debug logger for all requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ Mongo error:", err));

// ✅ Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cloud", require("./routes/cloud"));

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🌐 CloudCost Analyzer Backend Running");
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler (Optional - to avoid Express crashing on uncaught errors)
app.use((err, req, res, next) => {
  console.error("❌ Global error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
