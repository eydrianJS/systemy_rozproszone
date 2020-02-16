import React, { useState } from "react";
import Navigation from "./components/nav/nav";
import "./App.css";
import Login from "./components/login/login";
import { Route } from "react-router-dom";
import Bank from "./pages/bank/bank";
import { postLogin } from "./services/services";

function App() {
  const [login, setLogin] = useState(false);

  const onChange = async (e, value) => {
    e.preventDefault();
    const login = await postLogin(value);
    setLogin(login);
  };

  const Logout = () => {
    setLogin(false);
  };

  return (
    <div className="App">
      <Login onChange={onChange} login={login} logout={Logout} />
      {login ? (
        <>
          <Navigation />
          <Route path="/bank" component={Bank} />
          <Route path="/shop" component={Bank} />
          <Route path="/account" component={Bank} />
        </>
      ) : (
        false
      )}
    </div>
  );
}

export default App;
