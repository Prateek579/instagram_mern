const Videos = require("../models/videos");

// saving a video path in data base using POST method using /api/user/postvideo
const postVideo = async (req, res) => {
  // this is user id which want to upload video
  const user = req.user.id;
  // video path
  const videoPath = req.file.filename;
  if (videoPath) {
    try {
      const videoPosted = await Videos.create({
        user: user,
        video: videoPath,
      });
      res.status(200).json({ message: "Video post successfully", videoPosted });
    } catch (error) {
      res.status(200).json({ message: "post Video internal server error" });
    }
  } else {
    res.status(400).json({ message: "Please add video path" });
  }
};

// getting back the all video uploaded by user
const userVideos = async (req, res) => {
  const user = req.user.id;
  if (user) {
    try {
      const allVideos = await Videos.find({ user });
      res.status(200).json({ message: "User Videos", allVideos });
    } catch (erro) {
      res.status(400).json({ message: "User Videos internal server error" });
    }
  } else res.status(500).josn({ message: "Please provide user id" });
};

// fetching all the video stored in database
const allVideos = async (req, res) => {
  try {
    const videos = await Videos.find({});
    res.status(200).json({ message: "All videos", videos });
  } catch (error) {
    res.status(400).json({ message: "all videos internal server error" });
  }
};

//deleting the one video form user post using DELETE method /api/video/deleteVideo
const deleteVideo = async (req, res) => {
  const user = req.user.id;
  const _id = req.body.videoId;
  if (user && _id) {
    try {
      const videoDetails = await Videos.findOne({ _id });
      if (videoDetails.user.toString().slice("(") === user) {
        const deleted = await Videos.findByIdAndDelete({ _id });
        res
          .status(200)
          .json({ message: "Video deleted successfully", deleted });
      } else {
        res
          .status(400)
          .json({ message: "Something happen wrong in deleting video" });
      }
    } catch (error) {
      res.status(400).json({ message: "deleteVideo internal server error" });
    }
  } else {
    res.status(400).json({ message: "Please provide all the details" });
  }
};

module.exports = { postVideo, userVideos, allVideos, deleteVideo };
