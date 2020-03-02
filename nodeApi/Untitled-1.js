
// const createCardNumber = () => {
//   let rand = Math.floor(Math.random() * 10000000000000000).toString();
//   while (rand.length < 16) {
//     rand = "0" + rand;
//   }
//   return rand
//     .split("")
//     .map((item, idx) => (idx % 4 !== 0 ? item : " " + item))
//     .join("");
// };
// const createAccount = user => {
//   const accountNumber = createAccountNumber();
//   const cardNumber = createCardNumber();
//   var myobj = {
//     name: user.name,
//     surname: user.surname,
//     username: user.login,
//     password: user.password,
//     accounts: []
//   };
//   db.collection("users").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     const newUser = res.insertedId;
//     const account = {
//       userIds: [res.insertedId],
//       history: [],
//       accountBalance: 0,
//       accountNumber: accountNumber,
//       cardNumber: cardNumber
//     };
//     db.collection("accounts").insertOne(account, function(err, res) {
//       if (err) throw err;
//       console.log("1 document inserted");
//       const createdAccount = res.insertedId;
//       const query = { _id: new ObjectID(createdAccount) }; // napisać query
//       db.collection("accounts").updateOne(
//         query,
//         {
//           $push: {
//             users: newUser
//           }
//         },
//         function(err, res) {
//           if (err) throw err;
//           console.log("1 document updated");
//         }
//       );
//     });
//   });
// };



const withDrawal = async (user, value, type) => {
    // let query = { _id: new ObjectID(loginUsers[user].accounts[0]) };
    // let account = await db.collection("accounts").findOne(query);
  
    // if (account.accountBalance < value) {
    //   console.log("dupa");
    //   requestQueue.shift();
    //   if (requestQueue.length !== 0) {
    //     requestQueue[0].name(...requestQueue[0].params);
    //   }
    //   return;
    // }
    // loginUsers[user].accountBalance = account.accountBalance - parseFloat(value);
    // let newVal = createUpdateRequest(user, value, type);
    // sendUpdate(query, newVal, user);
  
    // requestQueue.shift();
    // if (requestQueue.length !== 0) {
    //   requestQueue[0].name(...requestQueue[0].params);
    // }
  };
  
  const cardPay = async (user, value, cardNumber, type) => {
    // let query = { _id: new ObjectID(loginUsers[user].accounts[0]) };
    // let account = await db.collection("accounts").findOne(query);
  
    // if (account.accountBalance < value || account.cardNumber !== cardNumber) {
    //   card.emit("transactionCancel", {
    //     login: user,
    //     msg: "We cannot make the payment"
    //   });
    //   requestQueue.shift();
    //   if (requestQueue.length !== 0) {
    //     requestQueue[0].name(...requestQueue[0].params);
    //   }
    //   return;
    // }
    // loginUsers[user].accountBalance = account.accountBalance - parseFloat(value);
    // let newVal = createUpdateRequest(user, value, type);
    // sendUpdate(query, newVal, user);
  
    // requestQueue.shift();
    // if (requestQueue.length !== 0) {
    //   requestQueue[0].name(...requestQueue[0].params);
    // }
  };

  SSID:	WSB_EDU
Protocol:	Wi-Fi 4 (802.11n)
Security type:	WPA2-Personal
Network band:	2.4 GHz
Network channel:	1
Link-local IPv6 address:	fe80::81c1:2f83:fc89:1e46%10
IPv4 address:	
IPv4 DNS servers:	8.8.4.4
Manufacturer:	Intel Corporation
Description:	Intel(R) Wireless-AC 9462
Driver version:	21.50.1.1
Physical address (MAC):	3C-F0-11-AD-76-59


const createAccountNumber = () => {
    let rand = Math.floor(Math.random() * 1000000000000).toString();
    while (rand.length < 12) {
      rand = "0" + rand;
    }
    let control = Math.floor(Math.random() * 2);
    let sum = Math.floor(Math.random() * 10);
    while (rand.length < 2) {
      sum = "0" + sum;
    }
    return "PL" + sum + "10100071222" + control + rand;
  };

  const sendUpdate = (query, newVal, user) => {
    db.collection("accounts").updateOne(query, newVal, function(err, res) {
      if (err) throw err;
      console.log(res.result.nModified + " document(s) updated");
      updatedHistory(query, user);
    });
  };

  
  const createUpdateRequest = (user, value, type) => {
    return {
      $set: { accountBalance: loginUsers[user].accountBalance },
      $push: {
        history: {
          date: new Date().toISOString(),
          value: value,
          saldoAfter: loginUsers[user].accountBalance,
          user: loginUsers[user]._id,
          type: type
        }
      }
    };
  };

  
  const updatedHistory = async (query, user) => {
    let account = await db.collection("accounts").findOne(query);
  
    atm.emit("accountBallanceUpdate", {
      ...account,
      socketId: loginUsers[user].socketId
    });
    card.emit("accountBallanceUpdate", {
      ...account,
      socketId: loginUsers[user].socketId
    });
    tranfers.emit("accountBallanceUpdate", {
      ...account,
      socketId: loginUsers[user].socketId
    });
  };