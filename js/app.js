/* ==========================================================
   APP ENTRY
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  if (location.pathname.endsWith('login.html')) return;

  if (typeof Auth !== 'undefined' && !Auth.isLoggedIn()) {
    window.location.href = 'login.html';
    return;
  }

  if (typeof initDropdowns    === 'function') initDropdowns();
  if (typeof initProfile      === 'function') initProfile();
  if (typeof initGamification === 'function') initGamification();
  if (typeof initSearch       === 'function') initSearch();

  if (document.getElementById('hero') && typeof initHeroSlider === 'function') initHeroSlider();
  if (document.getElementById('popularGrid') && typeof renderPopular === 'function') renderPopular();
  if (document.getElementById('collectionsGrid') && typeof renderCollections === 'function') renderCollections();

  if (document.getElementById('vkPlaceholder')) {
    if (typeof initTitlePage === 'function') initTitlePage();
    if (typeof initVkPlayer  === 'function') initVkPlayer();
  }

  if (document.getElementById('moviesGrid') && typeof renderGrid === 'function') renderGrid('moviesGrid', MOVIES);
  if (document.getElementById('seriesGrid') && typeof renderGrid === 'function') renderGrid('seriesGrid', SERIES);

  // ================= КНОПКА "НАВЕРХ" =================
  const scrollBtn = document.getElementById('scrollToTop');
  if (scrollBtn) {
    // Показываем кнопку, когда пользователь прокрутил 300px вниз
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    // Плавный скролл наверх при клике
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});