// models/course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type : String,
    required: true
  },
  code:{
 type : String,
 required: true
  } ,
  status: {
    type : String,
     } ,
  educatorID: {
    type : String,
     },
     students: [{
      type: String,
    }]
});

const Course = mongoose.model('course', courseSchema, 'course');

module.exports = Course;
