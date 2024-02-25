// App.js
import React from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Eviewcourse from "./Eviewcourse";
import Home from "./Home";
import MainTabs from "./MainTabs";
import logo from './logo.svg';
import './App.css';
import eyeLogo from './assets/112.png';
import BlackButton from "./components/BlackButton";
import OrangeButton from "./components/OrangeButton";
import WhiteButton from "./components/WhiteButton";
import SmallText from "./components/SmallText";
import FaceDetectionComponent from "./FaceDetectionComponent";


export default function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Eviewcourse" element={<Eviewcourse />} />
          {/* <MainTabs /> */}

          <header className="App-header">
            <h1>HELLO MACULA</h1>
            <img className="Eye-logo" src={eyeLogo}></img>
            <FaceDetectionComponent />
            <BlackButton text="Sign in" />
            <OrangeButton text="hello" />
            <WhiteButton text="hiii" />
            <SmallText text="Welcome Rema" />
          </header>





        </Routes>
      </Router>

    </div>
  );
}













