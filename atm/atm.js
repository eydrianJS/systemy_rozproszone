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
    console.log(msg + "a");
    io.emit("login", { acc: "ATM"});
  });
});

server.listen(8082, () => {
  console.log("Server is listening on port 8081");
});
