function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(() => {});
  }
}

function qs(param) {
  return new URLSearchParams(location.search).get(param);
}

function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), 2000);
}

function formatDateRange(start, end) {
  if (!start || !end) return '';
  return `${start} ~ ${end}`;
}

// 라멘 짠맛/진한맛처럼 1~5 단계를 막대(점)로 표시할 때 공통으로 쓴다.
function barIndicator(level) {
  const n = Math.max(0, Math.min(5, Number(level) || 0));
  return '●'.repeat(n) + '○'.repeat(5 - n);
}

function isStaleVisit(dateStr, months = 12) {
  if (!dateStr) return false;
  const visited = new Date(dateStr).getTime();
  if (Number.isNaN(visited)) return false;
  const cutoff = months * 30 * 24 * 60 * 60 * 1000;
  return Date.now() - visited > cutoff;
}

function wireNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  const tripId = qs('trip') || getCurrentTripId();

  document.querySelectorAll('.bottom-nav a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === page) a.classList.add('active');

    if (a.hasAttribute('data-trip-aware') && tripId) {
      const url = new URL(href, location.href);
      url.searchParams.set('trip', tripId);
      a.setAttribute('href', `${url.pathname}${url.search}`);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  registerServiceWorker();
  wireNav();
});
