import React, { useEffect } from "react";
import Navigation from './components/nav/nav';
import './App.css';
import Login from './components/login/login';



function App() {

  useEffect(() => {
    fetch('http://10.1.3.235:8081/balanceAccount', {
      username: '123456'
    }).then((res) => console.log(res.json()))
  })

  return (
    <div className="App">
      <Navigation/>
      <Login />
    </div>
  );
}

export default App;
