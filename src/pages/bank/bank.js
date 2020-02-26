import React, { useState } from "react";
import "./bank.css";
import Login from "./../../components/login/login";
import Logout from "./../../components/logout/logout"
import useLoginEmmiter from "../../emmiters/loginEmmiter.js";
import AccountBalance from "./../../components/accountBalance/accountBalance";
import History from "./../../components/historyTransaction/historyTransaction";

const Bank = ({ accountBalance }) => {
  const [amountValue, setAmountValue] = useState("");
  const { login, onChange, logout, information, socket, accountBallance } = useLoginEmmiter(
    "8085"
  );

  const handleChangeAmount = e => {
    setAmountValue(e.target.value);
  };

  const handlePayment = e => {
    socket.emit("deposit", { transferAmount: amountValue });
  };
  const handleWithdrawal = e => {
    socket.emit("withdrawal", { transferAmount: amountValue });
  };

  return (
    <>
      {!login ? (
        <Login onChange={onChange} login={login} logout={Logout} />
      ) : (
        <div>
          <Logout logout={logout}/>
          <AccountBalance information={information} accountBallance={accountBallance}/>
          <div className="bank-container">
            <h1 className="bank-title">Wypłać/Wpłać środki na swoje konto</h1>
            <input
              className="bank-input"
              type="text"
              placeholder="Wpisz kwotę"
              value={amountValue}
              onChange={handleChangeAmount}
            />
            <div className="bank-button-container">
              <button className="bank-button" onClick={e => handlePayment(e)}>
                Wpłać
              </button>
              <button
                className="bank-button"
                onClick={e => handleWithdrawal(e)}
              >
                Wypłać
              </button>
            </div>
          </div>
          {accountBallance ? (
            <History history={accountBallance} />
          ) : null}
        </div>
      )}
    </>
  );
};

export default Bank;
