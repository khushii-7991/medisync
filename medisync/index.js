const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const doctorRoutes = require('./routes/doctorRoute');
const patientRouter = require('./routes/patientRoute');
const prescriptionRouter = require('./routes/prescriptionRoute');
const scheduleRoutes = require('./routes/scheduleRoute');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/new_SMS-main')));

// API Routes with consistent /api prefix
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRouter);
app.use('/api/prescription', prescriptionRouter);
app.use('/api/schedule', scheduleRoutes);

// Serve frontend for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/new_SMS-main/index.html'));
});

mongoose.connect('mongodb://localhost:27017/medwise')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));