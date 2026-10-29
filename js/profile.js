/* ==========================================================
   PROFILE WIDGET
   ========================================================== */

function initProfile() {
  const widget  = document.getElementById('profileWidget');
  const trigger = document.getElementById('profileTrigger');
  if (!widget || !trigger) return;

  trigger.addEventListener('click', e => {
    e.stopPropagation();
    widget.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#profileWidget')) widget.classList.remove('open');
  });

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderTab(btn.dataset.tab);
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.logout();
      window.location.href = 'login.html';
    });
  }

  renderTab('achievements');
}

function renderTab(tab) {
  const box = document.getElementById('tabContent');
  if (!box || typeof Player === 'undefined' || !Player) return;

  if (tab === 'achievements') {
    if (!Player.achievements || !Player.achievements.length) {
      box.innerHTML = `<div class="sr-empty">Пока нет достижений</div>`;
      return;
    }
    box.innerHTML = Player.achievements.map(a => `
      <div class="achievement ${a.unlocked ? '' : 'locked'}">
        <div class="ach-icon ${a.unlocked ? a.color : 'gray'}">${a.icon}</div>
        <div class="ach-body"><b>${a.title}</b><span>${a.desc}</span></div>
        <span>${a.unlocked ? '✅' : '🔒'}</span>
      </div>
    `).join('');
  } else {
    if (!Player.quests || !Player.quests.length) {
      box.innerHTML = `<div class="sr-empty">Пока нет квестов</div>`;
      return;
    }
    box.innerHTML = Player.quests.map(q => {
      const pct = Math.round((q.progress / q.max) * 100);
      return `
        <div class="quest">
          <div class="ach-icon purple">🎯</div>
          <div class="ach-body" style="width:100%">
            <b>${q.title}</b>
            <span>${q.progress} / ${q.max}</span>
            <div class="quest-progress"><div style="width:${pct}%"></div></div>
          </div>
        </div>
      `;
    }).join('');
  }
}