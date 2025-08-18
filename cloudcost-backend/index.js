const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 1. CORS Setup FIRST
const allowedOrigins = [
  //"http://localhost:5173",
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
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// ✅ 2. JSON and Cookie Parsing
app.use(express.json());
app.use(cookieParser());

// ✅ 3. Debug Log Middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ✅ 4. MongoDB Connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB error:", err));

// ✅ 5. API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/cloud", require("./routes/cloud")); // <-- Compare route lives here

// ✅ 6. Health Check
app.get("/", (req, res) => {
  res.send("🌐 CloudCost Analyzer Backend Running");
});

// ✅ 7. 404 Fallback
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ 8. Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Backend Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ✅ 9. Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
