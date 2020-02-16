const mongo = require("mongodb").MongoClient;
const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const bodyParser = require("body-parser");
const ObjectID = require('mongodb').ObjectID;

const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

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
        return;
      }
      db = client.db("Main"); //MongoClient.connect();
      m = name => db.collection(name);
    }
  );
};
main();

router
  .get("/", async (req, res) => {
    try {
      let total = await db
        .collection("timer")
        .find({})
        .toArray();
      return res.json(total);
    } catch (e) {
      res.json(e);
    }
  })
  .put("/",async (req, res) => {
    try {
        let query = { "_id":  new ObjectID("5df3411dfc110efe30d47891")} ;
        let newVal = {$set: {creator: "new Creator", startTime: new Date().toISOString()}};
        let total = await db
          .collection("timer")
          .updateOne(query,newVal , function(err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " document(s) updated");
          });
      } catch (e) {
        res.json(e);
      }
    res.send("Update the book");
  });

app.use("/", router);

io.on("connection", socket => {
  const { id } = socket.client;
  socket.on("openDialog", async (openDialog) => {
    let newState = {...openDialog}
    if(openDialog.agree) {
      let query = { "_id":  new ObjectID("5df3411dfc110efe30d47891")} ;
      const set = {creator: "new Creator", startTime: new Date().toISOString()}
      let newVal = {$set: set};
      let total = await db
        .collection("timer")
        .updateOne(query,newVal , function(err, res) {
          if (err) throw err;
          console.log(res.result.nModified + " document(s) updated");
        });
        newState =  {...newState, ...set};
    }
    console.log(newState);
    io.emit("openDialog", newState);
  });
});


server.listen(8081, () => {
  console.log("Example app listening on port 8000!");
});
