const API = "http://192.168.0.12:8081";

export const postLogin = value => {
  return fetch(`${API}/login`, {
    method: "POST",
    mode: "cors",
    body: JSON.stringify({
      username: value.username,
      password: value.password
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => {
      if (res.status === 200) {
        return res.json();
      }
      return {};
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
