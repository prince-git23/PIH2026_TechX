const Connection = require("../models/Connection");

exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;

    const existing = await Connection.findOne({
      sender: req.user.id,
      receiver: receiverId
    });

    if (existing)
      return res.status(400).json({ message: "Request already sent" });

    const request = await Connection.create({
      sender: req.user.id,
      receiver: receiverId
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const connection = await Connection.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(connection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id }
      ]
    }).populate("sender receiver", "name email");

    res.json(connections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
