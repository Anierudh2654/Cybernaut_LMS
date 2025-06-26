const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  dob: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

