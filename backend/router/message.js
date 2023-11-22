const express = require("express");
const authUser = require("../middleware/userAuth");
const {
  saveChat,
  allChats,
  liveChat,
} = require("../controller/chatController");

const messageRouter = express.Router();

//making route for creating a new chat between sender and receiver
messageRouter.post("/messagestart", authUser, saveChat);
// making route for fetching all chat history between two users
messageRouter.get("/chathistory/:id", authUser, allChats);
//making route for fechching the live chat
messageRouter.get("/livechat/:id", authUser, liveChat);

module.exports = messageRouter;
