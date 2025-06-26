const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  course: { type: String, required: true },
  quiz: [{ type: Number, max: 10 }],
  assignment: [{ type: Number, max: 10 }],
  code: [{ type: Number, max: 10 }],
}, { timestamps: true });

module.exports = mongoose.model('Test', testSchema);
