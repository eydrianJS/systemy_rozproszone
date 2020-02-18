import { useEffect, useState } from "react";
import io from "socket.io-client";
import { postLogin } from "./../services/services";
import api from "../config"
let socket;

const useDefaultEmmiter = (port) => {
  const [login, setLogin] = useState(false);
  const [information, setInformation] = useState({})

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
      if (value.length > 0) {
        setLogin(true);
        setInformation(value[0]);
      }
    });
    socket.on("accountBallance", (msg) => {
      setInformation(msg)
    })
  }, []);

  return { login, onChange, Logout, information, socket };
};

export default useDefaultEmmiter;