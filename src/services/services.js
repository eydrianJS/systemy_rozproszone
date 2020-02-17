// const API = "http://192.168.0.12:8081";
// const CONFIG = {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   }
// };

// const checkResponse = (res) => {
//     if (res.status === 200) {
//         return res.json();
//       }
//       return {};
// }

export const postLogin = (value, socket) => {
  socket.emit("login", value)
};

// export const balanceAccount = value => {
//   return fetch(`${API}/balanceAccount`, {
//     ...CONFIG,
//     body: JSON.stringify({
//       username: value.username,
//     })
//   })
//     .then(res => {
//       return checkResponse(res);
//     })
//     .then(res => {
//       if (res) {
//         return res;
//       } else {
//         alert("User doesn't exist");
//         return false;
//       }
//     });
// };
