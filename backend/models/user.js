const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  followers: [
    {
      type: String,
      required: true,
    },
  ],
  following: [
    {
      type: String,
      required: true,
    },
  ],
});

userSchema.index({ name: "text" });

module.exports = mongoose.model("User", userSchema);
