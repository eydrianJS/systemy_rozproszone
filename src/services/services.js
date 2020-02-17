const API = "http://172.18.109.193:8081";
const CONFIG = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  }
};

const checkResponse = (res) => {
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
      return checkResponse(res);
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
