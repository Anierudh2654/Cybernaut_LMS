const express = require('express');
const Student = require('../models/Student');
const Admin = require('../models/Admin');
const Batch = require('../models/Batch');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [students, admins, batches] = await Promise.all([
      Student.find(),
      Admin.find(),
      Batch.find({ startDate: { $lt: new Date() } }) // active batches
    ]);
    
    const stats = {
      totalStudents: students.length,
      totalLecturers: admins.length,
      activeBatches: batches.length,
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error in /api/stats:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

module.exports = router;
