import React, { useState } from 'react';
import './account.css'

const Account = () => {

    const [accountValue, setAccountValue] = useState('')

    const handleChangeAccount = (e) => {
        setAccountValue(e.target.value)
    }
    
    return (
        <div className="account-contanier">
            <h1>Dokonaj przelewu</h1>
            <input 
            className="account-input"
            type="text" 
            placeholder="Wpisz kwotę" 
            value={accountValue} 
            onChange={handleChangeAccount} 
            />
            <button className="account-button" onClick={() => {}}>Przelej</button>
        </div>
    )
}

export default Account