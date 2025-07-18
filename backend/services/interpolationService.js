// 📁 services/interpolationService.js

// 🔹 Linearly interpolate between two price points
// t should be between 0 and 1 (e.g. 0.5 for midpoint)
exports.interpolatePrice = (price1, price2, t) => {
  const p1 = parseFloat(price1);
  const p2 = parseFloat(price2);
  return ((1 - t) * p1 + t * p2).toFixed(3);
};
