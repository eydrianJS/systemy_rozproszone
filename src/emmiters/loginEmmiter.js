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

  const Logout = () => {
    setLogin(false);
  };

  useEffect(() => {
    socket = io.connect(`${api}:${port}/`);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("loginResponse", value => {
      if (value !== null) {
        setLogin(true);
        setInformation(value);
        console.log(value)
      }
    });
    socket.on("accountBallance", msg => {
      // setInformation(msg);
      
      console.log(msg);
      setAccountBallance(msg)
    });
  }, []);

  return { login, onChange, Logout, information, socket, accountBallance };
};

export default useDefaultEmmiter;
