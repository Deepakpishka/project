// insert-hospitals.js
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/hospitalDB')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error(err));

const hospitalSchema = new mongoose.Schema({
    name: String,
    address: String,
    latitude: Number,
    longitude: Number,
    specialties: [String]
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

const hospitals = [
    { name: "City Hospital", address: "123 Main St", latitude: 40.7128, longitude: -74.0060, specialties: ["General", "Emergency"] },
    { name: "HealthCare Clinic", address: "456 Health Ave", latitude: 40.7138, longitude: -74.0050, specialties: ["Pediatrics", "Cardiology"] },
    { name: "Sunrise Medical Center", address: "789 Sunrise Blvd", latitude: 40.7148, longitude: -74.0040, specialties: ["Orthopedics", "Neurology"] }
];

Hospital.insertMany(hospitals)
    .then(() => {
        console.log("Hospitals inserted successfully");
        mongoose.connection.close();
    })
    .catch(err => console.error(err));
