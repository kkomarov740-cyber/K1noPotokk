/* ==========================================================
   AUTH — вход, регистрация, сессия
   ========================================================== */

const Auth = (() => {
  const USERS_KEY   = 'kinopotok_users';
  const SESSION_KEY = 'kinopotok_session';

  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '{}'); }
    catch { return {}; }
  }
  function saveUsers(u) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); }
    catch { return null; }
  }
  function setSession(name) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ name, since: Date.now() }));
  }
  function logout() { localStorage.removeItem(SESSION_KEY); }

  function register(name, password) {
    name = name.trim();
    if (name.length < 3) return { ok:false, error:'Логин минимум 3 символа' };
    if (password.length < 4) return { ok:false, error:'Пароль минимум 4 символа' };
    const users = getUsers();
    if (users[name]) return { ok:false, error:'Такой логин уже занят' };
    users[name] = {
      name, password, createdAt: Date.now(),
      level: 1, xp: 0, xpToNext: 1000,
      hoursWatched: 0, moviesWatched: 0, seriesWatched: 0,
      achievements: [], quests: []
    };
    saveUsers(users);
    setSession(name);
    return { ok:true };
  }

  function login(name, password) {
    name = name.trim();
    const users = getUsers();
    const user = users[name];
    if (!user) return { ok:false, error:'Пользователь не найден' };
    if (user.password !== password) return { ok:false, error:'Неверный пароль' };
    setSession(name);
    return { ok:true };
  }

  function currentUser() {
    const s = getSession();
    if (!s || !s.name) return null;
    const users = getUsers();
    return users[s.name] || null;
  }

  function saveCurrentUser(updated) {
    const s = getSession();
    if (!s) return;
    const users = getUsers();
    users[s.name] = { ...users[s.name], ...updated };
    saveUsers(users);
  }

  function isLoggedIn() { return currentUser() !== null; }

  return { register, login, logout, currentUser, saveCurrentUser, isLoggedIn };
})();

// Глобальное обновление аватарок в шапке и меню при загрузке
document.addEventListener('DOMContentLoaded', () => {
  const user = Auth.currentUser();
  if (user && user.avatar) {
    // Обновляем маленькую аватарку
    document.querySelectorAll('.avatar').forEach(img => {
      img.src = user.avatar;
    });
    // Обновляем большую аватарку в меню
    document.querySelectorAll('.avatar-lg').forEach(img => {
      img.src = user.avatar;
    });
  }
});