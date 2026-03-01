const Feed = require("../models/Feed");
const Message = require("../models/Message");
const User = require("../models/User");

/* =========================================================
   CREATE FEED
========================================================= */
exports.createFeed = async (req, res) => {
  try {
    const { title, description, quantity, location, pickupTime } = req.body;

    if (!title || !description || !quantity || !location) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const feed = await Feed.create({
      title,
      description,
      quantity,
      location,
      pickupTime,
      sender: req.user.id,
      status: "pending"
    });

    res.status(201).json({
      message: "Feed created successfully",
      feed
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================================================
   GET ALL FEEDS
========================================================= */
exports.getFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find()
      .populate("sender", "name role verified verificationLevel reputation")
      .populate("acceptedBy", "name role")
      .populate("logs.user", "name role")
      .sort({ createdAt: -1 });

    res.json(feeds);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================================================
   UPDATE STATUS (ACCEPT / REJECT)
========================================================= */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const feed = await Feed.findById(req.params.id);

    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    // Prevent double update
    if (feed.status !== "pending") {
      return res.status(400).json({ message: "Feed already processed" });
    }

    feed.status = status;
    feed.acceptedBy = req.user.id;

    // Transparent action log
    feed.logs.push({
      action: status,
      user: req.user.id
    });

    await feed.save();

    /* =========================================================
       IF ACCEPTED → CREATE MESSAGE + UPDATE REPUTATION
    ========================================================= */
    if (status === "accepted") {

      // 🔔 Notify sender
      await Message.create({
        sender: req.user.id,
        receiver: feed.sender,
        content: `Your donation "${feed.title}" has been accepted.`
      });

      // 📈 Increase reputation
      const sender = await User.findById(feed.sender);

      if (sender) {
        sender.reputation = (sender.reputation || 0) + 10;

        // 🏆 Auto Verification Logic
        if (sender.reputation >= 100) {
          sender.verified = true;
          sender.verificationLevel = "elite";
        } else if (sender.reputation >= 50) {
          sender.verified = true;
          sender.verificationLevel = "trusted";
        } else if (sender.reputation >= 20) {
          sender.verificationLevel = "basic";
        }

        await sender.save();
      }
    }

    const updatedFeed = await Feed.findById(feed._id)
      .populate("sender", "name role verified verificationLevel reputation")
      .populate("acceptedBy", "name role")
      .populate("logs.user", "name role");

    res.json({
      message: `Feed ${status} successfully`,
      feed: updatedFeed
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* =========================================================
   GET SINGLE FEED
========================================================= */
exports.getSingleFeed = async (req, res) => {
  try {
    const feed = await Feed.findById(req.params.id)
      .populate("sender", "name role verified verificationLevel reputation")
      .populate("acceptedBy", "name role")
      .populate("logs.user", "name role");

    if (!feed) {
      return res.status(404).json({ message: "Feed not found" });
    }

    res.json(feed);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
