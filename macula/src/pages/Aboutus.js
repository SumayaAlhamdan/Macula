import React, { useEffect } from "react";
import { TweenMax, Power2 } from "gsap"; // Import TweenMax and Power2 from gsap library
import "../css/Onboarding.css";
import BlackButton from "../components/BlackButton";
import { Link } from "react-router-dom";

const Aboutus = () => {
  useEffect(() => {
    // Perform animations after component is mounted
    TweenMax.to(".circle-top", 20, { attr: { cx: 50, cy: -50 }, scale: 1, yoyo: true, repeat: -1, ease: Power2.ease });
    TweenMax.to(".circle-bottom", 20, { attr: { cx: 260, cy: 300 }, scale: 1.1, yoyo: true, repeat: -1, ease: Power2.ease });
  }, []); // Empty dependency array ensures the effect runs only once after mount

  return (
      <div className="background-circles background-circles--blue background-circles--animated">
        
        <div className="titleOut">
  ABOUT US 
  <div className="titleIn"> 
    MACULA is an innovative system developed to enhance classroom engagement. Using cutting-edge facial recognition technology, Macula revolutionizes the educator-student interaction, making attendance tracking, engagement assessment, and feedback mechanisms more efficient than ever before. We've even incorporated gamification elements to create a fun and rewarding learning environment. Our approach aligns seamlessly with the latest research in education, ensuring that educators have the tools they need to inspire and motivate their students.
  </div>
</div>

         <Link to="/Onboarding" className="Main">Main</Link> <Link to="/Aboutus" className="Aboutus">About Us</Link> <Link to="/Features" className="Features">Features </Link> <Link to="/login" className="LoginOnboarding">Login</Link>
        <svg height="100%" width="100%" version="1.1" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <circle className="circle-top" cx="90px" cy="-50px" r="200" fill="#ffffff" />
          <circle className="circle-bottom" opacity="0.7" cx="250px" cy="300px" r="250" fill="#ffd51e" />
        
        </svg>
        
        
      
      </div>
  );
}

export default Aboutus;

