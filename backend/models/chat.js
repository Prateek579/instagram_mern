const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: String,
        required: true,
      },
    ],
    content: [
      {
        message: {
          type: String,
          required: true,
        },
        sender: {
          type: String,
          required: true,
        },
      },
    ],
    roomId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Chat", chatSchema);
