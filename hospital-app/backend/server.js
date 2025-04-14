console.log("Starting server...");

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hospitalDB')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// ✅ ✅ ✅ STEP 1 — Appointment Schema
const appointmentSchema = new mongoose.Schema({
    hospitalId: String,
    userName: String,
    time: Date
});
const Appointment = mongoose.model('Appointment', appointmentSchema);

// ✅ ✅ ✅ STEP 1 — Hospital Schema (Added)
const hospitalSchema = new mongoose.Schema({
    name: String,
    address: String,
    latitude: Number,
    longitude: Number,
    specialties: [String]
});
const Hospital = mongoose.model('Hospital', hospitalSchema);

// 🔹 Default Route (Fixes "Cannot GET /" error)
app.get("/", (req, res) => {
    res.send("Hospital API is running...");
});

// 🔄 Search Hospitals by Location + Symptoms
app.post('/api/search-hospitals', async (req, res) => {
    const { latitude, longitude, symptoms } = req.body;

    if (!latitude || !longitude || !symptoms) {
        return res.status(400).json({ error: "Latitude, Longitude, and Symptoms are required" });
    }

    try {
        // Find hospitals within 5 km radius (approx with +-0.05 degrees)
        const nearbyHospitals = await Hospital.find({
            specialties: { $in: symptoms },
            latitude: { $gte: latitude - 0.05, $lte: latitude + 0.05 },
            longitude: { $gte: longitude - 0.05, $lte: longitude + 0.05 }
        });

        res.json({ hospitals: nearbyHospitals });
    } catch (error) {
        res.status(500).json({ error: "Failed to search hospitals" });
    }
});
// 🔄 Book Appointment Route (Modified)
app.post('/api/book-appointment', async (req, res) => {
    const { hospitalId, userName, time } = req.body;

    if (!hospitalId || !userName || !time) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const newAppointment = new Appointment({ hospitalId, userName, time });
        await newAppointment.save();

        res.json({ message: "Appointment booked successfully and saved!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to book appointment" });
    }
});

// ✅ ✅ ✅ STEP 2 — View All Appointments
app.get('/api/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
});

// ✅ Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
