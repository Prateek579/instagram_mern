const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  video: {
    type: String,
  },
});

module.exports = mongoose.model("Videos", videoSchema);
