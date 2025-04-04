const socketio = require("socket.io");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const userSocketMap = {};

function getRecieverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("Client connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  //send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); // object.keys() method returns an array of keys

  socket.on("disconnect", () => {
    console.log("Client disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

module.exports = { server, io, app, getRecieverSocketId };
