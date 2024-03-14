
// // Eviewcourse.js
import React, { useState, useEffect } from "react";
import axios from 'axios';
import BlackButton from "./components/BlackButton";
import OrangeButton from "./components/OrangeButton";
import WhiteButton from "./components/WhiteButton";
import Popup from "./components/popup";
import "./Eviewcourse.css"; // Import CSS stylesheet
import "./index.css"; // Import CSS stylesheet
import { FaCalendarAlt } from 'react-icons/fa'; // Import the calendar icon from Font Awesome


const Eviewcourse = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));


  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
        const response = await axios.get('http://localhost:4000/api/courses');
        const courses = response.data.message;
        setFetchedCourses(courses);
        console.log("Fetched courses:", courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
  }

  const handleCreateCourse = async () => {
    try {
      if (!courseCode || !courseTitle) {
        setErrorMessage('Please fill in all fields.');
        return;
      }
      const isCourseExists = fetchedCourses.some(course => course.code === courseCode);
    
      if (isCourseExists) {
        setErrorMessage('Course already exists.');
        return;
      }
      console.log(`course code is ${courseCode}`);
      const response = await axios.post('http://localhost:4000/api/courses', {
        title: courseTitle,
        code: courseCode,
        status: 'active', 
        educatorID: user.educator.ID,
      });

      console.log('Course created successfully:', response.data);
      await fetchCourses();
      setCourseTitle('');
      setCourseCode('');
      setErrorMessage('');
      setButtonPopup(false);
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const handleInputChangetitle = (e) => {
    setCourseTitle(e.target.value);
  };
  const handleInputChangecode = (e) => {
    setCourseCode(e.target.value);
  };
console.log(user.educator.ID);
  return (
    <div>
      <div className="Eviewcourse">
        <header className="Eviewcourse-header">
          <h2 className="courses-title">    <FaCalendarAlt className="calendar-icon" /> Courses
          </h2>
          <div className="courses-container">
            {/* Apply courses-container class */}
            {fetchedCourses.map((course, index) =>
              course.educatorID === user.educator.ID ? (
                <div key={course._id} className="course-box">
                  {/* Apply course-box class */}
                  <p>{course.code} : {course.title}</p>
                  {index !== fetchedCourses.length - 1 && <hr />}
                  {/* Render horizontal line only if it's not the last course */}
                </div>
              ) : null
            )}
          </div>

          <BlackButton className="create-course-button" onClick={() => setButtonPopup(true)} text="Create course"/>
          
          {/* create course pop up */}
          <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
            <h3>Create course</h3>
            <div className="form-container">
              <label htmlFor="cCode">Course Code:</label>
              <input
                id="cCode"
                type="text"
                value={courseCode}
                onChange={handleInputChangecode}
                placeholder="Enter course code"
                required
              />
              <label htmlFor="cTitle">Course Title:</label>
              <input
                id="cTitle"
                type="text"
                value={courseTitle}
                onChange={handleInputChangetitle}
                placeholder="Enter course name"
                required
              />
              {errorMessage && <p className="error-message">{errorMessage}</p>}

            </div>
            <div className='buttons-container'>
              <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)}/>
              <OrangeButton text="Create" onClick={handleCreateCourse} />
            </div>
          </Popup>
        </header>
      </div>
    </div>
  );
};

export default Eviewcourse;
// Eviewcourse.js
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';  // Import useLocation hook
// import BlackButton from "./components/BlackButton";
// import OrangeButton from "./components/OrangeButton";
// import WhiteButton from "./components/WhiteButton";
// import Popup from "./components/popup";
// import "./Eviewcourse.css"; // Import CSS stylesheet
// import "./index.css"; // Import CSS stylesheet
// import { FaCalendarAlt } from 'react-icons/fa'; // Import the calendar icon from Font Awesome


// const Eviewcourse = () => {
//   const [buttonPopup, setButtonPopup] = useState(false);
//   const [courseTitle, setCourseTitle] = useState('');
//   const [courseCode, setCourseCode] = useState('');
//   const [fetchedCourses, setFetchedCourses] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const location = useLocation();  // Get location from React Router

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   async function fetchCourses() {
//     try {
//       const response = await axios.get('http://localhost:4000/api/courses');
//       setFetchedCourses(response.data.message);
//     } catch (error) {
//       console.error('Error fetching courses:', error);
//     }
//   }

//   const handleCreateCourse = async () => {
//     try {
//       if (!courseCode || !courseTitle) {
//         setErrorMessage('Please fill in all fields.');
//         return;
//       }

//       const isCourseExists = fetchedCourses.some(course => course.code === courseCode);

//       if (isCourseExists) {
//         setErrorMessage('Course already exists.');
//         return;
//       }

//       console.log(`course code is ${courseCode}`);
//       const response = await axios.post('http://localhost:4000/api/courses', {
//         title: courseTitle,
//         code: courseCode,
//         status: 'active',
//         educatorID: 'someEducatorID',
//       });

//       console.log('Course created successfully:', response.data);
//       await fetchCourses();
//       setCourseTitle('');
//       setCourseCode('');
//       setErrorMessage('');
//       setButtonPopup(false);
//     } catch (error) {
//       console.error('Error creating course:', error);
//     }
//   };

//   const handleInputChangetitle = (e) => {
//     setCourseTitle(e.target.value);
//   };

//   const handleInputChangecode = (e) => {
//     setCourseCode(e.target.value);
//   };

//   // Access user data from location state
//   console.log('Location State:', location.state);
//   const userData = location.state && location.state.userID;
//   console.log(`USER DATA IS ${userData}`);

//   return (
//     <div className="Eviewcourse">
//       <header className="Eviewcourse-header">
//         <h2 className="courses-title">
//           <FaCalendarAlt className="calendar-icon" /> Courses
//         </h2>
//         <div className="courses-container">
//           {fetchedCourses
//             .filter((course) => course.educatorID === 'edu1')
//             .map((course, index) => (
//               <div key={course._id} className="course-box">
//                 <p>{course.code} : {course.title}</p>
//                 {index !== fetchedCourses.length - 1 && <hr />}
//               </div>
//             ))}
//         </div>

//         <BlackButton
//           className="create-course-button"
//           onClick={() => setButtonPopup(true)}
//           text="Create course"
//         />

//         <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
//           <h3>Create course</h3>
//           <div className="form-container">
//             <label htmlFor="cCode">Course Code:</label>
//             <input
//               id="cCode"
//               type="text"
//               value={courseCode}
//               onChange={handleInputChangecode}
//               placeholder="Enter course code"
//               required
//             />
//             <label htmlFor="cTitle">Course Title:</label>
//             <input
//               id="cTitle"
//               type="text"
//               value={courseTitle}
//               onChange={handleInputChangetitle}
//               placeholder="Enter course name"
//               required
//             />
//             {errorMessage && <p className="error-message">{errorMessage}</p>}
//           </div>
//           <div className='buttons-container'>
//             <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)} />
//             <OrangeButton text="Create" onClick={handleCreateCourse} />
//           </div>
//         </Popup>
//       </header>
//     </div>
//   );
// };

// export default Eviewcourse;

