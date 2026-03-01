const Feed = require("../models/Feed");

exports.createFeed = async (req, res) => {
  try {
    const feed = await Feed.create({
      ...req.body,
      sender: req.user.id
    });

    res.status(201).json({
      message: "Feed created",
      feed
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFeeds = async (req, res) => {
  try {
    const feeds = await Feed.find()
      .populate("sender", "name");

    res.json(feeds);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const feed = await Feed.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(feed);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
