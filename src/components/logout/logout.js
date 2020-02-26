import React from "react";
import "./logout";

const Logout = ({logout}) => (
    <button  type="submit" onClick={logout} className="login-button" >
      WYLOGUJ
    </button>
);

export default Logout;
