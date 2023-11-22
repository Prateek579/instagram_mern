const express = require("express");
const {
  createUser,
  loginUser,
  userProfile,
  profilePhoto,
  allProfile,
  updateFollowers,
  findProfile,
} = require("../controller/userController");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const authUser = require("../middleware/userAuth");

const userRouter = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
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

//making rote for creating a new user
userRouter.post("/createuser", createUser);
// making route for login user
userRouter.post("/loginuser", loginUser);
// making route for user to fetch user profile details
userRouter.put("/userprofile", upload.single("photo"), authUser, userProfile);
// making router for fetching the user profile photo
userRouter.get("/getprofilephoto", authUser, profilePhoto);
// making route for fetching all the existing user profile along with details
userRouter.get("/allprofile", allProfile);
//making route for updating ther user followers
userRouter.post("/updatefollowers", authUser, updateFollowers);
//making route for seraching the users
userRouter.get("/profile/:id", findProfile);

module.exports = userRouter;
