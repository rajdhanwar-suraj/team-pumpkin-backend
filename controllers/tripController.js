const Trip = require('../models/tripModel');
const csv = require('csv-parser');
const fs = require('fs');
const geolib = require('geolib');

// Upload trip data from CSV
exports.uploadTrip = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push({
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      timestamp: new Date(data.timestamp),
    }))
    .on('end', async () => {
      // Calculate total distance
      const totalDistance = results.reduce((acc, curr, idx, arr) => {
        if (idx === 0) return acc;
        const prev = arr[idx - 1];
        const distance = geolib.getDistance(
          { latitude: prev.latitude, longitude: prev.longitude },
          { latitude: curr.latitude, longitude: curr.longitude }
        );
        return acc + distance;
      }, 0);

      // Store trip in database
      try {
        const trip = await Trip.create({
          user: req.user._id, // Assuming user ID is set via authentication
          tripData: results,
          totalDistance,
        });
        res.status(201).json(trip);
      } catch (error) {
        res.status(500).json({ message: 'Error saving trip', error });
      }
    })
    .on('error', (error) => {
      console.error('Error reading CSV file:', error);
      res.status(500).json({ message: 'Error reading CSV file', error });
    });
};

// Get all trips for the logged-in user
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }); // Fetch trips by user ID
    if (!trips || trips.length === 0) {
      return res.status(404).json({ message: 'No trips found for this user' });
    }
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trips', error });
  }
};

// Get trip details by ID
exports.getTripDetails = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trip', error });
  }
};
