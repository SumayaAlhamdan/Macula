

// // import React, { useState, useEffect } from 'react';
// // import { FaMedal } from 'react-icons/fa';
// // import axios from 'axios';

// // const Profile = () => {
// //   const user = JSON.parse(localStorage.getItem('user'));
// //   const [engagementRecords, setEngagementRecords] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState('');
// //   const [medalsEarned, setMedalsEarned] = useState(
// //     parseInt(localStorage.getItem('medalsEarned')) || 0
// //   );

// //   useEffect(() => {
// //     fetchEngagementRecords();
// //   }, [user]);

// //   const fetchEngagementRecords = async () => {
// //     try {
// //       setLoading(true);
// //       const response = await axios.get(`/api/engagement/student/${user.student.ID}`);
// //       setEngagementRecords(response.data.engagementRecords);
// //       setLoading(false);
// //       setError('');
// //       // Update the number of medals earned based on the number of engagement records with longest_focus_duration >= 1
// //       const filteredRecords = response.data.engagementRecords.filter(record => record["Longest Focus Duration"] >= 1);
// //       setMedalsEarned(filteredRecords.length);
// //     } catch (error) {
// //       console.error('Error fetching engagement records:', error);
// //       setError('Error fetching engagement records');
// //       setLoading(false);
// //       setEngagementRecords([]);
// //     }
// //   };
  
// //   useEffect(() => {
// //     localStorage.setItem('medalsEarned', medalsEarned);
// //   }, [medalsEarned]);

// //   return (
// //     <div className="profile-page">
// //       <h1>Profile</h1>
// //       <div className="profile-container">
// //         <h2>Personal Information</h2>
// //         <div className="profile-data">
// //           <div className="profile-field">
// //             <label>ID:</label>
// //             <span>{user.student ? user.student.ID : user.educator.ID}</span>
// //           </div>
// //           <div className="profile-field">
// //             <label>Name:</label>
// //             <span>{user.student ? user.student.name : user.educator.name}</span>
// //           </div>
// //           <div className="profile-field">
// //             <label>Email:</label>
// //             <span>{user.student ? user.student.email : user.educator.email}</span>
// //           </div>
// //         </div>
// //       </div>
// //       {user.student && (
// //         <div className="rewards-container">
// //           <h2>Rewards</h2>
// //           <div className="medal-container">
// //             {/* Render the earned medals */}
// //             {Array.from({ length: medalsEarned }).map((_, index) => (
// //               <FaMedal key={index} color="#EF5423" size={50} />
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Profile;
// import React, { useState, useEffect } from 'react';
// import { FaMedal } from 'react-icons/fa';
// import axios from 'axios';

// const Profile = () => {
//   const user = JSON.parse(localStorage.getItem('user'));
//   const [engagementRecords, setEngagementRecords] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [medalsEarned, setMedalsEarned] = useState(
//     parseInt(localStorage.getItem('medalsEarned')) || 0
//   );
//   const [medalsEarnedFocus, setMedalsEarnedFocus] = useState(0); // New state for medals earned with focus duration > 5

//   useEffect(() => {
//     fetchEngagementRecords();
//   }, [user]);

//   const fetchEngagementRecords = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get(`/api/engagement/student/${user.student.ID}`);
//       setEngagementRecords(response.data.engagementRecords);
//       setLoading(false);
//       setError('');
//       // Update the number of medals earned based on the number of engagement records with longest_focus_duration >= 1
//       const filteredRecords = response.data.engagementRecords.filter(record => record["Longest Focus Duration"] >= 600);
//       setMedalsEarned(filteredRecords.length);

//       // Calculate the number of medals earned with focus duration > 5
//       const filteredRecordsFocus = response.data.engagementRecords.filter(record => record["Longest Focus Duration"] >= 300 && record["Longest Focus Duration"] < 600);
//       setMedalsEarnedFocus(filteredRecordsFocus.length);
//     } catch (error) {
//       console.error('Error fetching engagement records:', error);
//       setError('Error fetching engagement records');
//       setLoading(false);
//       setEngagementRecords([]);
//     }
//   };
  
//   useEffect(() => {
//     localStorage.setItem('medalsEarned', medalsEarned);
//   }, [medalsEarned]);

//   useEffect(() => {
//     localStorage.setItem('medalsEarnedFocus', medalsEarnedFocus);
//   }, [medalsEarnedFocus]);

