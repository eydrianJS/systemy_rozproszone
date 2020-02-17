import React, { useState } from "react";
import "./bank.css";
import Login from "./../../components/login/login";
import useLoginEmmiter from '../../emmiters/loginEmmiter.js';
import AccountBalance from './../../components/accountBalance/accountBalance';


const Bank = ({ accountBalance }) => {
  const [amountValue, setAmountValue] = useState("");
  const { login, onChange, Logout, information, socket } = useLoginEmmiter("8085");

  const handleChangeAmount = e => {
    setAmountValue(e.target.value);
  };

  const handlePayment = e => {
    socket.emit("deposit", {transferAmount: amountValue});
  }
  const handleWithdrawal = e => {
    socket.emit("withdrawal", {transferAmount: amountValue});
  }

  return (
    <>
      {!login ? (
        <Login onChange={onChange} login={login} logout={Logout} />
      ) : (
        <div className="bank-container">
          <AccountBalance information={information}/>
          <h1 className="bank-title">Wypłać/Wpłać środki na swoje konto</h1>
          <input
            className="bank-input"
            type="text"
            placeholder="Wpisz kwotę"
            value={amountValue}
            onChange={handleChangeAmount}
          />
          <div className="bank-button-container">
            <button className="bank-button" onClick={e => handlePayment(e)} >Wpłać</button>
            <button className="bank-button" onClick={e => handleWithdrawal(e)}>Wypłać</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Bank;
