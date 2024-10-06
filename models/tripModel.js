const mongoose = require('mongoose');

const tripSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tripData: [
    {
      latitude: Number,
      longitude: Number,
      timestamp: Date,
    },
  ],
  totalDistance: Number,
  totalStoppageTime: Number,
  totalIdlingTime: Number,
}, {
  timestamps: true,
});

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;
