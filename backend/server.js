//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentsRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendanceRoutes');
const educatorsRoutes = require('./routes/educators'); // Import educatorsRoutes
const courseRoutes = require('./routes/courseRoutes.js') // Import educatorsRoutes

require('dotenv').config();

// Connect to the database
mongoose.connect("mongodb+srv://nesreengdb:macula2024@macula.svwywkc.mongodb.net/macula?retryWrites=true&w=majority&appName=Macula")
  .then(() => {
    console.log('Connected to the database');
    // Create Express app
    const app = express();

    // Middleware to parse JSON bodies and handle CORS
    app.use(cors());
    app.use(express.json());

    // Middleware to log request information
    app.use((req, res, next) => {
      console.log(req.path, req.method);
      next();
    });

    // Define routes
    app.use('/api/students', studentsRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/educators', educatorsRoutes);
app.use('/api/courses', courseRoutes);


    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
