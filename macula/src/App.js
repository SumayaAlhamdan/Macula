// App.js
import React from "react";
import MainTabs from "./MainTabs";
import logo from './logo.svg';
import './App.css';
import eyeLogo from './assets/112.png';
import BlackButton from "./components/BlackButton";
import OrangeButton from "./components/OrangeButton";
import WhiteButton from "./components/WhiteButton";
import SmallText from "./components/SmallText";


const App = () => {
  return (
    <div>
      {/* <MainTabs /> */}
    <div className="App">
      <header className="App-header">
        <h1>HELLO MACULA</h1>
        <img className="Eye-logo" src={eyeLogo}></img>
        <BlackButton text="Sign in"/>
        <OrangeButton text="hello"/>
        <WhiteButton text="hiii"/>
        <SmallText text="Welcome Rema"/>
      </header>
    
    </div>
    </div>
    
  );
};

export default App;

