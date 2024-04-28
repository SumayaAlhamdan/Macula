import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/adminHome.css";
import Confirmation from "../components/confirmation";
import Success from '../components/Success';
import "../components/Success.css";

const AdminHome = () => {
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);
  const [currentCourses, setCurrentCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    paginate(currentPage);
  }, [currentPage, fetchedCourses]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/courses');
      const courses = response.data.message;
      setFetchedCourses(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  const handleToggleStatus = async (courseId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setCourseIdToDelete(courseId);
    setShowConfirmationModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      const updatedStatus = fetchedCourses.find(course => course.code === courseIdToDelete).status === 'active' ? 'inactive' : 'active';
      console.log(courseIdToDelete);
      console.log(updatedStatus);
      await axios.patch(`http://localhost:4000/api/courses/status/${courseIdToDelete}`, { status: updatedStatus });
      fetchCourses();
      setShowConfirmationModal(false);
      setCourseIdToDelete(null);
      setSuccessPopup(true);
    } catch (error) {
      console.error(`Error toggling status for course ${courseIdToDelete}:`, error);
    }
  };
  
  const handleCancelAction = () => {
    setShowConfirmationModal(false);
    setCourseIdToDelete(null);
  };

  const paginate = pageNumber => {
    setCurrentPage(pageNumber);
    const indexOfLastCourse = pageNumber * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const courses = fetchedCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    setCurrentCourses([...courses]); // Ensure to spread the 'courses' array to avoid mutating state directly
  };
  
  return (
    <div>
    <div className='AdminHome'>
      <table>
        <thead>
          <tr>
            <th style={{ width: '100px' }}>Course Status</th>
            <th style={{ width: '200px' }}>Course Title</th>
            <th style={{ width: '150px' }}>Educator ID</th>
            <th style={{ width: '150px' }}></th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course, index) => (
            <tr key={index}>
              <td style={{ width: '100px' }}>
                <span className={course.status === 'active' ? 'active' : 'inactive'}>
                  {course.status}
                </span>
              </td>
              <td style={{ width: '200px' }}>{course.title}</td>
              <td style={{ width: '150px' }}>{course.educatorID}</td>
              <td style={{ width: '150px' }}>
                <button
                  onClick={() => handleToggleStatus(course.code, course.status)}
                  className={`actionbutton ${course.status === 'active' ? 'activeButton' : 'inactiveButton'}`}
                >
                  {course.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(fetchedCourses.length / coursesPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
      {showConfirmationModal && (
        <Confirmation
          message={`Are you sure you want to ${fetchedCourses.find(course => course.code === courseIdToDelete).status === 'active' ? 'deactivate' : 'activate'} this course?`}
          onCancel={handleCancelAction}
          onConfirm={handleConfirmAction}
        />
      )}
    </div>
    <Success trigger={successPopup} setTrigger={setSuccessPopup} text="Status changed successfully" />
 </div> );
};

export default AdminHome;

