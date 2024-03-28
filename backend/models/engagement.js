// models/engagement.js

const mongoose = require('mongoose');
mongoose.pluralize(null);


const engagementSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true
  },
  courseID: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  engagementStatus: {
    type: String,
    enum: ['Focused', 'Distracted'],
    required: true
  },
  focusDuration: {
    type: Number,
    required: true
  },
  longestFocusDuration: {
    type: Number,
    required: true
  }
});

const Engagement = mongoose.model('engagement_data', engagementSchema);

module.exports = Engagement;
