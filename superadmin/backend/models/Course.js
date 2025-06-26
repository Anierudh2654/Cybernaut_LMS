const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  modules: [{ type: String, required: true }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);

