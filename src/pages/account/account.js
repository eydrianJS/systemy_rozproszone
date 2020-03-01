import React, { useState } from "react";
import "./account.css";
import Button from "../../components/UI/button";
import Login from "./../../components/login/login";
import Logout from "./../../components/logout/logout"
import useLoginEmmiter from "../../emmiters/loginEmmiter.js";
import AccountBalance from "./../../components/accountBalance/accountBalance";
import History from "../../components/historyTransaction/historyTransaction";
import Register from '../../components/register/register';

const Account = () => {
  const [accountValue, setAccountValue] = useState("");
  const {
    login,
    onChange,
    logout,
    information,
    socket,
    accountBallance
  } = useLoginEmmiter("8084");

  const handleChangeAccount = e => {
    setAccountValue(e.target.value);
  };

  const handleTransfer = e => {
    setAccountValue("");
    socket.emit("transfer", { transferAmount: accountValue });
  };

  return (
    <>
      {!login ? (
        <div>
        <Login onChange={onChange} login={login} logout={logout} />
        {/* <Register login={login}/> */}
        </div>
      ) : (
        <div className="account-contanier">
          <Logout logout={logout}/>
          <AccountBalance
            information={information}
            accountBallance={accountBallance}
          />
          <h1>Dokonaj przelewu</h1>
          <input
            className="account-input"
            type="text"
            placeholder="Wpisz kwotę"
            value={accountValue}
            onChange={handleChangeAccount}
          />
          <Button click={handleTransfer}>przelej</Button>
          {accountBallance ? <History history={accountBallance} /> : null}
        </div>
      )}{" "}
    </>
  );
};

export default Account;
