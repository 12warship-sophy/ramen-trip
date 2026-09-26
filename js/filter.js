function filterLodgings(list, { city, tier }) {
  return list.filter((item) =>
    (!city || item.city === city) &&
    (!tier || tier === 'all' || item.priceTier === tier)
  );
}

function filterRestaurants(list, { city, genre, capacity }) {
  return list.filter((item) =>
    (!city || item.city === city) &&
    (!genre || genre === 'all' || item.genre === genre) &&
    (!capacity || capacity === 'all' || item.capacity === capacity)
  );
}

function filterAttractions(list, { city, category }) {
  return list.filter((item) =>
    (!city || item.city === city) &&
    (!category || category === 'all' || item.category === category)
  );
}

function filterRamen(list, { city, genre, capacity, waiting, seatType }) {
  return list.filter((item) =>
    (!city || item.city === city) &&
    (!genre || genre === 'all' || item.genre === genre) &&
    (!capacity || capacity === 'all' || item.capacity === capacity) &&
    (!waiting || waiting === 'all' || item.waiting === waiting) &&
    (!seatType || seatType === 'all' || item.seatType === seatType)
  );
}
