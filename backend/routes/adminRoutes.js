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
  
  router.post('/reset', async (req, res) => {
    try {
      const { email, newPassword } = req.body;
  
      // Check if all fields are provided
      if (!email || !newPassword) {
        return res.status(400).json({ message: 'All fields must be filled' });
      }
  
      // Find the admin in the database by ID
      const admin = await Admin.findOne({ email });
  
      // If admin is not found, return 404 error
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }
  
      // Update admin's password with the new password
      admin.password = newPassword;
  
      // Save the updated admin document in the database
      await admin.save();
  
      // Send success response
      res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error during reset password:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  



  module.exports = router;