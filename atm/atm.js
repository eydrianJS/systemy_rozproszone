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

io.on("connect", function(socket) {
  socket.on("login", function(msg) {
    io.emit("serverLogin", { ...msg, id: socket.id });
  });
  socket.on("serverLoginResponse", function(msg) {
      io.to(msg.login).emit("loginResponse", msg);
  });

  socket.on("deposit", function(msg) {
    io.emit("serverDeposite", { ...msg, id: socket.id });
  });

  socket.on("withdrawal", function(msg) {
    io.emit("serverWithdrawal", { ...msg, id: socket.id });
  });
  
  socket.on("transactionCancelServer", function(msg) {
    io.to(msg.login).emit("transactionCancel", { ...msg });
  });

  socket.on("accountBallanceUpdate", function(msg) {
      io.to(msg.login).emit("accountBallance", msg);
  });

  socket.on("errorLogin", (msg) => {
    io.to(msg.login).emit("errorLogin", msg.msg);
  });
  
  socket.on("logout", (msg) => {
    io.emit("logoutServer", socket.id);
  });

  socket.on("disconnect", () => {
    io.emit("disconnect", socket.id);
  });
});
server.listen(8085, () => {
  console.log("Server is listening on port 8085");
});
