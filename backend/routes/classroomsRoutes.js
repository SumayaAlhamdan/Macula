const express = require('express');
const router = express.Router();
const Classroom = require('../models/classroomsModel');

router.get('/', async (req, res) => {
    try {
        const classrooms = await Classroom.find();
        res.status(200).json({ message:classrooms });
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Check if request body contains necessary data
        const { courseID, educatorID, title, date, time, duration } = req.body;
        if ( !courseID || !educatorID || !title || !date || !time || !duration) {
            return res.status(400).json({ message: 'Missing required data' });
        }

        // Create a new classroom record
        const newClassroom = new Classroom({
            courseID,
            educatorID,
            title,
            date,
            time,
            duration
        });

        // Save the new classroom record to the database
        const savedClassroom = await newClassroom.save();

        res.status(201).json({ message: 'Classroom created successfully', classroom: savedClassroom });
    } catch (error) {
        console.error('Error creating classroom:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;