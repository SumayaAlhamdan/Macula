const express = require('express');
const router = express.Router();
const Educator = require('../models/educatorModel') ;
const jwt = require('jsonwebtoken');

// Route to register a new educator
router.post('/register', async (req, res) => {
  try {
    const { ID, name, email, password } = req.body;

    // Check if the educator already exists
    const existingEducator = await Educator.findOne({ ID });

    if (existingEducator) {
      return res.status(409).json({ message: 'Educator with this ID already exists' });
    }

    // Create a new educator
    const newEducator = new Educator({
      ID,
      name,
      email,
      password,
    });

    // Save the new educator to the database
    const savedEducator = await newEducator.save();

    res.status(201).json({ message: 'Educator registered successfully', educator: savedEducator });
  } catch (error) {
    console.error('Error registering educator:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route for an educator to log in
router.post('/login', async (req, res) => {
  try {
    const { ID, password } = req.body;

    if (!ID || !password) {
      return res.status(400).json({ message: 'All fields must be filled' });
    }

    const educator = await Educator.findOne({ ID });

    if (!educator) {
      return res.status(404).json({ message: 'Educator not found' });
    }

    // Compare plain text passwords
    if (password === educator.password) {
      // Create a token without expiration and secret key
      const token = jwt.sign({ userId: educator._id }, 'your-secret-key');

      res.json({educator, token });
    } else {
      res.status(401).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get all educators
router.get('/', async (req, res) => {
  try {
    // Retrieve all educators from the database
    const educators = await Educator.find();
    res.json({ educators });
  } catch (error) {
    console.error('Error getting all educators:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to get a specific educator by ID
router.get('/:id', async (req, res) => {
  try {
    // Find an educator by ID in the database
    const educator = await Educator.findOne({ _id: req.params.id });

    if (!educator) {
      return res.status(404).json({ message: 'Educator not found' });
    }

    res.json({ educator });
  } catch (error) {
    console.error('Error getting educator by ID:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
