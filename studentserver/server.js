require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const Course = require('./models/Course');
const noteRoutes = require('./routes/notes');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Student DB Connected'))
  .catch(console.error);

// ✅ Get modules for a course type
app.get('/student/modules/:type', async (req, res) => {
  const course = await Course.findOne({ course_type: req.params.type });
  if (!course) return res.status(404).json({ modules: [] });
  res.json({ modules: course.modules });
});

// ✅ Proxy question link from admin server
app.get('/student/question-link/:batch/:module/:title', async (req, res) => {
  const { batch, module, title } = req.params;

  try {
    const response = await axios.get(`http://localhost:5003/assignment-question/${batch}/${module}/${title}`);
    res.json(response.data);
  } catch (err) {
    console.error('❌ Failed to fetch question link from admin:', err);
    res.status(500).json({ error: 'Failed to fetch question link' });
  }
});

// ✅ Notes CRUD
app.use('/notes', noteRoutes);

// ✅ Start Server
app.listen(5002, () => console.log('Student server on port 5002'));
