import React, { useState } from 'react';
import './bank.css';  

const Bank = ({accountBalance}) => {
    
    const [amountValue, setAmountValue] = useState('')

    const handleChangeAmount = (e) => {
        setAmountValue(e.target.value)
    }
    
    console.log(amountValue);

    return(
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
                    <button className="bank-button">Wpłać</button>
                    <button className="bank-button">Wypłać</button>
                </div>
        </div>
    )
}

export default Bank;