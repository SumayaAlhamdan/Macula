

const mongoose = require('mongoose');

// Define the schema
const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    present: { type: Boolean, default: false }
});

// Specify the collection name explicitly
const Student = mongoose.model('student', studentSchema, 'student');

module.exports = Student;
