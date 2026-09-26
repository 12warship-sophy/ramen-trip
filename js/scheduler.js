function haversine(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function dateRange(start, end) {
  const dates = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().slice(0, 10));
    cur.setDate(cur.getDate() + 1);
  }
  return dates.length ? dates : [start];
}

const TIME_SLOTS = ['09:00', '11:30', '13:00', '15:00', '17:30', '19:00'];

function hasCoords(place) {
  return typeof place.lat === 'number' && typeof place.lng === 'number';
}

/**
 * resolvedFavorites: { lodgings: [], restaurants: [], attractions: [], ramens: [] }
 * each item carries lat/lng/name/id and a `type` field (ramen 항목은 좌표를 못 찾았을 수 있다).
 * Greedy nearest-neighbor ordering keeps same-day items geographically close.
 * 좌표가 없는 항목은 동선 정렬에서만 제외되고, 목록 맨 뒤에 그대로 포함된다.
 */
function generateItinerary(trip, resolvedFavorites) {
  const dates = dateRange(trip.startDate, trip.endDate);
  const lodging = resolvedFavorites.lodgings[0] || null;

  const pool = [
    ...resolvedFavorites.attractions,
    ...resolvedFavorites.restaurants,
    ...(resolvedFavorites.ramens || []),
  ];
  const remaining = pool.filter(hasCoords);
  const noCoords = pool.filter((p) => !hasCoords(p));
  const ordered = [];
  if (remaining.length) {
    let current = remaining.shift();
    ordered.push(current);
    while (remaining.length) {
      remaining.sort((a, b) => haversine(current, a) - haversine(current, b));
      current = remaining.shift();
      ordered.push(current);
    }
  }
  ordered.push(...noCoords);

  const days = dates.map((date) => ({
    date,
    lodging: lodging ? { type: 'lodging', id: lodging.id, name: lodging.name } : null,
    items: [],
  }));

  ordered.forEach((place, idx) => {
    const dayIdx = days.length ? idx % days.length : 0;
    days[dayIdx].items.push({ type: place.type, id: place.id, name: place.name });
  });

  reassignTimes(days);
  return days;
}

function reassignTimes(days) {
  days.forEach((day) => {
    day.items.forEach((item, i) => {
      item.time = TIME_SLOTS[i % TIME_SLOTS.length];
    });
  });
}
