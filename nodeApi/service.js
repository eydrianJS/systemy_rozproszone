const express = require("express");
var cors = require("cors");
var http = require("http");
const mongo = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
var app = express();
var server = http.createServer(app);
const api = "http://192.168.0.12";

var ioSerwer = require("socket.io-client");
var tranfers = ioSerwer.connect(`${api}:8084`, { reconnect: true });
var card = ioSerwer.connect(`${api}:8083`, { reconnect: true });
var atm = ioSerwer.connect(`${api}:8085`, { reconnect: true });

let db, m;
const url = "mongodb://localhost:27017";

const main = () => {
  mongo.connect(
    url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    (err, client) => {
      if (err) {
        console.error(err);
        return;
      }
      db = client.db("Bank"); //MongoClient.connect();
      m = name => db.collection(name);
    }
  );
};
main();

const loginUsers = [];
const requestQueue = [];

const sendToQue = (name, ...params) => {
  requestQueue.push({
    name,
    params
  });
  if (requestQueue.length === 1) {
    name(...params);
  }
};

const deposite = async (user, value) => {
  let query = { _id: new ObjectID(loginUsers[user]._id) };
  loginUsers[user] = await db.collection("users").findOne(query);
  loginUsers[user].accountBalance =
    loginUsers[user].accountBalance + parseFloat(value);
  let newVal = { $set: loginUsers[user] };
  let total = await db
    .collection("users")
    .updateOne(query, newVal, function(err, res) {
      if (err) throw err;
      console.log(res.result.nModified + " document(s) updated");
    });
  requestQueue.shift();
  if (requestQueue.length !== 0) {
    requestQueue[0].name(...requestQueue[0].params);
  }
  atm.emit("accountBallanceUpdate", loginUsers[user]);
  card.emit("accountBallanceUpdate", loginUsers[user]);
  tranfers.emit("accountBallanceUpdate", loginUsers[user]);
};

const withDrawal = async (user, value) => {
  let query = { _id: new ObjectID(loginUsers[user]._id) };
  loginUsers[user] = await db.collection("users").findOne(query);
  console.log(loginUsers[user].accountBalance);
  if (loginUsers[user].accountBalance < value) {
    console.log("dupa");
    requestQueue.shift();
    if (requestQueue.length !== 0) {
      requestQueue[0].name(...requestQueue[0].params);
    }
    return;
  }
  loginUsers[user].accountBalance =
    loginUsers[user].accountBalance - parseFloat(value);
  let newVal = { $set: loginUsers[user] };
  let total = await db
    .collection("users")
    .updateOne(query, newVal, function(err, res) {
      if (err) throw err;
      console.log(res.result.nModified + " document(s) updated");
    });
  requestQueue.shift();
  atm.emit("accountBallanceUpdate", loginUsers[user]);
  card.emit("accountBallanceUpdate", loginUsers[user]);
  tranfers.emit("accountBallanceUpdate", loginUsers[user]);
};

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8002");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

atm.on("serverLogin", async msg => {
  let user = await db
    .collection("users")
    .findOne({ username: msg.username, password: msg.password });
  if (user) {
    loginUsers[msg.id] = user;
  }
  atm.emit("serverLoginResponse", user);
});

atm.on("serverDeposite", msg => {
  try {
    sendToQue(deposite, msg.id, msg.transferAmount);
  } catch (e) {}
});

atm.on("serverWithdrawal", msg => {
  try {
    sendToQue(withDrawal, msg.id, msg.transferAmount);
  } catch (e) {}
});

card.on("serverLogin", async msg => {
  try {
    let user = await db
      .collection("users")
      .findOne({ username: msg.username, password: msg.password });
    card.emit("serverLoginResponse", user);
    if (user) {
      loginUsers[msg.id] = user;
    }
  } catch (e) {}
});

tranfers.on("serverLogin", async msg => {
  try {
    let user = await db
      .collection("users")
      .findOne({ username: msg.username, password: msg.password });
    tranfers.emit("serverLoginResponse", user);
    if (user) {
      loginUsers[msg.id] = user;
    }
  } catch (e) {}
});

server.listen(8081, () => {
  console.log("Server is listening on port 8081");
});

// const express = require("express");
// const bodyParser = require("body-parser");
// var cors = require("cors");
// var http = require("http");
// var app = express();
// var server = http.createServer(app);

