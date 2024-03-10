const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const educatorSchema = new Schema({
  ID: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, { timestamps: false });

module.exports = mongoose.model('Educator', educatorSchema, 'educators');
