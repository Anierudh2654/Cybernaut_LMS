const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/User");
const Student = require('../models/Student');
const Batch = require('../models/Batch');
const { Parser } = require('json2csv');

const router = express.Router();

// Save selected students & generate credentials
router.post('/save-selected', async (req, res) => {
  const selectedStudents = req.body;
  const credentials = [];

  try {
    for (const stu of selectedStudents) {
      const existingUser = await User.findOne({ email: stu.email });
      if (existingUser) continue;

      const plainPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const newUser = await User.create({
        name: stu.name,
        email: stu.email,
        password: hashedPassword,
        role: 'student',
      });

      await Student.create({
        user: newUser._id,
        course: stu.course,
        batch: stu.batch,
        phone: stu.phone,
        address: stu.address,
        dob: stu.dob,
      });

      credentials.push({
        name: stu.name,
        email: stu.email,
        password: plainPassword,
      });
    }

    res.json({ credentials });
  } catch (err) {
    res.status(500).json({ error: 'Error saving students' });
  }
});

// Generate CSV
router.post('/download-credentials', (req, res) => {
  const credentials = req.body;

  try {
    const parser = new Parser({ fields: ['name', 'email', 'password'] });
    const csv = parser.parse(credentials);
    res.header('Content-Type', 'text/csv');
    res.attachment('credentials.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ error: 'Error generating CSV' });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'batch',
        populate: { path: 'course', select: 'courseName' },
        select: 'batchName course'
      });

    const formattedStudents = students.map(student => ({
      _id: student._id,
      user: student.user, // { name, email }
      phone: student.phone,
      dob: student.dob,
      batch: student.batch.batchName,
      course: student.batch.course.courseName,
    }));

    res.json(formattedStudents);
  } catch (err) {
    console.error('Failed to fetch students:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get students by batch
router.get('/batch/:batch', async (req, res) => {
  try {
    const { batch } = req.params;
    const students = await Student.find({ batch }).populate('user');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;
