/* ==========================================================
   PROFILE SETTINGS
   ========================================================== */
document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.currentUser();
  if (!user) return;

  const defaultBg = 'images/backdrops/dune2.jpg';
  
  // Заполняем поля
  document.getElementById('setName').value = user.name || '';
  document.getElementById('setAvatar').value = user.avatar || 'https://i.pravatar.cc/120?img=12';
  document.getElementById('setBgImage').value = user.bgImage || defaultBg;
  
  if (user.avatar) document.getElementById('headerAvatar').src = user.avatar;
  if (user.level) document.getElementById('headerLevel').textContent = 'Lv ' + user.level;

  // Генерация готовых фонов (берем постеры или кадры)
  const bgGrid = document.getElementById('bgGrid');
  const bgs = [
    'images/backdrops/dune2.jpg',
    'images/backdrops/matrix.jpg',
    'images/backdrops/interstellar.jpg',
    'images/backdrops/joker.jpg',
    'images/backdrops/oppenheimer.jpg',
    'images/posters/avatar.jpg',
    'images/posters/darkknight.jpg',
    'images/posters/godfather.jpg'
  ];
  
  bgGrid.innerHTML = bgs.map(src => `
    <div class="bg-option ${src === (user.bgImage || defaultBg) ? 'active' : ''}" 
         style="background-image: url('${src}')"
         data-src="${src}"></div>
  `).join('');

  bgGrid.querySelectorAll('.bg-option').forEach(opt => {
    opt.addEventListener('click', () => {
      bgGrid.querySelectorAll('.bg-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      document.getElementById('setBgImage').value = opt.dataset.src;
    });
  });

  // Топ-5 фильмов
  const topList = document.getElementById('topList');
  let currentTop = user.top5 || [];
  
  // Создаем 5 селектов
  for (let i = 0; i < 5; i++) {
    const div = document.createElement('div');
    div.className = 'top-item';
    div.innerHTML = `
      <div class="top-num">${i + 1}</div>
      <select class="search" style="width:100%;margin:0;" id="topSelect${i}">
        <option value="">-- Не выбрано --</option>
        ${ALL_CONTENT.slice(0, 100).map(m => `<option value="${m.id}">${m.title} (${m.year})</option>`).join('')}
      </select>
    `;
    topList.appendChild(div);
    
    // Устанавливаем значение, если есть
    const select = document.getElementById(`topSelect${i}`);
    if (currentTop[i]) select.value = currentTop[i];
  }

  // Сохранение
  document.getElementById('btnSaveProfile').addEventListener('click', () => {
    const newAvatar = document.getElementById('setAvatar').value.trim();
    const newBg = document.getElementById('setBgImage').value.trim();
    const newName = document.getElementById('setName').value.trim();
    
    const newTop = [];
    for (let i = 0; i < 5; i++) {
      const val = document.getElementById(`topSelect${i}`).value;
      if (val) newTop.push(val);
    }

    Auth.saveCurrentUser({
      name: newName,
      avatar: newAvatar,
      bgImage: newBg,
      top5: newTop
    });

    alert('Профиль успешно обновлён!');
    window.location.href = 'profile.html';
  });
});