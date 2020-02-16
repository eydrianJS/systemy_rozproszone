import React from 'react';
import './login.css'

const Login = () => {
    return (
        <div className="login">
            <h1 className="login-title">Zaloguj się</h1>
            <input className="login-input" type="text" placeholder="Wpisz numer klienta lub login"/>
            <button className="login-button" type="submit">Dalej</button>
        </div>
    )
}

export default Login;