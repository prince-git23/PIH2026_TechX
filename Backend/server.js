const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

/* ================= LOAD ENV ================= */
dotenv.config();

/* ================= CREATE APP ================= */
const app = express();

/* ================= MIDDLEWARE ================= */

// CORS (Allow all for now – restrict in production)
app.use(cors({
  origin: "*",
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= DATABASE CONNECTION ================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/feed", require("./routes/feedRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

/* ================= ROOT ROUTE ================= */

app.get("/", (req, res) => {
  res.send("🚀 Annsetu Backend Running...");
});

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
