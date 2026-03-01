const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/feed", require("./routes/feedRoutes"));
app.use("/api/messages", require("./routes/messageRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));

app.get("/", (req, res) => {
  res.send("Annsetu Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
