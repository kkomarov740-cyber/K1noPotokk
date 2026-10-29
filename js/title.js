/* ==========================================================
   TITLE PAGE
   ========================================================== */

function initTitlePage() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id') || 'matrix';
  const movie = findById(id) || MOVIES[0];

  const bg = document.getElementById('titleHeroBg');
  const p  = document.getElementById('titlePoster');
  const n  = document.getElementById('titleName');
  const t  = document.getElementById('titleTags');
  const d  = document.getElementById('titleDesc');

  if (bg) bg.style.backgroundImage = `url('${movie.bg}')`;
  if (p)  p.src = movie.img;
  if (n)  n.textContent = movie.title;
  if (t)  t.innerHTML = `
    <span class="hero-tag rating">★ ${movie.rating}</span>
    <span class="hero-tag">${movie.genre}</span>
    <span class="hero-tag">${movie.year}</span>
    <span class="hero-tag">${movie.duration}</span>
    <span class="hero-tag age">${movie.age}</span>
  `;
  if (d)  d.textContent = movie.desc;

  const vkPoster = document.getElementById('vkPoster');
  if (vkPoster) vkPoster.src = movie.img;

  document.getElementById('btnPlay')?.addEventListener('click', () => {
    document.getElementById('playerSection')?.scrollIntoView({ behavior:'smooth' });
    setTimeout(() => document.getElementById('vkPlaceholder')?.click(), 500);
  });

  const btnFav = document.getElementById('btnFav');
  if (btnFav) {
    const favs = JSON.parse(localStorage.getItem('favs') || '[]');
    if (favs.includes(movie.id)) btnFav.textContent = '♥ В избранном';

    btnFav.addEventListener('click', () => {
      const list = JSON.parse(localStorage.getItem('favs') || '[]');
      const i = list.indexOf(movie.id);
      if (i === -1) {
        list.push(movie.id);
        btnFav.textContent = '♥ В избранном';
        showToast('❤️ Добавлено в избранное');
      } else {
        list.splice(i, 1);
        btnFav.textContent = '♡ В избранное';
        showToast('Удалено из избранного');
      }
      localStorage.setItem('favs', JSON.stringify(list));
    });
  }

  const similar = ALL_CONTENT
    .filter(x => x.id !== movie.id && x.genre === movie.genre)
    .slice(0, 6);
  if (similar.length) renderGrid('similarGrid', similar);

  document.title = `${movie.title} — КиноПоток`;
}