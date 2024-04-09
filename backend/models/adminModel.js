const mongoose = require('mongoose')

const Schema = mongoose.Schema

const adminSchema = new Schema({
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
}, { timestamps: false })

module.exports = mongoose.model('Admin', adminSchema, 'admins');