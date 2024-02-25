// server.js
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://nesreengdb:macula2024@macula.svwywkc.mongodb.net/', {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Handle connection events
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
