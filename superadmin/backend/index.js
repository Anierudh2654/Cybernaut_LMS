const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require("dotenv");

dotenv.config();

const homeRoutes = require('./routes/homeroute.js');
const userRoutes = require('./routes/userroute.js');
const adminRoutes = require('./routes/adminroute.js');
const salaryRoutes = require('./routes/salaryroute.js');
const studentsRoutes = require('./routes/studentroute.js');
const testRoutes = require('./routes/testroute.js');
const courseRoutes = require('./routes/courseroute.js');
const batchRoutes = require('./routes/batchroute.js');
const uploadRoutes = require('./routes/uploadroute.js')
const systemRoutes = require("./routes/system");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI).then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/users',userRoutes);
app.use('/api/stats', homeRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/salary',salaryRoutes);
app.use('/api/students', studentsRoutes);
app.use("/api/tests",testRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/upload', uploadRoutes);
app.use("/api/system", systemRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
