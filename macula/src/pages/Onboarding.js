import React, { useEffect } from "react";
import { TweenMax, Power2 } from "gsap"; // Import TweenMax and Power2 from gsap library
import "../css/Onboarding.css";
import BlackButton from "../components/BlackButton";
import { Link } from "react-router-dom";

const Onboarding = () => {
  useEffect(() => {
    // Perform animations after component is mounted
    TweenMax.to(".circle-top", 20, { attr: { cx: 50, cy: -50 }, scale: 1, yoyo: true, repeat: -1, ease: Power2.ease });
    TweenMax.to(".circle-bottom", 20, { attr: { cx: 260, cy: 300 }, scale: 1.1, yoyo: true, repeat: -1, ease: Power2.ease });
  }, []); // Empty dependency array ensures the effect runs only once after mount

  return (
      <div className="background-circles background-circles--blue background-circles--animated">
        
        <div className="slogan"> <div className="sloganIn">For more efficent, engaging, and enjoyable classrooms!</div>
        <p></p><Link to="/login">
          <BlackButton text="Login" />
        </Link>
        <p className="AdminLogin">Login as an Admin</p>
         </div>
         <Link to="/Onboarding" className="Main">Main</Link> <span className="Aboutus">About Us</span> <span className="Features">Features</span> <Link to="/login" className="LoginOnboarding">Login</Link>
        <svg height="100%" width="100%" version="1.1" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle-top" cx="90px" cy="-50px" r="200" fill="#ffffff" />
          <circle className="circle-bottom" opacity="0.7" cx="250px" cy="300px" r="250" fill="#ffd51e" />
        
        </svg>
        
        <img className="Logo" src={require('../assets/7.png')} alt="Macula Logo" />
        <div className="ojo">
          <div className="pupila"></div>
      </div>
      
      </div>
  );
}

export default Onboarding;

