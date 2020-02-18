import React from 'react';
import './button.css';

const button = ({children, click}) => (
        <button className="button" onClick={click}>{children}</button>    
    );

export default button;