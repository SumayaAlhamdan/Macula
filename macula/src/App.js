// App.js
import React from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import Eviewcourse from "./Eviewcourse";
import Home from "./Home";


export default function App(){
  return(
    <div>
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Eviewcourse" element={<Eviewcourse />} />

        </Routes>
      </Router>

    </div>
  )
}











       
  
