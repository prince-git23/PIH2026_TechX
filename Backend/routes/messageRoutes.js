const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getConversations,
  getConversationWith,
  sendMessage
} = require("../controllers/messageController");

// Get list of conversation partners
router.get("/conversations", authMiddleware, getConversations);

// Get messages with specific user
router.get("/conversation/:userId", authMiddleware, getConversationWith);

// Send message
router.post("/send", authMiddleware, sendMessage);

module.exports = router;
