const express = require('express');
const connectDB = require('./config/db.js');
const cors = require('cors');
// Connect to the database
connectDB();

// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());

// Define routes
app.use('/api/attendance', require('./routes/attendanceRoutes.js'));

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
