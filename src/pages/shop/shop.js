import React from "react";
import "./shop.css";
import Login from "./../../components/login/login";
import useLoginEmmiter from "../../emmiters/loginEmmiter.js";
import AccountBalance from "./../../components/accountBalance/accountBalance";

const Shop = props => {
  const array = [120, 140, 80, 72];
  const { login, onChange, Logout, information, socket } = useLoginEmmiter("8083");

  const transactions = array.map(val => (
    <li className="shop-list-item">{val} PLN</li>
  ));

  return (
    <>
      {!login ? (
        <Login onChange={onChange} login={login} logout={Logout} />
      ) : (
        <div className="shop-container">
          <AccountBalance information={information} />
          <h1>Historia twoich transakcji:</h1>
          <ul className="shop-list">{transactions}</ul>
        </div>
      )}{" "}
    </>
  );
};

export default Shop;
