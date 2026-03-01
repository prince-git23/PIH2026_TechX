const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROOT ROUTE FIRST ================= */

app.get("/", (req, res) => {
  res.send("🚀 Annsetu Backend Running...");
});

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/feed", require("./routes/feedRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

/* ================= 404 HANDLER (LAST) ================= */

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ================= DATABASE CONNECTION ================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  });

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
