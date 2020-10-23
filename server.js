const express = require("express");
var socket = require("socket.io");
const path = require("path");
const app = express();
var online_users = [];

const PORT = process.env.PORT;
var server = app.listen(PORT || 3000);
var io = socket(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client.html");
});

io.on("connection", (socket) => {
  socket.on("chatJoined", (name) => {
    socket.name = name;
    online_users.push({ name: socket.name, id: socket.id });
    //io.emit('broadcastMessage',name+ " Just joined the chat ...")
    socket.broadcast.emit(
      "broadcastMessage",
      name + " Just joined the chat ..."
    );
    io.emit("updateMenu", online_users);
  });
  socket.on("clientMessage", function (data) {
    //io.emit('serverMessage',socket.name+" Says ... "+ data)
    //socket.broadcast.emit('serverMessage',socket.name+" Says ... "+ data)
    io.of("/")
      .to(data.id)
      .emit("serverMessage", socket.name + " Says ... " + data.message);
  });
});

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log("Server Running on Port ", PORT);
// });
