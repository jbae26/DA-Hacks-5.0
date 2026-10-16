// Distances compare map coordinates only; they do not represent a road route,
// transit connection, or travel-time estimate.
const EARTH_RADIUS_MILES = 3958.7613;
const radians = (degrees) => (degrees * Math.PI) / 180;

export function isValidLocation(location) {
  return Boolean(
    location &&
      Number.isFinite(location.lat) &&
      location.lat >= -90 &&
      location.lat <= 90 &&
      Number.isFinite(location.lng) &&
      location.lng >= -180 &&
      location.lng <= 180 &&
      (location.accuracy === undefined ||
        (Number.isFinite(location.accuracy) && location.accuracy >= 0)),
  );
}

function distanceMiles(from, to) {
  const latitudeDelta = radians(to.lat - from.lat);
  // Wrap across the antimeridian, including the equivalent -180/+180 points.
  const longitudeDelta = radians(((to.lng - from.lng + 540) % 360) - 180);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(radians(from.lat)) *
      Math.cos(radians(to.lat)) *
      Math.sin(longitudeDelta / 2) ** 2;
  // Floating-point rounding around antipodal points can otherwise exceed 1.
  const bounded = Math.min(1, Math.max(0, haversine));
  return (
    2 *
    EARTH_RADIUS_MILES *
    Math.atan2(Math.sqrt(bounded), Math.sqrt(1 - bounded))
  );
}

export function closestSampleZone(location, zones) {
  if (!isValidLocation(location) || !Array.isArray(zones)) return null;

  let closest = null;
  for (const zone of zones) {
    if (!isValidLocation(zone)) continue;
    const distance = distanceMiles(location, zone);
    if (!closest || distance < closest.distanceMiles) {
      closest = { zone, distanceMiles: distance };
    }
  }
  return closest;
}

export function locationErrorMessage(error) {
  switch (error?.code) {
    case 1:
      return "Location permission was denied. Allow location access in your browser settings, then try again.";
    case 2:
      return "Your location is currently unavailable. Check that location services are enabled, then try again.";
    case 3:
      return "The location request timed out. Try again when your device has a stronger connection or location signal.";
    default:
      return "Your location could not be determined. Please try again.";
  }
}
