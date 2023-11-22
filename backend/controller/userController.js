const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "helloPrateek";

//creating a new user using POST method /api/user/createuser
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are mendatory" });
  } else {
    //checking for user already exist or not
    const userExist = await User.findOne({ email });
    if (!userExist) {
      //hashing password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 7);
      try {
        const create = await User.create({
          name,
          email,
          password: hashedPassword,
        });
        const data = {
          id: create.id,
        };
        //returnign json web token in respose
        const authToken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({
          message: "New user created successfully",
          create,
          data,
          authToken,
          success: true,
        });
      } catch (error) {
        res
          .status(400)
          .json({ message: "user creating internal server error" });
      }
    } else {
      res.status(400).json({ message: "User already exist with this email" });
    }
  }
};

//login a new user using POST method /api/user/loginuser
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are mendatory" });
  } else {
    // checking for user exist or not
    const userExist = await User.findOne({ email });
    if (userExist) {
      // comparing the user input password and data base password
      const isCorrectPassword = await bcrypt.compare(
        password,
        userExist.password
      );
      if (isCorrectPassword) {
        const data = {
          id: userExist.id,
        };
        // returning a json web token to logined user
        const authToken = jwt.sign(data, JWT_SECRET);
        res.status(200).json({
          message: "User login successfully",
          authToken,
          success: true,
          data: data,
        });
      } else {
        res.status(400).json({
          message: "Please enter with right credentials",
          success: false,
        });
      }
    } else {
      res.status(404).json({ message: "User does not exist" });
    }
  }
};

//updating user profile using PUT method /api/user/userprofile
const userProfile = async (req, res) => {
  const _id = req.user.id;
  const photo = req.file.filename;
  if (!photo) {
    res.status(400).json({ message: "the file name is not available" });
  } else {
    try {
      //this will find the user with id and update the profile photo path
      const uploaded = await User.findByIdAndUpdate({ _id }, { photo: photo });
      res.status(200).json({ message: "profile photo updated successfully" });
    } catch (error) {
      res
        .status(400)
        .json({ message: "userProfile internal server error", error });
    }
  }
};

//getting back the user profile photo using GET method /api/user/getprofilephoto
const profilePhoto = async (req, res) => {
  const _id = req.user.id;
  try {
    const userDetails = await User.findOne({ _id });
    res.status(200).json({ message: "User profile details", userDetails });
  } catch (error) {
    res
      .status(400)
      .json({ message: "profile photo internal server error", error });
  }
};

// fetching all user details from database using GET method /api/user/alluser
const allProfile = async (req, res) => {
  try {
    const profiles = await User.find({});
    res.status(200).json({ message: "Displaying all user details ", profiles });
  } catch (error) {
    res.status(400).json({ message: "all profile internal server error" });
  }
};

// adding the user follwers using POST method
const updateFollowers = async (req, res) => {
  const _id = req.body.userId;
  const following = [_id];
  const follower = [req.user.id];
  const requestUser = req.user.id;
  let process = true;
  if (_id && follower) {
    const userDetails = await User.findOne({ _id });
    const userFollowers = userDetails.followers;
    // applying for each on requested user followers
    userFollowers.forEach((data) => {
      if (data === follower[0] || data === follower) {
        process = false;
      }
    });
    // fetching the requested user data
    const requestProfile = await User.findOne({ _id: requestUser });
    if (process) {
      try {
        // adding the follower user
        const addFollwer = await User.findOneAndUpdate(
          { _id },
          { $push: { followers: { $each: follower } } },
          { new: true }
        );
        // adding the following user
        const addFollowing = await User.findOneAndUpdate(
          { _id: requestUser },
          { $push: { following: { $each: following } } },
          { new: true }
        );

        res.status(200).json({
          message: "Request is send successfully and updated the following ",
          addFollowing,
        });
      } catch (error) {
        res
          .status(400)
          .json({ message: "update followers internal server error", error });
      }
    } else {
      res.status(400).json({ message: "Already request is send" });
    }
  } else {
    res.status(400).json({ message: "Please provide all required details" });
  }
};

// appling text search on name index using GET method
const findProfile = async (req, res) => {
  const name = req.params.id;
  if (!name) {
    res.status(400).json({ message: "Please provide a profile name" });
  } else {
    try {
      const userProfile = await User.find({ $text: { $search: name } });
      res
        .status(200)
        .json({ message: "Search result is", userProfile, success: true });
    } catch (error) {
      res.status(400).json({
        message: "find profile internal server error",
        error,
        success: true,
      });
    }
  }
};

module.exports = {
  createUser,
  loginUser,
  userProfile,
  profilePhoto,
  allProfile,
  updateFollowers,
  findProfile,
};
