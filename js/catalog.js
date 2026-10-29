/* ==========================================================
   CATALOG — расширенная база + фильтры
   ========================================================== */

const CATALOG = MOVIES.map(m => ({
  ...m,
  genres: [m.genre],
  originalTitle: m.title,
  legalWatchUrl: 'https://www.kinopoisk.ru/'
}));

function searchCatalog(query) {
  const q = query.trim().toLowerCase();
  if (!q) return CATALOG;
  return CATALOG.filter(m => {
    const haystack = [m.title, m.originalTitle || '', String(m.year), ...(m.genres || []), m.desc || '']
      .join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

function filterByGenre(genre) {
  const list = CATALOG.filter(m => m.genres.includes(genre));
  renderGrid('popularGrid', list);
}
function filterByYear(year) {
  const list = CATALOG.filter(m => String(m.year) === String(year));
  renderGrid('popularGrid', list);
}

function loadIntoPlayer(id) {
  const movie = findById(id);
  if (!movie) return;
  window.location.href = `title.html?id=${movie.id}`;
}

function bindPlayerToXP() {
  const v = document.getElementById('mainPlayer');
  if (!v) return;

  let lastTick = 0;
  v.addEventListener('timeupdate', () => {
    const now = Math.floor(v.currentTime);
    if (now === lastTick) return;
    lastTick = now;
    if (now % 60 === 0) document.dispatchEvent(new Event('player:minute'));
  });
  v.addEventListener('ended', () => {
    document.dispatchEvent(new Event('player:finished'));
  });
}