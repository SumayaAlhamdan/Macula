import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login'; // PascalCase for component name
import Navbar from './components/Navbar';
import StudentHome from './pages/studentHome'; // PascalCase for component name
import EducatorHome from './pages/educatorHome'; // PascalCase for component name
import Courses from './pages/Courses';
import Profile from './pages/profile';
import Classrooms from './pages/Eclassrooms';
import SClassrooms from './pages/Sclassrooms';
// App.js
import React from "react";
import Eviewcourse from "./Eviewcourse";
import Sviewcourse from "./Sviewcourse";
import MainTabs from "./MainTabs";
import logo from './logo.svg';
import './App.css';
import eyeLogo from './assets/112.png';
import BlackButton from "./components/BlackButton";
import OrangeButton from "./components/OrangeButton";
import WhiteButton from "./components/WhiteButton";
import SmallText from "./components/SmallText";
import FaceDetectionComponent from "./FaceDetectionComponent";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Eviewcourse" element={<Eviewcourse />} />
          <Route path="/Sviewcourse" element={<Sviewcourse />} />
          <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-home" element={<StudentHome />} />
            <Route path="/educator-home" element={<EducatorHome />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Eclassrooms/:courseCode" element={<Classrooms />} />
            <Route path="/Sclassrooms/:courseCode" element={<SClassrooms />} />


          {/* <MainTabs /> */}

         {/* <header className="App-header"> */}
            {/* <h1>HELLO MACULA</h1>
            <img className="Eye-logo" src={eyeLogo}></img>
            <FaceDetectionComponent />
            <BlackButton text="Sign in" />
            <OrangeButton text="hello" />
            <WhiteButton text="hiii" />
            <SmallText text="Welcome Rema" /> */}
          {/* </header> */}





        </Routes>
      </Router>
    </div>
  );
}

export default App;













