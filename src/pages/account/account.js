import React, { useState } from "react";
import "./account.css";
import Button from '../../components/UI/button';
import Login from "./../../components/login/login";
import useLoginEmmiter from "../../emmiters/loginEmmiter.js";
import AccountBalance from "./../../components/accountBalance/accountBalance";

const Account = () => {
  const [accountValue, setAccountValue] = useState("");
  const { login, onChange, Logout, information, socket } = useLoginEmmiter(
    "8084"
  );

  const handleChangeAccount = e => {
    setAccountValue(e.target.value);
  };

  return (
    <>
      {!login ? (
        <Login onChange={onChange} login={login} logout={Logout} />
      ) : (
        <div className="account-contanier">
          <AccountBalance information={information} />
          <h1>Dokonaj przelewu</h1>
          <input
            className="account-input"
            type="text"
            placeholder="Wpisz kwotę"
            value={accountValue}
            onChange={handleChangeAccount}
          />
          <Button>przelej</Button>
        </div>
      )}{" "}
    </>
  );
};

export default Account;
