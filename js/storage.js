const TRIPS_KEY = 'travelGuidebook.trips';
const CURRENT_TRIP_KEY = 'travelGuidebook.currentTripId';

function readTrips() {
  try {
    const raw = localStorage.getItem(TRIPS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeTrips(trips) {
  localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

function getTrips() {
  return readTrips().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getTrip(id) {
  return readTrips().find((t) => t.id === id) || null;
}

function createTrip({ city, cityName, startDate, endDate }) {
  const trip = {
    id: `trip-${Date.now()}`,
    city,
    cityName,
    startDate,
    endDate,
    favorites: [],
    days: [],
    createdAt: new Date().toISOString(),
  };
  const trips = readTrips();
  trips.push(trip);
  writeTrips(trips);
  setCurrentTripId(trip.id);
  return trip;
}

function saveTrip(trip) {
  const trips = readTrips();
  const idx = trips.findIndex((t) => t.id === trip.id);
  if (idx >= 0) trips[idx] = trip;
  else trips.push(trip);
  writeTrips(trips);
}

function deleteTrip(id) {
  writeTrips(readTrips().filter((t) => t.id !== id));
  if (getCurrentTripId() === id) {
    localStorage.removeItem(CURRENT_TRIP_KEY);
  }
}

function setCurrentTripId(id) {
  localStorage.setItem(CURRENT_TRIP_KEY, id);
}

function getCurrentTripId() {
  return localStorage.getItem(CURRENT_TRIP_KEY);
}

function isFavorite(trip, type, id) {
  return trip.favorites.some((f) => f.type === type && f.id === id);
}

function toggleFavorite(trip, type, id) {
  const exists = isFavorite(trip, type, id);
  if (exists) {
    trip.favorites = trip.favorites.filter((f) => !(f.type === type && f.id === id));
    trip.days.forEach((day) => {
      day.items = day.items.filter((item) => !(item.type === type && item.id === id));
    });
  } else {
    trip.favorites.push({ type, id });
  }
  saveTrip(trip);
  return !exists;
}
