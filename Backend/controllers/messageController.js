const Message = require("../models/Message");
const User = require("../models/User");


// ================= GET CONVERSATION LIST =================
exports.getConversations = async (req, res) => {
  try {

    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
    .populate("sender", "name role verified")
    .populate("receiver", "name role verified")
    .sort({ createdAt: -1 });

    const convMap = new Map();

    messages.forEach(msg => {

      const otherUser =
        msg.sender._id.toString() === userId
          ? msg.receiver
          : msg.sender;

      const otherId = otherUser._id.toString();

      if (!convMap.has(otherId)) {
        convMap.set(otherId, otherUser);
      }
    });

    res.json(Array.from(convMap.values()));

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET FULL CONVERSATION =================
exports.getConversationWith = async (req, res) => {
  try {

    const userId = req.user.id;
    const otherId = req.params.userId;

    const convo = await Message.find({
      $or: [
        { sender: userId, receiver: otherId },
        { sender: otherId, receiver: userId }
      ]
    })
    .populate("sender", "name role verified")
    .sort({ createdAt: 1 });

    res.json(convo);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= SEND MESSAGE =================
exports.sendMessage = async (req, res) => {
  try {

    const senderId = req.user.id;
    const { receiver, content } = req.body;

    if (!receiver || !content) {
      return res.status(400).json({ message: "receiver and content required" });
    }

    const message = await Message.create({
      sender: senderId,
      receiver,
      content
    });

    const populated = await Message.findById(message._id)
      .populate("sender", "name role verified")
      .populate("receiver", "name role verified");

    res.status(201).json(populated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
