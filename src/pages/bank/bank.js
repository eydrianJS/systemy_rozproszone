import React from 'react';
import './bank.css';  

const Bank = ({accountBalance}) => {
    return(
        <div className="bank-container"> 
            <div >
            <h1>Twój stan konta: {accountBalance}</h1>
            <input className="bank-input" type="text" placeholder="Wpisz kwotę"/>
            <button className="bank-button">Wpłać</button>
            <button className="bank-button">Wypłać</button>
            </div>
            
        </div>
    )
}

export default Bank;