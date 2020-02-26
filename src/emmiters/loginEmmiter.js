import { useEffect, useState } from "react";
import io from "socket.io-client";
import { postLogin } from "./../services/services";
import api from "../config";
let socket;

const useDefaultEmmiter = port => {
  const [login, setLogin] = useState(false);
  const [information, setInformation] = useState({});
  const [accountBallance, setAccountBallance] = useState([]);
  const onChange = (e, value) => {
    e.preventDefault();
    postLogin(value, socket);
  };

  const logout = () => {
    setLogin(false);
  };

  useEffect(() => {
    socket = io.connect(`${api}:${port}/`);
    return () => {
      socket.disconnect();
    };
  }, [port]);

  useEffect(() => {
    socket.on("loginResponse", value => {
      if (value !== null) {
        setLogin(true);
        setInformation(value);
      }
    });

    socket.on("errorLogin", msg => {
      alert(msg)
    });
    socket.on("accountBallance", msg => { 
      msg.history.sort(function(x, y) {
        return y.date - x.date;
      }).reverse();
      setAccountBallance(msg);
    });
  }, []);

  return { login, onChange, logout, information, socket, accountBallance };
};

export default useDefaultEmmiter;
