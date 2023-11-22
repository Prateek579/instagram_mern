const Chat = require("../models/chat");

// making a function having protected , create new chat data if does not exist and update chat content if exist
const saveChat = async (req, res) => {
  const { reciever, message } = req.body;
  const sender = req.user.id;
  const content = [
    {
      message: message,
      sender: sender,
    },
  ];
  const users = [sender, reciever];
  if (!sender || !reciever || !message) {
    return res
      .status(400)
      .json({ message: "Please send sender, receiver and content" });
  } else {
    const isChatExist = await Chat.find({
      users: { $all: [reciever, sender] },
    });
    if (isChatExist.length === 0) {
      res.status(400).json({ message: "Chat data does not exist" });
      
    } else {
      try {
        const updateChat = await Chat.findByIdAndUpdate(
          { _id: isChatExist[0]._id },
          { $push: { content: { $each: content } } },
          { new: true }
        );
        res
          .status(200)
          .json({ message: "Message updated  successfully", updateChat });
      } catch (error) {
        res.status(400).json({ message: "Save Chat internal server error2" });
      }
    }
  }
};

//making a fuction for fetching all the chats between two users
const allChats = async (req, res) => {
  const user1 = req.params.id;
  const user2 = req.user.id;
  if (!user1 || !user2) {
    res.status(400).json({ message: "please send the users" });
  } else {
    const chatHistory = await Chat.find({
      users: { $all: [user2, user1] },
    });
    if (chatHistory.length !== 0) {
      res.status(200).json({
        message: "all conversation is",
        chatHistory,
        success: true,
      });
    } else {
      try {
        const roomId = Math.floor(Math.random() * 100000);
        const create = await Chat.create({
          users: [user2, user1],
          roomId,
        });
        res
          .status(200)
          .json({ message: "chat history is empty", create, roomId });
      } catch (error) {
        res.status(400).json({ message: "allchats internal server error" });
      }
    }
  }
};

const liveChat = async (req, res) => {
  const sender = req.params.id;
  const reciever = req.user.id;
  if (!sender || !reciever) {
    res.status(400).json({ message: "Please proved the users" });
  } else {
    try {
      const chat = await Chat.find({ users: { $all: [reciever, sender] } });
      res.status(200).json({ message: "Live chat is", chat });
    } catch (error) {
      res
        .status(400)
        .json({ message: "liveChat internal server errror", error });
    }
  }
};

module.exports = { saveChat, allChats, liveChat };
