/* ==========================================================
   DROPDOWNS
   ========================================================== */

function initDropdowns() {
  document.querySelectorAll('.nav-item.has-dropdown').forEach(item => {
    const link = item.querySelector('.nav-link');
    link?.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-item.open')
        .forEach(i => i !== item && i.classList.remove('open'));
      item.classList.toggle('open');
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-item.has-dropdown')) {
      document.querySelectorAll('.nav-item.open').forEach(i => i.classList.remove('open'));
    }
  });
}