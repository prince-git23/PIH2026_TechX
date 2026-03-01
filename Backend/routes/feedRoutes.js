const express = require("express");
const router = express.Router();

const {
  createFeed,
  getFeeds,
  updateStatus
} = require("../controllers/feedController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createFeed);
router.get("/", authMiddleware, getFeeds);
router.put("/:id/status", authMiddleware, updateStatus);

module.exports = router;
