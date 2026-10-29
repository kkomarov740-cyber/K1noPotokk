/* ==========================================================
   GRID — рендер карточек с заглушкой на случай ошибки
   ========================================================== */

function renderGrid(containerId, items) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  if (!items || !items.length) {
    grid.innerHTML = `<p style="color:#9a9aad;grid-column:1/-1;">Ничего не найдено</p>`;
    return;
  }

  grid.innerHTML = items.map(m => {
    // Если картинки нет, браузер покажет заглушку с названием
    const fallback = `https://placehold.co/400x600/1a1a24/7c3aed?text=${encodeURIComponent(m.title)}`;
    
    return `
      <a class="card" href="title.html?id=${m.id}">
        <img src="${m.img}" alt="${m.title}" loading="lazy" 
             onerror="this.onerror=null; this.src='${fallback}'">
        <span class="badge-4k">4K</span>
        <div class="card-overlay">
          <div class="card-title">${m.title}</div>
          <div class="card-sub">${m.year} · ★ ${m.rating}</div>
        </div>
      </a>
    `;
  }).join('');
}

function renderPopular() {
  renderGrid('popularGrid', MOVIES.slice(0, 6));
}

function renderCollections() {
  const grid = document.getElementById('collectionsGrid');
  if (!grid) return;

  grid.innerHTML = COLLECTIONS.map(c => `
    <a class="collection-card" href="movies.html?collection=${c.id}">
      <div class="collection-bg" style="background-image:url('${c.img}')"></div>
      <div class="collection-info">
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <span class="collection-count">${c.ids.length} тайтлов →</span>
      </div>
    </a>
  `).join('');
}