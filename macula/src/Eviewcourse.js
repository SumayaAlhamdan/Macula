// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import BlackButton from "./components/BlackButton";
// import OrangeButton from "./components/OrangeButton";
// import WhiteButton from "./components/WhiteButton";
// import Popup from "./components/popup";
// import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa'; // Import icons from Font Awesome
// import { useNavigate } from 'react-router-dom';
// import "./viewcourse.css";

// const Eviewcourse = () => {
//   const [buttonPopup, setButtonPopup] = useState(false);
//   const [courseTitle, setCourseTitle] = useState('');
//   const [courseCode, setCourseCode] = useState('');
//   const [fetchedCourses, setFetchedCourses] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [codeError, setCodeError] = useState('');
//   const [titleError, setTitleError] = useState('');
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   async function fetchCourses() {
//     try {
//         const response = await axios.get('http://localhost:4000/api/courses');
//         const courses = response.data.message;
//         setFetchedCourses(courses);
//         console.log("Fetched courses:", courses);
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//     }
//   }

//   const handleInputChangecode = (e) => {
//     setCourseCode(e.target.value);
//     setCodeError(''); // Clear code error when the input changes
//   };
  
//   const handleInputChangetitle = (e) => {
//     setCourseTitle(e.target.value);
//     setTitleError(''); // Clear title error when the input changes
//   };
  
//   const handleCreateCourse = async () => {
//     try {
//       // Clear all errors when creating a course
//       setCodeError('');
//       setTitleError('');
//       setErrorMessage('');

//       // Check if course code follows the requirements

//       if (!courseCode || !courseTitle) {
//         setErrorMessage('Please fill in all fields.');
//         return;}
      
//       const trimmedcode = courseCode.replace(/\s/g, '');
//       const trimmedtitle = courseTitle.replace(/\s/g, '');
      
//       if (!/^[a-zA-Z0-9]{5,8}$/.test(trimmedcode)) {
//         setCodeError(
//             <div>
//                 Course code must be:<br />
//                 - 5 to 8 characters long<br />
//                 - Only letters and numbers
//             </div>
//         );
//         return;
//     }
    
//     // Check if course title follows the requirements
//     if (!/^[a-zA-Z0-9\s]{1,50}$/.test(trimmedtitle)) {
//         setTitleError(
//             <div>
//                 Course title must be:<br />
//                 - 1 to 50 characters long<br />
//                 - Only letters and numbers
//             </div>
//         );
//         return;
//     }
    
    
  
    

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
//         educatorID: user.educator.ID,
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

//   const handleNavigateToClassrooms = (courseCode) => {
//     // Navigate to the classrooms page and send the course code as a parameter
//     navigate(`/Eclassrooms/${courseCode}`);
//   };

//   return (
//     <div>
//       <div className="Eviewcourse">
//         <header className="Eviewcourse-header">
//           <h2 className="courses-title">    <FaCalendarAlt className="calendar-icon" /> Courses
//           </h2>
//           <div className="courses-container">
//             {/* Apply courses-container class */}
//             {fetchedCourses.map((course, index) =>
//               course.educatorID === user.educator.ID ? (
//                 <div key={course._id} className="course-box">
//                   {/* Apply course-box class */}
//                   <p>
//                     {course.code} : {course.title}
//                     <FaArrowRight
//                       className="arrow-icon"
//                       onClick={() => handleNavigateToClassrooms(course.code)}
//                     />
//                   </p>
//                   {index !== fetchedCourses.length - 1 && <hr />}
//                   {/* Render horizontal line only if it's not the last course */}
//                 </div>
//               ) : null
//             )}
//           </div>

//           <BlackButton className="create-course-button" onClick={() => setButtonPopup(true)} text="Create course"/>
          
//           {/* create course pop up */}
//           <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
//             <h3>Create course</h3>
//             <div className="form-container">
//               <label htmlFor="cCode">Course Code:</label>
//               <input
//                 id="cCode"
//                 type="text"
//                 value={courseCode}
//                 onChange={handleInputChangecode}
//                 placeholder="Enter course code"
//                 required
//               />
//               {codeError && <p className="error-message">{codeError}</p>}
//               <label htmlFor="cTitle">Course Title:</label>
//               <input
//                 id="cTitle"
//                 type="text"
//                 value={courseTitle}
//                 onChange={handleInputChangetitle}
//                 placeholder="Enter course name"
//                 required
//               />
//               {titleError && <p className="error-message">{titleError}</p>}
//               {errorMessage && <p className="error-message">{errorMessage}</p>}

//             </div>
//             <div className='buttons-container'>
//               <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)}/>
//               <OrangeButton text="Create" onClick={handleCreateCourse} />
//             </div>
//           </Popup>
//         </header>
//       </div>
//     </div>
//   );
// };

// export default Eviewcourse;

// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import BlackButton from "./components/BlackButton";
// import OrangeButton from "./components/OrangeButton";
// import WhiteButton from "./components/WhiteButton";
// import Popup from "./components/popup";
// import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa'; // Import icons from Font Awesome
// import { useNavigate } from 'react-router-dom';
// import "./educatorHome.css"; // Adjusted CSS import

// const Eviewcourse = () => {
//   const [buttonPopup, setButtonPopup] = useState(false);
//   const [courseTitle, setCourseTitle] = useState('');
//   const [courseCode, setCourseCode] = useState('');
//   const [fetchedCourses, setFetchedCourses] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');
//   const [codeError, setCodeError] = useState('');
//   const [titleError, setTitleError] = useState('');
//   const user = JSON.parse(localStorage.getItem('user'));
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchCourses();
//   }, []);

//   async function fetchCourses() {
//     try {
//         const response = await axios.get('http://localhost:4000/api/courses');
//         const courses = response.data.message;
//         setFetchedCourses(courses);
//         console.log("Fetched courses:", courses);
//     } catch (error) {
//         console.error('Error fetching courses:', error);
//     }
//   }

//   const handleInputChangecode = (e) => {
//     setCourseCode(e.target.value);
//     setCodeError(''); // Clear code error when the input changes
//   };
  
//   const handleInputChangetitle = (e) => {
//     setCourseTitle(e.target.value);
//     setTitleError(''); // Clear title error when the input changes
//   };
  
//   const handleCreateCourse = async () => {
//     try {
//       // Clear all errors when creating a course
//       setCodeError('');
//       setTitleError('');
//       setErrorMessage('');

//       // Check if course code follows the requirements

//       if (!courseCode || !courseTitle) {
//         setErrorMessage('Please fill in all fields.');
//         return;}
      
//       const trimmedcode = courseCode.replace(/\s/g, '');
//       const trimmedtitle = courseTitle.replace(/\s/g, '');
      
//       if (!/^[a-zA-Z0-9]{5,8}$/.test(trimmedcode)) {
//         setCodeError(
//             <div>
//                 Course code must be:<br />
//                 - 5 to 8 characters long<br />
//                 - Only letters and numbers
//             </div>
//         );
//         return;
//     }
    
//     // Check if course title follows the requirements
//     if (!/^[a-zA-Z0-9\s]{1,50}$/.test(trimmedtitle)) {
//         setTitleError(
//             <div>
//                 Course title must be:<br />
//                 - 1 to 50 characters long<br />
//                 - Only letters and numbers
//             </div>
//         );
//         return;
//     }
    
    
  
    

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
//         educatorID: user.educator.ID,
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

//   const handleNavigateToClassrooms = (courseCode) => {
//     // Navigate to the classrooms page and send the course code as a parameter
//     navigate(`/Eclassrooms/${courseCode}`);
//   };
//   // Eviewcourse component
//   return (
//     <div className="educator-home"> {/* Apply the educator-home class */}
//       <div className="upcoming-classes-container">
//         <div className="centered-content"> {/* Apply the centered-content class */}
//           <div className="courses-wrapper"> {/* New wrapper div */}
//             <h3 className='h3'><FaCalendarAlt className='calendar-icon' /> Courses</h3> {/* Adjusted icon class */}
//             <div className="courses-container"> {/* Apply courses-container class */}
//               {fetchedCourses.map((course, index) =>
//                 course.educatorID === user.educator.ID ? (
//                   <div key={course._id} className="course-box"> {/* Apply course-box class */}
//                     <p>
//                       {course.code} : {course.title}
//                       <FaArrowRight
//                         className="arrow-icon"
//                         onClick={() => handleNavigateToClassrooms(course.code)}
//                       />
//                     </p>
//                     {index !== fetchedCourses.length - 1 && <hr />} {/* Render horizontal line only if it's not the last course */}
//                   </div>
//                 ) : null
//               )}
//             </div>
//             {/* create course pop up */}
//             <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
//               <h3>Create course</h3>
//               <div className="form-container">
//                 <label htmlFor="cCode">Course Code:</label>
//                 <input
//                   id="cCode"
//                   type="text"
//                   value={courseCode}
//                   onChange={handleInputChangecode}
//                   placeholder="Enter course code"
//                   required
//                 />
//                 {codeError && <p className="error-message">{codeError}</p>}
//                 <label htmlFor="cTitle">Course Title:</label>
//                 <input
//                   id="cTitle"
//                   type="text"
//                   value={courseTitle}
//                   onChange={handleInputChangetitle}
//                   placeholder="Enter course name"
//                   required
//                 />
//                 {titleError && <p className="error-message">{titleError}</p>}
//                 {errorMessage && <p className="error-message">{errorMessage}</p>}
//               </div>
//               <div className='buttons-container'>
//                 <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)}/>
//                 <OrangeButton text="Create" onClick={handleCreateCourse} />
//               </div>
//             </Popup>
//           </div>
//           <BlackButton className="create-course-button" onClick={() => setButtonPopup(true)} text="Create course"/> {/* Adjusted button class */}
//         </div>
//       </div>
//     </div>
//   );
  
// };

// export default Eviewcourse;
import React, { useState, useEffect } from "react";
import axios from 'axios';
import BlackButton from "./components/BlackButton";
import OrangeButton from "./components/OrangeButton";
import WhiteButton from "./components/WhiteButton";
import Popup from "./components/popup";
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./educatorHome.css"; // Adjusted CSS import

const Eviewcourse = () => {
  const [buttonPopup, setButtonPopup] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

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

  const handleInputChangecode = (e) => {
    setCourseCode(e.target.value);
  };
  
  const handleInputChangetitle = (e) => {
    setCourseTitle(e.target.value);
  };
  
  const handleCreateCourse = async () => {
    try {
      setErrorMessage('');

      if (!courseCode || !courseTitle) {
        setErrorMessage('Please fill in all fields.');
        return;
      }
      
      const trimmedcode = courseCode.replace(/\s/g, '');
      const trimmedtitle = courseTitle.replace(/\s/g, '');
      
      if (!/^[a-zA-Z0-9]{5,8}$/.test(trimmedcode)) {
        setErrorMessage(
          'Course code must be 5 to 8 characters long and contain only letters and numbers.'
        );
        return;
      }
    
      if (!/^[a-zA-Z0-9\s]{1,50}$/.test(trimmedtitle)) {
        setErrorMessage(
          'Course title must be 1 to 50 characters long and contain only letters and numbers.'
        );
        return;
      }

      const isCourseExists = fetchedCourses.some(course => course.code === courseCode);
    
      if (isCourseExists) {
        setErrorMessage('Course already exists.');
        return;
      }
      
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

  const handleNavigateToClassrooms = (courseCode) => {
    navigate(`/Eclassrooms/${courseCode}`);
  };

  return (
    <div className="educator-home">
      <div className="upcoming-classes-container">
        <h3 className='h3'><FaCalendarAlt className='desktop-icon' /> Courses</h3>
        <div className="classroom-container">
          {fetchedCourses.map((course, index) =>
            course.educatorID === user.educator.ID ? (
              <div key={course._id} className="classroom-box">
                <p>
                  {course.code} : {course.title}
                  <FaArrowRight
                    className="arrow-icon"
                    onClick={() => handleNavigateToClassrooms(course.code)}
                  />
                </p>
                {index !== fetchedCourses.length - 1 && <hr />}
              </div>
            ) : null
          )}
        </div>

        <BlackButton className="register" onClick={() => setButtonPopup(true)} text="Create course" />

        <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
          <h3>Create Course</h3>
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
              placeholder="Enter course title"
              required
            />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
          <div className="buttons-container">
            <WhiteButton text="Cancel" onClick={() => setButtonPopup(false)} />
            <OrangeButton text="Create" onClick={handleCreateCourse} />
          </div>
        </Popup>
      </div>
    </div>
  );
};

export default Eviewcourse;
