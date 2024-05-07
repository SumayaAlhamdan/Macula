import React, { useEffect } from "react";
import { TweenMax, Power2 } from "gsap"; // Import TweenMax and Power2 from gsap library
import "../css/Onboarding.css";
import BlackButton from "../components/BlackButton";
import { Link } from "react-router-dom";
import {FaAward , FaChalkboardTeacher , FaEye ,FaServer} from "react-icons/fa"


const Features = () => {
  useEffect(() => {
    // Perform animations after component is mounted
    TweenMax.to(".circle-top", 20, { attr: { cx: 50, cy: -50 }, scale: 1, yoyo: true, repeat: -1, ease: Power2.ease });
    TweenMax.to(".circle-bottom", 20, { attr: { cx: 260, cy: 300 }, scale: 1.1, yoyo: true, repeat: -1, ease: Power2.ease });
  }, []); // Empty dependency array ensures the effect runs only once after mount

  return (
    <div className="FeaturesPage">
      <div className="background-circles background-circles--blue background-circles--animated">
   
         <Link to="/Onboarding" className="Main">Main</Link> <Link to="/Aboutus" className="Aboutus">About Us</Link> <Link to="/Features" className="Features">Features </Link> <Link to="/login" className="LoginOnboarding">Login</Link>
        <svg height="100%" width="100%" version="1.1" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle-top" cx="90px" cy="-50px" r="200" fill="#ffffff" />
          <circle className="circle-bottom" opacity="0.7" cx="250px" cy="300px" r="250" fill="#ffd51e" />
        
        </svg>
      </div>
      <div className="FeaturesTitle">MACULA Features</div>
       <div className="FeatureCard1">  <div className="FeatureIcon"><FaChalkboardTeacher/></div><div className="CardTitle" >Automated Attendance</div></div>
       <div className="FeatureCard2"><div className="FeatureIcon"><FaEye/></div> <div className="CardTitle" >Real-time Engagment Monitoring</div></div>
       <div className="FeatureCard3"> <div className="FeatureIcon"><FaAward/></div> <div className="CardTitle" >Gamification</div> </div>
       <div className="FeatureCard4"> <div className="FeatureIcon"><FaServer/></div> <div className="CardTitle" >Real-time Feedback</div></div>  </div>
  );
}

export default Features;

