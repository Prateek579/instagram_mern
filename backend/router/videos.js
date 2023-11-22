const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const {
  postVideo,
  userVideos,
  allVideos,
  deleteVideo,
} = require("../controller/videosController");
const authUser = require("../middleware/userAuth");

const videoRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync("public")) {
      fs.mkdirSync("public");
    }
    if (!fs.existsSync("public/videos")) {
      fs.mkdirSync("public/videos");
    }
    cb(null, "public/videos");
    //  cb(null, "public/videos");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    var ext = path.extname(file.originalname);
    if (ext !== ".mkv" && ext !== ".mp4") {
      return cb(new Error("Only videos are allowed!"));
    } else {
      cb(null, true);
    }
  },
});

// making route for uploading a video by multer using firstly user auth
videoRouter.post("/postvideo", upload.single("video"), authUser, postVideo);

// making route to fetch all videos uploaded by user
videoRouter.get("/uservideos", authUser, userVideos);

//making route for fetching all the videos
videoRouter.get("/allvideos", allVideos);

//making route for deleting video
videoRouter.delete("/deleteVideo", authUser, deleteVideo);

// videoRouter.post(
//   "/postvideo",
//   upload.fields({ name: "video" }),
//   authUser,
//   postVideo
// );

module.exports = videoRouter;
