import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from React Router

const StudentHome = () => {
  return (
    <div className="student-home">
       <Link to="/sviewcourse">
        <button>Go to Sviewcourse Page</button>
      </Link>
      <h2>Welcome, Student!</h2>
      {/* Add student-specific content here */}
    </div>
  );
};

export default StudentHome;
