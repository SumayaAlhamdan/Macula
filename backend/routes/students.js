const express = require('express');
const router = express.Router();
const Student = require('../models/studentModel');
const jwt = require('jsonwebtoken');

// Route to add a new student
router.post('/add', async (req, res) => {
  try {
    const { ID, name, email, password } = req.body;

    // Check if the student already exists
    const existingStudent = await Student.findOne({ ID });

    if (existingStudent) {
      return res.status(409).json({ message: 'Student with this ID already exists' });
    }

    // Create a new student
    const newStudent = new Student({
      ID,
      name,
      email,
      password,
    });

    // Save the new student to the database
    const savedStudent = await newStudent.save();

    res.status(201).json({ message: 'Student added successfully', student: savedStudent });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ students });
  } catch (error) {
    console.error('Error getting all students:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get a specific student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findOne({ ID: req.params.id });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Error getting student by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { ID, password } = req.body;

    if (!ID || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const student = await Student.findOne({ ID });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Compare plain text passwords
    if (password === student.password) {
      // Create a token without expiration and secret key
      const token = jwt.sign({ userId: student._id }, 'macula24');

      res.json({student, token });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

