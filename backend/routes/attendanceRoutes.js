// routes/students.js

const express = require('express');
const router = express.Router();
// const Student = require('../models/student');
const Student = require('../models/studentModel');
const Record=require('../models/attendanceRecords');

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        console.log('12321321');
        console.log(students); // Log the students array to check its content
        res.status(200).json({ message: students });
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
// router.post('/', async (req, res) => {
//     try {
//         // Extract student details from the request body
//         const { name, image } = req.body;

//         // Create a new student record
//         const newStudent = new Student({
//             name,
//             image
//         });

//         // Save the new student record to the database
//         const savedStudent = await newStudent.save();

//         res.status(201).json({ message: 'Student created successfully', student: savedStudent });
//     } catch (error) {
//         console.error('Error creating student:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
router.post('/', async (req, res) => {
    try {

        //console.log('')
        // Extract student ID from the request body
          // Extract student ID and course ID from the request body
          const { studentID, classroomID } = req.body;
        
          // Create a new attendance record
          const newRecord = new Record({
              student_id: studentID, // Set the student ID
              classroom_id: classroomID, // Set the course ID
            //   attendance_status: 'present' // Set the attendance status to 'present'
          });
        console.log(studentID + "present");
        const savedRecord = await newRecord.save();
        //Find the student by ID and update their attendance status
        // const updatedStudent = await Student.findByIdAndUpdate(studentID, { present: true }, { new: true });

        // if (!updatedStudent) {
        //     return res.status(404).json({ message: 'Student not found' });
        // }
        console.log(studentID + "present1234567854321");
        res.status(200).json({ message: 'Student marked present successfully'});
    } catch (error) {
        console.error('Error marking student present:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/report', async (req, res) => {
    try {
        const studentId = req.query.studentId; // Extract student ID from query parameters

        // Fetch attendance records that match the student ID
        const attendanceRecords = await Record.find({ student_id: studentId });
        
        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
router.get('/dashboard', async (req, res) => {
    try {
        const { studentId, classroomId } = req.query; // Extract student ID and classroom ID from query parameters

        // Fetch attendance records that match the student ID and classroom ID
        const attendanceRecords = await Record.find({ student_id: studentId, classroom_id: classroomId });
        
        res.status(200).json({ success: true, data: attendanceRecords });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
