
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// pages & components
import Home from './pages/Home'
import Login from './pages/login'
import Navbar from './components/Navbar'
import Meeting from './scheduleMeeting'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route 
              path="/"
              element={<Home />}
            />
              <Route 
              path="/home"
              element={<Home />}
            />
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route 
              path="/scheduleMeeting" 
              element={<Meeting />} 
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;













