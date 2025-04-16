const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },  // Or mongoose.Schema.Types.ObjectId if you reference City
  address: String,
  contact: String,
});

module.exports = mongoose.model('Hospital', hospitalSchema);
