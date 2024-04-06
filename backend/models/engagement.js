// models/engagement.js

const mongoose = require('mongoose');
mongoose.pluralize(null);

const engagementSchema = new mongoose.Schema({
  studentID: {
    type: String,
    required: true
  },
  classroomID: {
    type: String,
    required: true
  },
  engagementStatus: {
    type: String,
    enum: ['Focused', 'Distracted', 'Away'],
    required: true
  },
  focusDuration: {
    type: Number,
    default: 0 // Default value is 0
  },
  totalDistractionDuration: {
    type: Number,
    default: 0 // Default value is 0
  },
  longestFocusDuration: {
    type: Number,
    default: 0 // Default value is 0
  }
});

const Engagement = mongoose.model('engagement_data', engagementSchema);

module.exports = Engagement;
