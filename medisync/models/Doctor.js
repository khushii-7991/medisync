const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  timings: [
    {
      day: String,
      start: String,
      end: String
    }
  ],
  contact: String,
});

module.exports = mongoose.model('Doctor', doctorSchema);
