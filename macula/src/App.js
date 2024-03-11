import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/login'; // PascalCase for component name
import Navbar from './components/Navbar';
import StudentHome from './pages/studentHome'; // PascalCase for component name
import EducatorHome from './pages/educatorHome'; // PascalCase for component name
import Courses from './pages/Courses';
import Profile from './pages/profile';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student-home" element={<StudentHome />} />
            <Route path="/educator-home" element={<EducatorHome />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/profile" element={<Profile />} />

          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;













