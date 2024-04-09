const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');


router.post('/login', async (req, res) => {
    try {
      const { ID, password } = req.body;
  
      if (!ID || !password) {
        return res.status(400).json({ message: 'All fields must be filled' });
      }
  
      const admin = await Admin.findOne({ ID });
  
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Compare plain text passwords
      if (password === admin.password) {
        // Create a token without expiration and secret key
        const token = jwt.sign({ userId: admin._id }, 'macula24');
  
        res.json({admin, token });
      } else {
        res.status(401).json({ message: 'Incorrect password' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
  module.exports = router;