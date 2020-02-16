const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')
const users = [
  {
    name: "Jan",
    surname: "Kowalski",
    username: "123456",
    password: "123456",
    accountBalance: 1000,
    accountNumber: "12345678908765544",
    cardNumber: "12312312"                          
  }
];
// create express app
const app = express();

app.use(cors())
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
      if(user.length > 0) {        
        res.json({"accountBalance": user[0].accountBalance });
      }
      res.sendStatus(404)
    } catch (e) {      
    }
});

app.post('/pay', ({body}, res) => {
  try {
    users.map((user) => {
      if (body.username == user.username) {
        if (user.accountBalance < body.transferAmount) {
          res.json({"message": "Insufficient account balance" })
        }  else {
          user.accountBalance -= body.transferAmount;
          res.json({"message": "Trasfer ok", "accountBalance":  user.accountBalance})
        }
      } 
      return user;
    })

    res.sendStatus(404)
  } catch (e) {      
  }
});

app.post('/transfer', ({body}, res) => {
  try {
    users.map((user) => {
      if (body.username == user.username) {
        if (user.accountBalance < body.transferAmount) {
          res.json({"message": "Insufficient account balance" })
        }  else {
          user.accountBalance -= body.transferAmount;
          res.json({"message": "Trasfer ok", "accountBalance":  user.accountBalance})
        }
      } 
      return user;
    })
    res.sendStatus(404)
  } catch (e) {      
  }
});

app.post('/payoff', ({body}, res) => {
  try {
    users.map((user) => {
      if (body.username == user.username) {
        if (user.accountBalance < body.transferAmount) {
          res.json({"message": "Insufficient account balance" })
        }  else {
          user.accountBalance -= body.transferAmount;
          res.json({"message": "Trasfer ok", "accountBalance":  user.accountBalance})
        }
      } 
      return user;
    })

    res.sendStatus(404)
  } catch (e) {      
  }
});

app.post('/payment', ({body}, res) => {
  try {
    users.map((user) => {
      if (body.username == user.username) {
        user.accountBalance += body.transferAmount;
        res.json({"message": "Trasfer ok", "accountBalance":  user.accountBalance})
      } 
      return user;
    })

    res.sendStatus(404)
  } catch (e) {      
  }
});

// listen for requests
app.listen(8081, () => {
    console.log("Server is listening on port 8081");
});