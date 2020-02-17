import React from 'react';
import './shop.css'

const Shop = (props) => {
    const array = [120, 140, 80, 72];    
    
    const transactions = array.map(val => (
        <li className="shop-list-item">{val} PLN</li>
    ))

    return (
            <div className="shop-container">
                <h1>Historia twoich transakcji:</h1>
                <ul className="shop-list">
                    {transactions}
                </ul>
            </div>
        )    
};

export default Shop;