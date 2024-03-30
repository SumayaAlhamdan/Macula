const mongoose = require('mongoose');

const { Schema } = mongoose;

// Define schema for the attendance record
const attendanceSchema = new Schema({
    classroom_id: {
        type: Schema.Types.ObjectId,
        ref: 'VirtualClassroom', // Reference to the VirtualClassroom model
        required: true
    },
    student_id: {
        type: String,
        required: true
    },
    // attendance_status: {
    //     type: String,
    //     enum: ['present', 'absent'], // Status can only be 'present' or 'absent'
    //     required: true
    // }
});

// Create Attendance model based on the attendanceSchema
const Attendance = mongoose.model('Attendance_Record', attendanceSchema);

module.exports = Attendance;
