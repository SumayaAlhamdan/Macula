// routes/engagement.js

const express = require('express');
const router = express.Router();
const Engagement = require('../models/engagement');

// Create a new engagement record
router.post('/', async (req, res) => {
  try {
    const { studentID, classroomID, engagementStatus, focusDuration, longestFocusDuration } = req.body;

    // Create a new engagement record
    const newEngagementRecord = new Engagement({
      studentID,
      classroomID,
      engagementStatus,
      focusDuration,
      longestFocusDuration
    });

    // Save the engagement record to the database
    await newEngagementRecord.save();

    res.status(201).json({ message: 'Engagement record created successfully' });
  } catch (error) {
    console.error('Error creating engagement record:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get engagement records based on classroom ID
router.get('/:classroomID', async (req, res) => {
  try {
    const { classroomID } = req.params;

    // Fetch engagement records based on the classroom ID
    const engagementRecords = await Engagement.find({ classroomID });

    res.json({ engagementRecords });
  } catch (error) {
    console.error('Error fetching engagement records:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
