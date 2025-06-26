const express = require('express');
const router = express.Router();
const Batch = require('../models/Batch');
const Course = require('../models/Course');
const Student = require('../models/Student');

// GET all batches with course name, admin names, and student count
router.get('/', async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate('course', 'courseName')     // Only get course name
      .populate('admins.admin', 'name');    // Only get admin name

    // Add student count to each batch
    const result = await Promise.all(
      batches.map(async (batch) => {
        const studentCount = await Student.countDocuments({ batch: batch._id });
        return {
          ...batch.toObject(),
          studentCount
        };
      })
    );

    res.json(result);
  } catch (err) {
    console.error('Error fetching batches:', err);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { batchName, course, startDate, admins } = req.body;

    // check if batch name already exists for this course
    const existing = await Batch.findOne({ batchName, course });
    if (existing) return res.status(400).json({ message: 'Batch name already exists for this course' });

    const batch = new Batch({ batchName, course, startDate, admins });
    await batch.save();

    res.status(201).json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
