const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose
    .connect("mongodb+srv://prateekmaurya2003:prateekInstagram@cluster0.rtohqog.mongodb.net/instagram_backend?retryWrites=true&w=majority")
    .then(() => {
      console.log("connected to data base successfully");
    })
    .catch((error) => {
      console.log("failed to connect with data base", error);
    });
};

module.exports = connectDb;