// var io = require("socket.io").listen(server);
// const users = [
//   {
//     name: "Jan",
//     surname: "Kowalski",
//     username: "123456",
//     password: "123456",
//     accountBalance: 1000,
//     accountNumber: "48 1082 5132 0000 1202 4134 3904",
//     cardNumber: "12312312"
//   }
// ];
// // create express app
// app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:8004");
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Methods", "*");
//   next();
// });

// const router = express.Router();

// router.get("/", (req, res) => {
//   res.send({ response: "I am alive" }).status(200);
// });

// // parse requests of content-type - application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({ extended: true }));

// // parse requests of content-type - application/json
// app.use(bodyParser.json());

// // define a simple route
// app.get("/", (req, res) => {
//   res.json({
//     message:
//       "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."
//   });
// });

// app.post("/addUser", ({ body }, res) => {
//   try {
//     const user = {
//       username: body.username,
//       password: body.password
//     };
//     users.push(user);
//     console.log(user);
//     res.json({ message: "User ok" });
//   } catch (e) {}
// });

// app.post("/login", ({ body }, res) => {
//   try {
//     const user = users.filter(({ username, password }) => {
//       return username === body.username && password === body.password;
//     });
//     if (user.length > 0) {
//       res.json({ message: "Login ok" });
//     }
//     res.sendStatus(404);
//   } catch (e) {}
// });

// // płatność w sklepie
// app.post("/pay", ({ body }, res) => {
//   try {
//     users.map(user => {
//       if (body.username == user.username) {
//         if (user.accountBalance < body.transferAmount) {
//           res.json({ message: "Insufficient account balance" });
//         } else {
//           user.accountBalance -= body.transferAmount;
//           res.json({
//             message: "Trasfer ok",
//             accountBalance: user.accountBalance
//           });
//         }
//       }
//       return user;
//     });

//     res.sendStatus(404);
//   } catch (e) {}
// });
// // przelew
// app.post("/transfer", ({ body }, res) => {
//   try {
//     users.map(user => {
//       if (body.username == user.username) {
//         if (user.accountBalance < body.transferAmount) {
//           res.json({ message: "Insufficient account balance" });
//         } else {
//           user.accountBalance -= body.transferAmount;
//           res.json({
//             message: "Trasfer ok",
//             accountBalance: user.accountBalance
//           });
//         }
//       }
//       return user;
//     });
//     res.sendStatus(404);
//   } catch (e) {}
// });
// // wyplatas
// app.post("/withdrawal", ({ body }, res) => {
//   try {
//     users.map(user => {
//       if (body.username == user.username) {
//         if (user.accountBalance < body.transferAmount) {
//           res.json({ message: "Insufficient account balance" });
//         } else {
//           user.accountBalance -= body.transferAmount;
//           res.json({
//             message: "Trasfer ok",
//             accountBalance: user.accountBalance
//           });
//         }
//       }
//       return user;
//     });

//     res.sendStatus(404);
//   } catch (e) {}
// });
// //wplata
// app.post("/deposit", ({ body }, res) => {
//   try {
//     users.map(user => {
//       if (body.username == user.username) {
//         user.accountBalance += body.transferAmount;
//         res.json({
//           message: "Trasfer ok",
//           accountBalance: user.accountBalance
//         });
//       }
//       return user;
//     });

//     res.sendStatus(404);
//   } catch (e) {}
// });

// io.on("connect", function(socket) {
//   // Stan konta
//   console.log("aaaaaaaa");
//   socket.on("login", (msg) => {
//     console.log(msg);
//   })
//   // app.post("/balanceAccount", ({ body }, res) => {
//   //   try {
//   //     const user = users.filter(({ username }) => {
//   //       return body.username === username;
//   //     });
//   //     if (user.length > 0) {
//   //       res.json({ accountBalance: user[0] });
//   //       socket.on("accountBalance", function(msg) {
//   //         console.log(msg + "a");
//   //         io.emit("accountBalance", { acc: users[0].accountBalance });
//   //       });
//   //     }
//   //     res.sendStatus(404);
//   //   } catch (e) {}
//   // });
// });
// // listen for requests
// server.listen(8081, () => {
//   console.log("Server is listening on port 8081");
// });
