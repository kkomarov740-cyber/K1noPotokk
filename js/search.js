/* ==========================================================
   SEARCH — живой поиск
   ========================================================== */

function initSearch() {
  const input = document.querySelector('.search');
  if (!input) return;

  const box = document.createElement('div');
  box.className = 'search-results';
  input.parentElement.style.position = 'relative';
  input.parentElement.appendChild(box);

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { box.classList.remove('open'); return; }

    const results = ALL_CONTENT.filter(x => {
      const hay = [x.title, String(x.year), x.genre, x.desc].join(' ').toLowerCase();
      return hay.includes(q);
    }).slice(0, 8);

    if (!results.length) {
      box.innerHTML = `<div class="sr-empty">Ничего не найдено</div>`;
    } else {
      box.innerHTML = results.map(m => `
        <a class="sr-item" href="title.html?id=${m.id}">
          <img src="${m.img}" alt=""
               onerror="this.onerror=null;this.src='https://placehold.co/100x150/1a1a24/7c3aed?text='">
          <div>
            <b>${m.title}</b>
            <span>${m.year} · ${m.genre}</span>
          </div>
        </a>
      `).join('');
    }
    box.classList.add('open');
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = input.value.trim().toLowerCase();
      const first = ALL_CONTENT.find(x => x.title.toLowerCase().includes(q));
      if (first) window.location.href = `title.html?id=${first.id}`;
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search') && !e.target.closest('.search-results')) {
      box.classList.remove('open');
    }
  });
}