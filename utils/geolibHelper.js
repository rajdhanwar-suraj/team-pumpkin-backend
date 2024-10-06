const geolib = require('geolib');

exports.calculateTotalDistance = (tripData) => {
  return tripData.reduce((acc, curr, idx, arr) => {
    if (idx === 0) return acc;
    const prev = arr[idx - 1];
    const distance = geolib.getDistance(
      { latitude: prev.latitude, longitude: prev.longitude },
      { latitude: curr.latitude, longitude: curr.longitude }
    );
    return acc + distance;
  }, 0);
};
