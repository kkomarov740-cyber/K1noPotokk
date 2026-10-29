let Player = null;

const XP_RULES = {
  MINUTE_WATCHED: 5,
  MOVIE_FINISHED: 150,
  SERIES_EPISODE: 40
};

const xpForLevel = lvl => Math.floor(1000 + lvl * 90);

function initGamification() {
  const user = Auth.currentUser();
  if (!user) return;

  Player = {
    name: user.name,
    level: user.level || 1,
    xp: user.xp || 0,
    xpToNext: user.xpToNext || xpForLevel(user.level || 1),
    hoursWatched: user.hoursWatched || 0,
    moviesWatched: user.moviesWatched || 0,
    seriesWatched: user.seriesWatched || 0,
    episodesWatched: user.episodesWatched || 0,
    dailyWatched: user.dailyWatched || 0,
    achievements: user.achievements || [],
    completedQuests: user.completedQuests || []
  };

  // Обработка квестов при событиях
  document.addEventListener('player:minute', () => {
    Player.hoursWatched += 1 / 60;
    Player.dailyWatched += 1 / 60;
    addXP(XP_RULES.MINUTE_WATCHED);
    checkQuests('hours');
  });
  
  document.addEventListener('player:finished', () => {
    Player.moviesWatched++;
    Player.dailyWatched++;
    addXP(XP_RULES.MOVIE_FINISHED);
    checkQuests('total_watched');
    checkQuests('movies');
    checkQuests('daily_watched');
    persistPlayer();
  });

  updateProfileUI();
}

function checkQuests(type) {
  if (typeof window.QUESTS === 'undefined' || !Player) return;
  
  const relevant = QUESTS.filter(q => q.type === type && !Player.completedQuests.includes(q.id));
  
  relevant.forEach(q => {
    let val = 0;
    if (type === 'hours') val = Player.hoursWatched;
    if (type === 'total_watched') val = Player.moviesWatched + Player.seriesWatched;
    if (type === 'movies') val = Player.moviesWatched;
    if (type === 'daily_watched') val = Player.dailyWatched;
    if (type === 'episodes') val = Player.episodesWatched;
    
    if (val >= q.target) {
      Player.completedQuests.push(q.id);
      addXP(q.xp);
      showToast(`🎯 Квест выполнен: ${q.title} (+${q.xp} XP)`);
    }
  });
}

function addXP(amount) {
  if (!Player) return;
  Player.xp += amount;
  while (Player.xp >= Player.xpToNext) {
    Player.xp -= Player.xpToNext;
    Player.level += 1;
    Player.xpToNext = xpForLevel(Player.level);
    showToast(`🎉 Новый уровень: ${Player.level}!`);
  }
  updateProfileUI();
  persistPlayer();
}

function persistPlayer() {
  if (!Player) return;
  Auth.saveCurrentUser({
    level: Player.level,
    xp: Player.xp,
    xpToNext: Player.xpToNext,
    hoursWatched: Player.hoursWatched,
    moviesWatched: Player.moviesWatched,
    seriesWatched: Player.seriesWatched,
    episodesWatched: Player.episodesWatched,
    dailyWatched: Player.dailyWatched,
    completedQuests: Player.completedQuests
  });
}

function updateProfileUI() {
  if (!Player) return;
  const pct = Math.min(100, (Player.xp / Player.xpToNext) * 100);
  setText('lvlValue', Player.level);
  setText('xpText', `${Player.xp} / ${Player.xpToNext} XP`);
  setText('xpLeft', Player.xpToNext - Player.xp);
  setText('statHours', Math.round(Player.hoursWatched));
  setText('statMovies', Player.moviesWatched);
  setText('statSeries', Player.seriesWatched);
  
  const fill = document.getElementById('xpFill');
  if (fill) fill.style.width = pct + '%';
  const pill = document.querySelector('.level-pill');
  if (pill) pill.textContent = 'Lv ' + Player.level;
  const nameEl = document.querySelector('.user-name');
  if (nameEl && Player.name) nameEl.textContent = Player.name;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}