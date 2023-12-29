const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  photoUrl: String,
  q1: {
    type: String,
    enum: ['yes', 'no', 'Yes', 'No'],
  },
  q2: {
    type: String,
    enum: ['yes', 'no', 'Yes', 'No'],
  },
  q3: {
    type: String,
    enum: ['yes', 'no', 'Yes', 'No'],
  },
});

module.exports = mongoose.model('Application', applicationSchema);
