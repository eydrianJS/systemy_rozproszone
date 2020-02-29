import React, { useState } from "react";
import "./shop.css";
import Button from "../../components/UI/button";
import Login from "./../../components/login/login";
import Logout from "./../../components/logout/logout"
import useLoginEmmiter from "../../emmiters/loginEmmiter.js";
import AccountBalance from "./../../components/accountBalance/accountBalance";
import History from "../../components/historyTransaction/historyTransaction";

const Shop = () => {
  const [amountValue, setAmount] = useState("");
  const [cardValue, setCardValue] = useState("");

  const { login, onChange, logout, information, socket, accountBallance } = useLoginEmmiter(
    "8083"
  );

  const handleChangeAmount = e => {
    setAmount(e.target.value);
  };

  const handleCardValue = e => {
    setCardValue(e.target.value);
  };

  const handleCardTransfer = e => {
    setAmount("");
    setCardValue("")
    socket.emit("pay", { transferAmount: amountValue, card: cardValue });
  };

  return (
    <>
      {!login ? (
        <Login onChange={onChange} login={login} logout={Logout} />
      ) : (
        <div className="shop-container">
          <Logout logout={logout}/>
          <AccountBalance information={information} accountBallance={accountBallance} />
          <h1>Przelew kartą</h1>
          <div className="shop-box">
            <input
              className="shop-input"
              type="text"
              placeholder="Wpisz kwotę"
              value={amountValue}
              onChange={handleChangeAmount}
            />            
          <input
            className="account-input"
            type="text"
            placeholder="Wpisz numer karty"
            value={cardValue}
            onChange={handleCardValue}
          />
            <Button click={handleCardTransfer}>Przelej</Button>
          </div>
          {accountBallance ? (
            <History history={accountBallance} />
          ) : null}
        </div>
      )}{" "}
    </>
  );
};

export default Shop;
