const express = require('express');
const bodyParser = require('body-parser');
const users = [
  {
    name: "Jan",
    surname: "Kowalski",
    username: "123456",
    password: "123456",
    accountBalance: 1000                                   
  }
];
// create express app
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// define a simple route
app.get('/', (req, res) => {
    res.json({"message": "Welcome to EasyNotes application. Take notes quickly. Organize and keep track of all your notes."});
});

app.post('/addUser', ({body}, res) => {
    try {
      const user  = {
        username: body.username,
        password: body.password
      }
      users.push(user);
      console.log(user);
      res.json({"message": "User ok" });
    } catch (e) {      
    }
});

app.post('/login', ({body}, res) => {
  try {
    const user = users.filter(({username, password}) => {
      console.log(username);
      console.log(password);
      return (username == body.username && password == body.password)
    });
    console.log(user);
    if(user.length > 0) {
      res.json({"message": "Login ok" });
    }
    res.sendStatus(404)
  } catch (e) {      
  }
});


app.post('/balanceAccount', ({body}, res) => {
    try {
      console.log(body);
      const user = users.filter(({ username }) => {
        return body.username == username;
      })
      res.json({"accountBalance": user[0].accountBalance });
    } catch (e) {      
    }
});

app.post('/pay', ({body}, res) => {
  try {
    const user = users.filter(({ username }) => {
      return body.username == username;
    })
    res.json({"accountBalance": user[0].accountBalance });
  } catch (e) {      
  }
});

// listen for requests
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});