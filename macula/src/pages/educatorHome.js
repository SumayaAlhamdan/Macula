import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const EducatorHome = () => {
  return (
    <div className="educator-home">
      {/* Add educator-specific content here */}
      <Link to="/eviewcourse">
        <button>Go to Eviewcourse Page</button>
      </Link>
      <h2>Welcome, Educator!</h2>
      
    </div>
  );
};

export default EducatorHome;
