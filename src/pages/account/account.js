import React, { useState } from "react";
import "./account.css";
import Button from '../../components/UI/button';
import Login from "./../../components/login/login";
import useLoginEmmiter from "../../emmiters/loginEmmiter.js";
import AccountBalance from "./../../components/accountBalance/accountBalance";
import History from "../../components/historyTransaction/historyTransaction";

const Account = () => {
  const [accountValue, setAccountValue] = useState("");
  const { login, onChange, Logout, information, socket, accountBallance } = useLoginEmmiter(
    "8084"
  );

  const handleChangeAccount = e => {
    setAccountValue(e.target.value);
  };

  const handleTransfer = e => {
    socket.emit("transfer", { transferAmount: accountValue });
  };
  
  return (
    <>
      {!login ? (
        <Login onChange={onChange} login={login} logout={Logout} />
      ) : (
        <div className="account-contanier">
          <AccountBalance information={information} accountBallance={accountBallance}/>
          <h1>Dokonaj przelewu</h1>
          <input
            className="account-input"
            type="text"
            placeholder="Wpisz kwotę"
            value={accountValue}
            onChange={handleChangeAccount}
          />
          <Button click={handleTransfer}>przelej</Button>
          {accountBallance ? (
            <History history={accountBallance} />
          ) : null}
        </div>
      )}{" "}
    </>
  );
};

export default Account;
