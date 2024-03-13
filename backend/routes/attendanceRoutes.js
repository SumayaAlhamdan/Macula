// routes/students.js

const express = require('express');
const router = express.Router();
const Student = require('../models/student');

router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
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

        // Extract student ID from the request body
        const { studentID } = req.body;
        console.log(studentID + "present");
        //Find the student by ID and update their attendance status
        const updatedStudent = await Student.findByIdAndUpdate(studentID, { present: true }, { new: true });

        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: 'Student marked present successfully', student: updatedStudent });
    } catch (error) {
        console.error('Error marking student present:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = router;
