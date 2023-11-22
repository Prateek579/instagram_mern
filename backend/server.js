const express = require("express");
const userRouter = require("./router/user");
const connectDb = require("./connection/db");
const cors = require("cors");
const imageRouter = require("./router/images");
const videoRouter = require("./router/videos");
const { Socket } = require("socket.io");
const messageRouter = require("./router/message");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8021;
connectDb();

// const ENV = "production";

// making middleware for static files
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));
app.use(express.static("images"));
app.use(express.static("public/videos"));

// making middleware for differnt-different API call
app.use("/api/user", userRouter);
app.use("/api/image", imageRouter);
app.use("/api/video", videoRouter);
app.use("/api/message", messageRouter);


const server = app.listen(PORT, () => {
  console.log(`Instagram is running on port ${PORT}`);
});

// implementing socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (Socket) => {
  Socket.on("join chat", (data) => {
    Socket.join(data);
  });
  Socket.on("new message", (data, roomId) => {
    Socket.in(roomId).emit("message", data);
  });
});
