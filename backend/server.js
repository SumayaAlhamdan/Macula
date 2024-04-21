const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const session = require('express-session');
require('dotenv').config();

// Import route handlers
const studentsRoutes = require('./routes/students');
const attendanceRoutes = require('./routes/attendanceRoutes');
const educatorsRoutes = require('./routes/educators'); 
const courseRoutes = require('./routes/courseRoutes.js') 
const classroomsRoutes = require('./routes/classroomsRoutes.js')
const engagementRouter = require('./routes/engagement');
const adminRouter = require('./routes/adminRoutes');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

// Log requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use('/api/students', studentsRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/educators', educatorsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/classrooms', classroomsRoutes);
app.use('/api/engagement', engagementRouter);
app.use('/api/admins', adminRouter);

// Endpoint for sending OTP via email
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });

  // Store OTP in session
  req.session.otp = otp;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP for Password Reset',
    text: `Your OTP for password reset is: ${otp}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send OTP' });
    } else {
      console.log('OTP sent successfully:', otp);
      res.status(200).json({ message: 'OTP sent successfully' });
    }
  });
});

// Endpoint for verifying OTP
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  // Perform OTP verification logic here
  // For example, you could check if the received OTP matches the one stored in session

  if (otp === req.session.otp) {
    res.status(200).json({ valid: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ valid: false, message: 'Invalid OTP' });
  }
});

// Connect to the database
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 100000
};

mongoose.connect("mongodb+srv://nesreengdb:macula2024@macula.svwywkc.mongodb.net/macula?retryWrites=true&w=majority&appName=Macula", options)
  .then(() => {
    console.log('Connected to the database');
    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });
