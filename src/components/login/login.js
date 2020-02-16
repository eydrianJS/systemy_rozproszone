import React, { useState } from 'react';
import './login.css'

const Login = ({onChange,logout,  login}) => {
    
    const [value, setValue] = useState('');
    
    const handleChange = (event) => {
        setValue(event.target.value);
    }

    return (   
        login?
        <button className="login-button" type="submit" onClick={logout}>Loguot</button>:   
        <form className="login" onSubmit={(e) =>onChange(e, value)}>
            <h1 className="login-title">Zaloguj się</h1>
            <input className="login-input" type="text" placeholder="Wpisz numer klienta lub login" value={value}  onChange={handleChange}/>
            <button className="login-button" type="submit">Dalej</button>
        </form>
    )
}

export default Login;