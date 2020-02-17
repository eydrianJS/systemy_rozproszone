import React from 'react';
import './nav.css';
import { ReactComponent as BankLogo } from '../../assets/images/gold-ingots.svg';
import { NavLink } from 'react-router-dom';

const Nav = ({logout, login}) => {
    console.log(login)

    return (
        <nav className="navigation">
            <div className="bank">
                <span className="bank-logo"><BankLogo/></span>
                <span className="title"><NavLink to="/bank">Bank</NavLink></span>
            </div>
            <div className="shop">
                <NavLink to="/shop">Sklep</NavLink>
            </div>
            <div className="account">
                <NavLink to="/account">Konto</NavLink>
            </div>
            {login && <div className="logout">
                <button className="login-button" onClick={logout}>Wyloguj</button>
            </div>}
        </nav>
    )
}

export default Nav;