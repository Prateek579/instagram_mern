const Images = require("../models/images");

//add a image path in database along user id using POST method
const postImage = async (req, res) => {
  const userId = req.user.id;

  const imageName = req.file.filename;
  if (!imageName) {
    res.status(400).json({ message: "the file name is not available" });
  } else {
    try {
      //this will find the user with id and update the profile photo path
      const uploaded = await Images.create({
        user: userId,
        photo: imageName,
      });
      res.status(200).json({ message: "Image posted successfully" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "userProfile internal server error", error });
    }
  }
};

// getting back all images uploaded by user using GET method /api/image/userimages
const userImages = async (req, res) => {
  const user = req.user.id;
  try {
    //finding the modules of image in image database using user id
    const allImages = await Images.find({ user });
    if (allImages) {
      res.status(200).json({ message: "All images of user", allImages });
    } else {
      res.status(400).json({ message: "User not have any uploaded post" });
    }
  } catch (error) {
    res.status(400).json({ message: "userImages internal server error" });
  }
};

//fetching all images of user from database using GET method /api/images/allimages
const allImages = async (req, res) => {
  try {
    const images = await Images.find({});
    res.status(200).json({ messages: "All explore Images", images });
  } catch (error) {
    res.status(400).json({ message: "allImages internal server error" });
  }
};

// deleting user posted image after user verification using /api/image/deleteimage
const deleteImage = async (req, res) => {
  const user = req.user.id;
  const _id = req.body.imageId;
  if (_id) {
    const imageDetails = await Images.findOne({ _id });
    if (imageDetails) {
      const imageUser = imageDetails.user.toString().slice("(");
      //if user id is equal to image user id then proceed
      if (user === imageUser) {
        const deleted = await Images.findByIdAndDelete({ _id });
        res.status(200).json({ message: "Post deleted successfully", deleted });
      } else {
        res
          .status(400)
          .json({ message: "User is not authenticate to delete image" });
      }
    } else {
      res.status(400).json({ message: "User post is not exist" });
    }
  } else {
    res.status(200).json({ message: "Please provide image id" });
  }
};

module.exports = { postImage, userImages, allImages, deleteImage };
