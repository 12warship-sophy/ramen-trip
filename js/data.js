const dataCache = {};

async function loadData(name) {
  if (dataCache[name]) return dataCache[name];
  const res = await fetch(`./data/${name}.json`);
  const json = await res.json();
  dataCache[name] = json;
  return json;
}

const TYPE_TO_FILE = {
  lodging: 'lodgings',
  restaurant: 'restaurants',
  attraction: 'attractions',
};

const TYPE_LABEL = {
  lodging: '숙소',
  restaurant: '맛집',
  attraction: '명소',
  ramen: '라멘',
};

const TYPE_ICON = {
  lodging: '🏨',
  restaurant: '🍽️',
  attraction: '📍',
  ramen: '🍜',
};

// 라멘은 fetch(JSON)이 아니라 js/ramen-data.js의 전역 변수 RAMEN_SHOPS에서 바로 가져온다.
async function findPlace(type, id) {
  if (type === 'ramen') {
    return (typeof RAMEN_SHOPS !== 'undefined' ? RAMEN_SHOPS : []).find((item) => item.id === id) || null;
  }
  const list = await loadData(TYPE_TO_FILE[type]);
  return list.find((item) => item.id === id) || null;
}
