const express = require('express');
const User = require("../models/User");
const Student = require('../models/Student');
const Test = require('../models/Test');
const router = express.Router();

router.post('/save', async (req, res) => {
  const { studentId, course, quiz, assignment, code } = req.body;

  try {
    let testDoc = await Test.findOne({ student: studentId, course });

    if (!testDoc) {
      testDoc = await Test.create({
        student: studentId,
        course,
        quiz: [],
        assignment: [],
        code: []
      });
    }

    testDoc.quiz.push(quiz);
    testDoc.assignment.push(assignment);
    testDoc.code.push(code);
    
    await testDoc.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving test marks' });
  }
});

// ✅ Route to get Top Performers for course
router.get('/top/:course', async (req, res) => {
  const { course } = req.params;

  try {
    const top = await Test.aggregate([
      { $match: { course } },
      {
        $addFields: {
          quizAvg: { $avg: "$quiz" },
          assignAvg: { $avg: "$assignment" },
          codeAvg: { $avg: "$code" },
          totalAvg: {
            $avg: [
              { $avg: "$quiz" },
              { $avg: "$assignment" },
              { $avg: "$code" }
            ]
          }
        }
      },
      { $sort: { totalAvg: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'students',
          localField: 'student',
          foreignField: '_id',
          as: 'studentInfo'
        }
      },
      { $unwind: "$studentInfo" },
      {
        $lookup: {  // Extra to fetch username
          from: 'users',
          localField: 'studentInfo.user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          quizAvg: 1,
          assignAvg: 1,
          codeAvg: 1,
          totalAvg: 1,
          studentName: "$userInfo.name"
        }
      }
    ]);

    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});


module.exports = router;
