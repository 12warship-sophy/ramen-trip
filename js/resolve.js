const RESOLVE_KEY_MAP = { lodging: 'lodgings', restaurant: 'restaurants', attraction: 'attractions', ramen: 'ramens' };

async function resolveFavorites(trip) {
  const [lodgings, restaurants, attractions] = await Promise.all([
    loadData('lodgings'),
    loadData('restaurants'),
    loadData('attractions'),
  ]);
  const ramenShops = typeof RAMEN_SHOPS !== 'undefined' ? RAMEN_SHOPS : [];
  const byType = { lodging: lodgings, restaurant: restaurants, attraction: attractions, ramen: ramenShops };
  const grouped = { lodgings: [], restaurants: [], attractions: [], ramens: [] };

  trip.favorites.forEach((fav) => {
    const list = byType[fav.type];
    const item = list && list.find((p) => p.id === fav.id);
    if (item) {
      // itinerary/scheduler는 공통으로 item.name을 사용하므로 라멘도 이름 별칭을 맞춰준다
      const withName = fav.type === 'ramen' ? { ...item, name: item.nameKo } : { ...item };
      grouped[RESOLVE_KEY_MAP[fav.type]].push({ ...withName, type: fav.type });
    }
  });

  return grouped;
}

function placedIdsInDays(trip) {
  const placed = new Set();
  trip.days.forEach((day) => {
    day.items.forEach((item) => placed.add(`${item.type}:${item.id}`));
  });
  return placed;
}
