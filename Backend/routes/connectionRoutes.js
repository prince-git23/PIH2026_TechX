const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  sendRequest,
  updateStatus,
  getMyConnections
} = require("../controllers/connectionController");

router.post("/", auth, sendRequest);
router.get("/", auth, getMyConnections);
router.patch("/:id", auth, updateStatus);

module.exports = router;
