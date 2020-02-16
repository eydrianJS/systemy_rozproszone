import React, { useEffect, useState } from "react";
import Navigation from './components/nav/nav';
import './App.css';
import Login from './components/login/login';



function App() {

  // useEffect(() => {
  //   fetch('http://10.1.3.235:8081/balanceAccount', {
  //     method: 'POST',
  //     mode: 'cors',
  //     body: JSON.stringify({
  //       username: '123456'
  //     }),
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then((res) => res.json())
  //   .then(res => console.log(res));
  // })
  const [login, setLogin] = useState(false);

  const onChange = (e, value) => {
    e.preventDefault();
    fetch('http://10.1.3.235:8081/login', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        username: value,
        password: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      if (res.status == 200) {
        return res.json()
      } else {
        alert("User doesn't exist");
        return {};
      }
    })
      .then(res => {
        if(res.message == "Login ok") {
          setLogin(true);
        }
      });
  }

  const Logout = () => {
    setLogin(false)
  }

  return (
    <div className="App">
      <Login onChange={onChange} login={login} logout={Logout}/>
      <Navigation />
    </div>
  );
}

export default App;
