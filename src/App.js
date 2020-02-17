import React from "react";
import Navigation from "./components/nav/nav";
import "./App.css";
import { Route } from "react-router-dom";
import Bank from "./pages/bank/bank";
import Shop from "./pages/shop/shop";
import Account from './pages/account/account';


function App() {
  
  return (
    <div className="App">
          <Navigation />
          <Route path="/bank" render={() => <Bank />} />
          <Route path="/shop" component={Shop} />
          <Route path="/account" component={Account} />
    </div>
  );
}

export default App;
