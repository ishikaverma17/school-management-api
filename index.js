// index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Express app setup
const app = express();

// Middleware to parse JSON request body
app.use(bodyParser.json());

// ======== MONGODB ATLAS CONNECTION 
const mongoURI = 'mongodb+srv://school-management:school-management@cluster0.5h8mr.mongodb.net/schoolManagement?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Import School model
const School = require('./models/School');

// ===================== ADD SCHOOL (POST) =====================
app.post('/addSchool', async (req, res) => {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Basic validation
    if (!name || !address || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new school document
    const newSchool = new School({
      name,
      address,
      latitude,
      longitude
    });

    // Save to MongoDB
    await newSchool.save();

    // Return response
    return res.status(201).json({
      message: 'School added successfully',
      school: newSchool
    });
  } catch (error) {
    console.error('Error adding school:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to calculate distance (Haversine Formula)
function getDistance(lat1, lon1, lat2, lon2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ===================== LIST SCHOOLS (GET) =====================
app.get('/listSchools', async (req, res) => {
  try {
    const { userLat, userLng } = req.query;

    // Check if user location is provided
    if (!userLat || !userLng) {
      return res.status(400).json({ error: 'User latitude and longitude are required' });
    }

    // Fetch all schools from MongoDB
    const schools = await School.find();

    // Calculate distance for each school
    const schoolsWithDistance = schools.map((school) => {
      const distance = getDistance(
        parseFloat(userLat),
        parseFloat(userLng),
        school.latitude,
        school.longitude
      );
      return {
        ...school._doc,
        distance
      };
    });

    // Sort by distance (ascending order)
    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    // Return sorted list
    return res.json(schoolsWithDistance);
  } catch (error) {
    console.error('Error listing schools:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
