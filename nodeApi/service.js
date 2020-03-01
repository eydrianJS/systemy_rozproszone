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

let aj, km, np, qz, m;
const url = "mongodb://localhost:27017";

const mainaj = () => {
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
      aj = client.db("aj"); //MongoClient.connect();
    }
  );
};
mainaj();
const mainkm = () => {
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
      km = client.db("km"); //MongoClient.connect();
    }
  );
};
mainkm();
const mainnp = () => {
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
      np = client.db("np"); //MongoClient.connect();
    }
  );
};
mainnp();
const mainqz = () => {
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
      qz = client.db("qz"); //MongoClient.connect();
    }
  );
};
mainqz();
let buffor = new Map();

const loginUsers = [];
const requestQueue = [];

setInterval(() => {
  buffor.forEach((user, userID) => {
    if (!user.alreadyUpdated) {
      updateUser(userID);
      user.alreadyUpdated = true;
    }
  });
}, 2000);

setInterval(() => {
  const actualRequests = [];
  let valid = true;
  buffor.forEach((value, key) => {
    valid = value.alreadyUpdated? valid: false;
  })
  if (!valid) return;

  const maxRequest = 10;

  for (let i = 0; i < maxRequest; i++) {
    if (requestQueue.length > 0) {
      actualRequests.push(requestQueue[0]);
      requestQueue.shift();
    }
    break;
  }

  let toRemove = [];
  buffor.forEach((value, key) => {
    let notRemove = false;
    value.alreadyUpdated = false;
    actualRequests.forEach(request => {
      if (request.user === key) {
        notRemove = true;
        request.userInsideBuffor = true;
      }
    });
    if (!notRemove) toRemove.push(key);
  });

  toRemove.forEach(item => {
    buffor.delete(item);
  });

  actualRequests.forEach(request => {
    if (!request.userInsideBuffor) {
      buffor.push(getUser(request.user));
    }
    console.log(request);
    request.name(request.user, ...request.params);
  });
}, 2000);

const sendToQue = async (user, name, ...params) => {
  requestQueue.push({
    user,
    name,
    params
  });
  if (!buffor.get(user) && buffor.size < 10) {
    let databaseUser = await getUser(user);
    buffor.set(user, { ...databaseUser, alreadyUpdated: true });
  }
};


const deposite = async (user, value) => {
  buffor.get(user).accountBalance += value;
};

app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:8002");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

const getDatabase = id => {
  if (parseInt(id) < 100) {
    return aj;
  } else if (parseInt(id) < 200) {
    return km;
  } else if (parseInt(id) < 300) {
    return np;
  }
  return qz;
};

const getUser = async id => {
  let db = getDatabase(id);
  let user = await db.collection("users").findOne({ userID: id });
  return user;
};

const updateUser = id => {
  let db = getDatabase(id);
  let query = { userID: id };
  let newVal = {$set: { accountBalance: buffor.get(id).accountBalance }};
  db.collection("users").updateOne(query, newVal, function(err, res) {
    if (err) throw err;
    console.log(res.result.nModified + " document(s) updated");
  });
};

atm.on("serverLogin", async msg => {
  let id = msg.username;
  let user = await getUser(id);

  if (user) {
    loginUsers[msg.id] = user.userID;
    atm.emit("accountBallanceUpdate", {
      ...user,
      socketId: msg.id
    });
    atm.emit("serverLoginResponse", { ...user, login: msg.id });
  } else {
    atm.emit("errorLogin", {
      msg: "Login or password is incorrect",
      login: msg.id
    });
  }
});

atm.on("disconnect", id => {
  delete loginUsers[id];
});

atm.on("serverDeposite", msg => {
  try {
    // console.log(loginUsers[msg.id]);
    sendToQue(loginUsers[msg.id], deposite, msg.transferAmount);
  } catch (e) {}
});

atm.on("serverWithdrawal", msg => {
  try {
    sendToQue(withDrawal, msg.id, msg.transferAmount, "Withdral");
  } catch (e) {}
});

card.on("serverLogin", async msg => {
  let user = await db
    .collection("users")
    .findOne({ username: msg.username, password: msg.password });
  if (user) {
    let account = await db
      .collection("accounts")
      .findOne({ _id: new ObjectID(user.accounts[0]) });
    user.socketId = [];
    Object.entries(loginUsers).forEach(([key, val]) => {
      if (account.accountNumber === val.accountNumber) {
        loginUsers[key].socketId.push(msg.id);
        user.socketId = loginUsers[key].socketId;
      }
    });
    user.socketId.push(msg.id);
    loginUsers[msg.id] = { ...user, ...account };
    card.emit("accountBallanceUpdate", {
      ...account,
      socketId: loginUsers[msg.id].socketId
    });
    card.emit("serverLoginResponse", { ...loginUsers[msg.id], login: msg.id });
  } else {
    card.emit("errorLogin", {
      msg: "Login or password is incorrect",
      login: msg.id
    });
  }
});

card.on("serverPay", msg => {
  try {
    sendToQue(cardPay, msg.id, msg.transferAmount, msg.card, "Card Pay");
  } catch (e) {}
});

tranfers.on("serverLogin", async msg => {
  let user = await db
    .collection("users")
    .findOne({ username: msg.username, password: msg.password });
  if (user) {
    let account = await db
      .collection("accounts")
      .findOne({ _id: new ObjectID(user.accounts[0]) });
    user.socketId = [];
    Object.entries(loginUsers).forEach(([key, val]) => {
      if (account.accountNumber === val.accountNumber) {
        loginUsers[key].socketId.push(msg.id);
        user.socketId = loginUsers[key].socketId;
      }
    });
    user.socketId.push(msg.id);
    loginUsers[msg.id] = { ...user, ...account };
    tranfers.emit("accountBallanceUpdate", {
      ...account,
      socketId: loginUsers[msg.id].socketId
    });
    tranfers.emit("serverLoginResponse", {
      ...loginUsers[msg.id],
      login: msg.id
    });
  } else {
    tranfers.emit("errorLogin", {
      msg: "Login or password is incorrect",
      login: msg.id
    });
  }
});

tranfers.on("serverTransfer", msg => {
  try {
    sendToQue(withDrawal, msg.id, msg.transferAmount, "Transfer");
  } catch (e) {}
});

server.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
