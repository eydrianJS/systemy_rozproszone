import React, { useState } from "react";
import "./login.css";

const Login = ({ onChange, logout, login }) => {
  const [value, setValue] = useState({
    username: "",
    password: ""
  });

  const handleChangeUsername = event => {
    setValue({
      ...value,
      username: event.target.value
    });
  };
  
  const handleChangePassword = event => {
    setValue({
      ...value,
      password: event.target.value
    });
  };

  const change = e => {
    setValue({
      username: "",
      password: ""
    });
    onChange(e, value);
  };

  return login ? (
    <button className="login-button" type="submit" onClick={logout}>
      Loguot
    </button>
  ) : (
    <form className="login" onSubmit={e => change(e)}>
      <h1 className="login-title">Zaloguj się</h1>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        value={value.username}
        onChange={handleChangeUsername}
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={value.password}
        onChange={handleChangePassword}
      />
      <button className="login-button" type="submit">
        Dalej
      </button>
    </form>
  );
};

export default Login;
