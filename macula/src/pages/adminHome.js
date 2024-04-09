import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../css/adminHome.css";
import Confirmation from "../components/confirmation" ;
import Success from '../components/Success';

const AdminHome = () => {
  const [fetchedCourses, setFetchedCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 10;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [courseIdToDelete, setCourseIdToDelete] = useState(null);
  const [successPopup, setSuccessPopup] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    calculateTotalPages();
  }, [fetchedCourses]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/courses');
      const courses = response.data.message;
      setFetchedCourses(courses);
      console.log("Fetched courses:", courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }

  const handleToggleStatus = async (courseId, currentStatus) => {
    // Check if the course status is active or inactive
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const message = `Are you sure you want to ${currentStatus === 'active' ? 'deactivate' : 'activate'} this course?`;
  
    // Display the confirmation modal
    setCourseIdToDelete(courseId);
    setShowConfirmationModal(true);
  };
  
  const handleConfirmAction = async () => {
    try {
      const updatedStatus = fetchedCourses.find(course => course.id === courseIdToDelete).status === 'active' ? 'inactive' : 'active';
      await axios.put(`http://localhost:4000/api/courses/${courseIdToDelete}`, { status: updatedStatus });
      // Assuming successful update, update the state to reflect the changes
      const updatedCourses = fetchedCourses.map(course => {
        if (course.id === courseIdToDelete) {
          return { ...course, status: updatedStatus };
        }
        return course;
      });
      setFetchedCourses(updatedCourses);
    } catch (error) {
      console.error(`Error toggling status for course ${courseIdToDelete}:`, error);
    }
  
    // Close the confirmation modal
    setShowConfirmationModal(false);
    setCourseIdToDelete(null);
  };

  const handleCancelAction = () => {
    // Close the confirmation modal
    setShowConfirmationModal(false);
    setCourseIdToDelete(null);
  };

  const calculateTotalPages = () => {
    const totalPages = Math.ceil(fetchedCourses.length / coursesPerPage);
    return totalPages;
  };

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = fetchedCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  return (
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
          {currentCourses.map(course => (
            <tr key={course.id}>
            <td style={{ width: '100px' }}><span className={course.status === 'active' ? 'active' : 'inactive'}>
                  {course.status}
                </span></td>
            <td style={{ width: '200px' }}>{course.title}</td>
            <td style={{ width: '150px' }}>{course.educatorID}</td>
            <td style={{ width: '150px' }}>
            <button
    onClick={() => handleToggleStatus(course.id, course.status)}
    className={`actionbutton ${course.status === 'active' ? 'activeButton' : 'inactiveButton'}`}>
    {course.status === 'active' ? 'Deactivate' : 'Activate'}
</button>
              </td>
            </tr>
          ))}
        </tbody>
        
      </table>
      
      <div className="pagination">
        {Array.from({ length: calculateTotalPages() }, (_, i) => (
          <button key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
      {showConfirmationModal && (
        <Confirmation
          message={`Are you sure you want to ${fetchedCourses.find(course => course.id === courseIdToDelete).status === 'active' ? 'deactivate' : 'activate'} this course?`}
          onCancel={handleCancelAction}
          onConfirm={handleConfirmAction}
        />
      )}
      <Success trigger={successPopup} setTrigger={setSuccessPopup} text="Status changed successfully" />
    </div>
  );
};

export default AdminHome;
