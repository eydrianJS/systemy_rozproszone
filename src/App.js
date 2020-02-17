import React, { useState } from "react";
import Navigation from "./components/nav/nav";
import "./App.css";
import Login from "./components/login/login";
import { Route } from "react-router-dom";
import Bank from "./pages/bank/bank";
import Shop from "./pages/shop/shop";
import AccountBalance from './components/accountBalance/accountBalance';
import Account from './pages/account/account';
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
          <Navigation login={login} logout={Logout}/>
          <AccountBalance/>
          <Route path="/bank" render={() => <Bank />} />
          <Route path="/shop" component={Shop} />
          <Route path="/account" component={Account} />
        </>
      ) : (
        false
      )}
    </div>
  );
}

export default App;
