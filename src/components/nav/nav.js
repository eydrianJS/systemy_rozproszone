import React from 'react';
import './nav.css';
import { ReactComponent as BankLogo } from '../../assets/images/gold-ingots.svg';

const Nav = () => {
    return (
        <nav className="navigation">
            <div className="bank">
                <span className="bank-logo"><BankLogo/></span>
                <span className="title"><a href="/bank">Bank</a></span>
            </div>
            <div className="shop">
                <a href="/shop">Sklep</a>
            </div>
            <div className="account">
                <a href="/account">Konto</a>
            </div>
        </nav>
    )
}

export default Nav;