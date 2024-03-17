const mongoose = require('mongoose');
const Schema = mongoose.Schema ;

const classroomsSchema = new Schema({
    courseID:{
        type: String,
        required: true
    },
    educatorID:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        required: true
    },
    time:{
        type: String,
        required: true
    },
    duration:{
        type: String,
        required: true
    }

},{ timestamps: false });

module.exports = mongoose.model('Classroom', classroomsSchema, 'virtual_classrooms');