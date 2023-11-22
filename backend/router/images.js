const express = require("express");
const authUser = require("../middleware/userAuth");
const {
  postImage,
  userImages,
  allImages,
  deleteImage,
} = require("../controller/imagesController");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const imageRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

//updating the user profile image
imageRouter.post("/postimage", upload.single("image"), authUser, postImage);
//retriving all user posted images
imageRouter.get("/userimages", authUser, userImages);
//retriving all images uploaded by user
imageRouter.get("/allimages", allImages);
//deleting the one image posted by user
imageRouter.delete("/deleteimage", authUser, deleteImage);

module.exports = imageRouter;
