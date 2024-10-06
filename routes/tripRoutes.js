const express = require('express');
const { uploadTrip, getTripDetails, getAllTrips } = require('../controllers/tripController'); // Ensure correct import
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// POST route to handle CSV upload
router.post('/upload', protect, upload.single('file'), uploadTrip);

// GET route to fetch all trips for the logged-in user
router.get('/', protect, getAllTrips); // Route to get all trips

// GET route to fetch a specific trip by ID
router.get('/:id', protect, getTripDetails); // Route to get trip by ID

module.exports = router;