//   return (
//     <div className="profile-page">
//       <h1>Profile</h1>
//       <div className="profile-container">
//         <h2>Personal Information</h2>
//         <div className="profile-data">
//           <div className="profile-field">
//             <label>ID:</label>
//             <span>{user.student ? user.student.ID : user.educator.ID}</span>
//           </div>
//           <div className="profile-field">
//             <label>Name:</label>
//             <span>{user.student ? user.student.name : user.educator.name}</span>
//           </div>
//           <div className="profile-field">
//             <label>Email:</label>
//             <span>{user.student ? user.student.email : user.educator.email}</span>
//           </div>
//         </div>
//       </div>
//       {user.student && (
//         <div className="rewards-container">
//           <h2>Rewards</h2>
//           <h3> 10 minutes focus streaks </h3>
//           <div className="medal-container">
//             {/* Render the earned medals */}
//             {Array.from({ length: medalsEarned }).map((_, index) => (
//               <FaMedal key={index} color="#EF5423" size={50} />
//             ))}
//           </div>
//           <h3>5 minutes focus streaks</h3>
//           <div className="medal-container">
//             {/* Render the earned medals with focus duration > 5 */}
//             {Array.from({ length: medalsEarnedFocus }).map((_, index) => (
//               <FaMedal key={index} color="#4CAF50" size={50} />
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Profile;
import React, { useState, useEffect } from 'react';
import { FaMedal } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [engagementRecords, setEngagementRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [medalsEarned, setMedalsEarned] = useState(
    parseInt(localStorage.getItem('medalsEarned')) || 0
  );
  const [medalsEarnedFocus, setMedalsEarnedFocus] = useState(0); // New state for medals earned with focus duration > 5

  useEffect(() => {
    fetchEngagementRecords();
  }, [user]);

  const fetchEngagementRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/engagement/student/${user.student.ID}`);
      setEngagementRecords(response.data.engagementRecords);
      setLoading(false);
      setError('');
      // Update the number of medals earned based on the number of engagement records with longest_focus_duration >= 1
      const filteredRecords = response.data.engagementRecords.filter(record => record["Longest Focus Duration"] >= 600);
      setMedalsEarned(filteredRecords.length);

      // Calculate the number of medals earned with focus duration > 5
      const filteredRecordsFocus = response.data.engagementRecords.filter(record => record["Longest Focus Duration"] >= 300 && record["Longest Focus Duration"] < 600);
      setMedalsEarnedFocus(filteredRecordsFocus.length);
    } catch (error) {
      console.error('Error fetching engagement records:', error);
      setError('Error fetching engagement records');
      setLoading(false);
      setEngagementRecords([]);
    }
  };
  
  useEffect(() => {
    localStorage.setItem('medalsEarned', medalsEarned);
  }, [medalsEarned]);

  useEffect(() => {
    localStorage.setItem('medalsEarnedFocus', medalsEarnedFocus);
  }, [medalsEarnedFocus]);

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <div className="profile-container">
        <h2>Personal Information</h2>
        <div className="profile-data">
          <div className="profile-field">
            <label>ID:</label>
            <span>{user.student ? user.student.ID : user.educator.ID}</span>
          </div>
          <div className="profile-field">
            <label>Name:</label>
            <span>{user.student ? user.student.name : user.educator.name}</span>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <span>{user.student ? user.student.email : user.educator.email}</span>
          </div>
        </div>
      </div>
      {user.student && (
        <div className="rewards-container">
          <h2>Rewards</h2>
          <h3> 10 minutes focus streaks </h3>
          <div className="medal-container">
            {/* Render the earned medals */}
            {medalsEarned === 0 ? (
              <p>No rewards earned.</p>
            ) : (
              Array.from({ length: medalsEarned }).map((_, index) => (
                <FaMedal key={index} color="#EF5423" size={50} />
              ))
            )}
          </div>
          <h3>5 minutes focus streaks</h3>
          <div className="medal-container">
            {/* Render the earned medals with focus duration > 5 */}
            {medalsEarnedFocus === 0 ? (
              <p>No rewards earned.</p>
            ) : (
              Array.from({ length: medalsEarnedFocus }).map((_, index) => (
                <FaMedal key={index} color="#109BA8" size={50} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
