const express = require("express");
var cors = require("cors");
var http = require("http");
const mongo = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
var app = express();
var server = http.createServer(app);
const api = "http://localhost";

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
      aj = client.db("Jeden"); //MongoClient.connect();
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
      km = client.db("Dwa"); //MongoClient.connect();
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
      np = client.db("Trzy"); //MongoClient.connect();
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
      qz = client.db("Cztery"); //MongoClient.connect();
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
}, 1000);

setInterval(() => {
  const actualRequests = [];
  let valid = true;
  buffor.forEach((value, key) => {
    valid = value.alreadyUpdated ? valid : false;
  });
  if (!valid) return;

  const maxRequest = 10;

  for (let i = 0; i < maxRequest; i++) {
    if (requestQueue.length > 0) {
      actualRequests.push(requestQueue[0]);
      requestQueue.shift();
    } else {
      break;
    }
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
      let databaseUser = getUser(request.user);
      buffor.set(request.user, { ...databaseUser, alreadyUpdated: false });
    }
    request.name(request.user, ...request.params);
  });
}, 500);

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

const deposite = async (user, value, sessionID) => {
  let accountBal = parseInt(buffor.get(user).accountBalance);
  buffor.get(user).accountBalance = accountBal += parseInt(value);
  atm.emit("accountBallanceUpdate", {
    ...buffor.get(user),
    login: sessionID
  });
};

const withDrawal = async (user, value, sessionID) => {
  if (parseInt(buffor.get(user).accountBalance) >= value) {
    buffor.get(user).accountBalance -= value;
    atm.emit("accountBallanceUpdate", {
      ...buffor.get(user),
      login: sessionID
    });
  } else {
    atm.emit("transactionCancelServer", {
      msg: "Za mało środków na koncie",
      login: sessionID
    });
  }
};

const serverTransfer = async (user, value, sessionID) => {
  if (parseInt(buffor.get(user).accountBalance) >= value) {
    buffor.get(user).accountBalance -= value;
    tranfers.emit("accountBallanceUpdate", {
      ...buffor.get(user),
      login: sessionID
    });
  } else {
    tranfers.emit("transactionCancelServer", {
      msg: "Za mało środków na koncie",
      login: sessionID
    });
  }
};

const cardPay = async (user, value, cardNumber, sessionID) => {
  if (parseInt(buffor.get(user).accountBalance) >= value) {
    if(buffor.get(user).cardNumber === cardNumber) {
      buffor.get(user).accountBalance -= value;
      card.emit("accountBallanceUpdate", {
        ...buffor.get(user),
        login: sessionID
      });
    } else {
      card.emit("transactionCancelServer", {
        msg: "Błędny numer karty",
        login: sessionID
      });
    }
  } else {
    card.emit("transactionCancelServer", {
      msg: "Za mało środków na koncie",
      login: sessionID
    });
  }
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
  let newVal = { $set: { accountBalance: buffor.get(id).accountBalance } };
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
      login: msg.id
    });
    atm.emit("serverLoginResponse", { ...user, login: msg.id });
  } else {
    atm.emit("errorLogin", {
      msg: "Login or password is incorrect",
      login: msg.id
    });
  }
});

tranfers.on("serverLogin", async msg => {
  let id = msg.username;
  let user = await getUser(id);

  if (user) {
    loginUsers[msg.id] = user.userID;
    tranfers.emit("accountBallanceUpdate", {
      ...user,
      login: msg.id
    });
    tranfers.emit("serverLoginResponse", { ...user, login: msg.id });
  } else {
    tranfers.emit("errorLogin", {
      msg: "Login or password is incorrect",
      login: msg.id
    });
  }
});

card.on("serverLogin", async msg => {
  let id = msg.username;
  let user = await getUser(id);

  if (user) {
    loginUsers[msg.id] = user.userID;
    card.emit("accountBallanceUpdate", {
      ...user,
      login: msg.id
    });
    card.emit("serverLoginResponse", { ...user, login: msg.id });
  } else {
    card.emit("errorLogin", {
      msg: "Login or password is incorrect",
      login: msg.id
    });
  }
});

atm.on("disconnect", id => {
  buffor.delete(loginUsers[id]);
  delete loginUsers[id];
});

atm.on("logoutServer", id => {
  console.log(buffor);
  console.log(loginUsers);
  buffor.delete(loginUsers[id]);
  delete loginUsers[id];
});

card.on("logoutServer", id => {
  console.log(buffor);
  console.log(loginUsers);
  buffor.delete(loginUsers[id]);
  delete loginUsers[id];
});

tranfers.on("logoutServer", id => {
  console.log(buffor);
  console.log(loginUsers);
  buffor.delete(loginUsers[id]);
  delete loginUsers[id];
});

atm.on("serverDeposite", msg => {
  try {
    sendToQue(loginUsers[msg.id], deposite, msg.transferAmount, msg.id);
  } catch (e) {}
});

atm.on("serverWithdrawal", msg => {
  try {
    sendToQue(loginUsers[msg.id], withDrawal, msg.transferAmount, msg.id);
  } catch (e) {}
});

card.on("serverPay", msg => {
  try {
    sendToQue(loginUsers[msg.id], cardPay, msg.transferAmount, msg.card, msg.id);
  } catch (e) {}
});

tranfers.on("serverTransfer", msg => {
  try {
    sendToQue(loginUsers[msg.id], serverTransfer, msg.transferAmount, msg.id);
  } catch (e) {}
});

server.listen(8081, () => {
  console.log("Server is listening on port 8081");
});
