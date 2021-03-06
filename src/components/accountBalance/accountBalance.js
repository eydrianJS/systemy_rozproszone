import React from "react";
import "./accountBalance.css";

const accountBalance = ({ information, accountBallance }) => {
  return (
    <div className="accountBalance-container">
      <div className="account-name">
        <h2>
          {information.name} {information.surname}
        </h2>
      </div>
      <div className="account-number">
        <p>Numer twojego konta: </p>
        <h2>{information.accountNumber}</h2>
      </div>
      <div className="account-currentBalance">
        <p>Dostępne środki</p>
        <h2>{accountBallance.accountBalance} PLN</h2>
      </div>
    </div>
  );
};

export default accountBalance;
