import React from 'react';
import './button.css';

const button = ({children, click, type}) => (
        <button type={type} className="button" onClick={click}>{children}</button>    
    );

export default button;