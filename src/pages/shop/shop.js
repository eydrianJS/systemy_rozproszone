import React, { useState } from "react";
import "./shop.css";
import Button from '../../components/UI/button';
import Login from "./../../components/login/login";
import useLoginEmmiter from "../../emmiters/loginEmmiter.js";
import AccountBalance from "./../../components/accountBalance/accountBalance";
import History from '../../components/historyTransaction/historyTransaction';

let currentDate = new Date();
let formattedDate = currentDate.getDate() + '-' + currentDate.getMonth() + '-' + currentDate.getFullYear();

const Shop = props => {
  const [amountValue, setAmount] = useState('');
  const [historyTransaction, setHistoryTransaction] = useState([]);
  const { login, onChange, Logout, information, socket } = useLoginEmmiter("8083");
  


  // const transactions = array.map(val => (
  //   <li className="shop-list-item">{val} PLN</li>
  // ));

  const ID = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  const handleChangeAmount = e => {
    setAmount(e.target.value);
  }

  const handleCardTransfer = e => {
      setHistoryTransaction(historyTransaction.concat({id: ID(), date: formattedDate, cardNumber: information.cardNumber, type: 'Płatność kartą', ammount: amountValue, accountBalance: information.accountBalance}))
      // socket.emit('deposit', {transferAmount: amountValue});
  }


  return (
    <>
      {!login ? (
        <Login onChange={onChange} login={login} logout={Logout} />
      ) : (
        <div className="shop-container">
          <AccountBalance information={information} />
          <h1>Przelew kartą</h1>
          <div className="shop-box">
            <input
              className="shop-input"
              type="text"
              placeholder="Wpisz kwotę"
              value={amountValue}
              onChange={handleChangeAmount}
            />
            <Button click={handleCardTransfer}>Przelej</Button>
          </div>
            <History history={historyTransaction}/>
        </div>
      )}{" "}
    </>
  );
};

export default Shop;
