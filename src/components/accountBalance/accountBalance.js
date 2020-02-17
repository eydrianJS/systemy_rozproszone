import React from 'react';
import './accountBalance.css'

const accountBalance = (props) => (
        <div className="accountBalance-container">
            <div className="account-name">
                <h2>Jan Kowalski</h2>
            </div>
            <div className="account-number">
                <p>Numer twojego konta: </p>
                <h2>48 1082 5132 0000 1202 4134 3904</h2>
            </div>
            <div className="account-currentBalance">
                <p>Dostępne środki</p>
                <h2>1000 PLN</h2>
            </div>
        </div>    
    );

export default accountBalance;
