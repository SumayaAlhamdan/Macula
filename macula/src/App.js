// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './pages/layout'; // Import your Layout component
import Home from './pages/Home';
import Login from './pages/login';
import StudentHome from './pages/studentHome';
import EducatorHome from './pages/educatorHome';
import Courses from './pages/Courses';
import Profile from './pages/profile';
import Classrooms from './pages/Eclassrooms';
import SClassrooms from './pages/Sclassrooms';
import Eviewcourse from "./Eviewcourse";
import Sviewcourse from "./Sviewcourse";
import ViewEngage from "./pages/ViewEngage";
import Onboarding from "./pages/Onboarding";
function App() {
  return (
    <div className="App">
      <Router>
        <Layout> {/* Use your Layout component */}
          <Routes>
            {/* Define your routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-home" element={<StudentHome />} />
            <Route path="/educator-home" element={<EducatorHome />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/Eclassrooms/:courseCode" element={<Classrooms />} />
            <Route path="/Sclassrooms/:courseCode" element={<SClassrooms />} />
            <Route path="/Eviewcourse" element={<Eviewcourse />} />
            <Route path="/Sviewcourse" element={<Sviewcourse />} />
            <Route path="/ViewEngage" element={<ViewEngage />} />

          </Routes>
        </Layout>
        <Routes>
        <Route path="/Onboarding" element={<Onboarding />} />

        </Routes>
      </Router>
    </div>
  );
}

export default App;













