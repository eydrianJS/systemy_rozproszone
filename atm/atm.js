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
      console.log(socket.id);
      io.emit("serverLogin", { ...msg, id: socket.id });
    });
    socket.on("serverLoginResponse", function(msg) {
      io.emit("loginResponse", msg);
    });
  
    socket.on("deposit", function(msg) {
      io.emit("serverDeposite", { ...msg, id: socket.id });
    });
    socket.on("serverDepositeResponse", function(msg) {
      io.emit("accountBallance", msg);
    });
    socket.on("withdrawal", function(msg) {
      io.emit("serverWithdrawal", { ...msg, id: socket.id });
    });
    socket.on("serverWithdrawalResponse", function(msg) {
      io.emit("accountBallance", msg);
    });
    socket.on("accountBallanceUpdate", function(msg) {
      io.emit("accountBallance", msg);
    });
    socket.on("disconnect", () => {
        console.log("disc")
    })
  });
server.listen(8085, () => {
  console.log("Server is listening on port 8085");
});
