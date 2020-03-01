import React, { useState } from "react";
import "./login.css";
import Button from '../UI/button';

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

  return !login && (
    <form className="login" onSubmit={e => change(e)}>
      <h1 className="login-title">Zaloguj się</h1>
      <input
        className="login-input"
        type="text"
        placeholder="Username"
        value={value.username}
        onChange={handleChangeUsername}
      />
      {/* <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={value.password}
        onChange={handleChangePassword}
      /> */}
      <Button type="submit">
        Dalej
      </Button>
    </form>
  );
};

export default Login;
