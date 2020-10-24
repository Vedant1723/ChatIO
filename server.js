const express = require("express");
var socket = require("socket.io");
const path = require("path");
const { userInfo } = require("os");
const { on } = require("process");
const app = express();
var online_users = [];
var online_admins = [];

const PORT = process.env.PORT || 3000;
var server = app.listen(PORT);
var io = socket(server);
// var dir = path.join(__dirname, "views");

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/dashboard.html");
});

app.get("/client", (req, res) => {
  res.sendFile(__dirname + "/views/client.html");
});
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/views/admin.html");
});

io.on("connection", (socket) => {
  socket.on("AdminchatJoined", (name) => {
    socket.name = name;
    online_admins.push({ name: socket.name, id: socket.id });
    //io.emit('broadcastMessage',name+ " Just joined the chat ...")
    socket.broadcast.emit(
      "broadcastMessage",
      name + " Just joined the chat ..."
    );
    io.emit("updateAdminMenu", online_users);
    io.emit("updateMenu", online_admins);
  });
  socket.on("chatJoined", (name) => {
    socket.name = name;
    online_users.push({ name: socket.name, id: socket.id });
    //io.emit('broadcastMessage',name+ " Just joined the chat ...")
    socket.broadcast.emit(
      "broadcastMessage",
      name + " Just joined the chat ..."
    );
    io.emit("updateMenu", online_admins);
    io.emit("updateAdminMenu", online_users);
  });
  socket.on("clientMessage", function (data) {
    //io.emit('serverMessage',socket.name+" Says ... "+ data)
    //socket.broadcast.emit('serverMessage',socket.name+" Says ... "+ data)
    io.of("/")
      .to(data.id)
      .emit("serverMessage", socket.name + " Says ... " + data.message);
    io.of("/")
      .to(socket.id)
      .emit("serverMessage", socket.name + " Says ... " + data.message);
  });
});
io.on("disconnect", () => {
  online_users = [];
  online_admins = [];
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log("Server Running on Port ", PORT);
// });
