const API = "http://192.168.0.12:8081";
const CONFIG = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};

const checkRespone = (res) => {
    if (res.status === 200) {
        return res.json();
      }
      return {};
}

export const postLogin = value => {
  return fetch(`${API}/login`, {
    ...CONFIG,
    body: JSON.stringify({
      username: value.username,
      password: value.password
    })
  })
    .then(res => {
      return checkRespone(res);
    })
    .then(res => {
      if (res.message === "Login ok") {
        return true;
      } else {
        alert("User doesn't exist");
        return false;
      }
    });
};
