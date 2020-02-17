const express = require("express");
var cors = require("cors");
var http = require("http");
var app = express();
var server = http.createServer(app);

var io = require("socket.io").listen(server);

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8002");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

io.on("connection", function(socket) {
  socket.on("login", function(msg) {
    io.emit("serverLogin", { ...msg, id: socket.id });
  });
  socket.on("serverLoginResponse", function(msg) {
    io.emit("loginResponse", msg);
  });
});

server.listen(8083, () => {
  console.log("Server is listening on port 8083");
});
