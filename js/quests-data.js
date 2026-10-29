/* ==========================================================
   QUESTS DATABASE (1000 шт.)
   ========================================================== */

const QUESTS = [];

// 1. Квесты на время (1-100)
for (let i = 1; i <= 100; i++) {
  QUESTS.push({
    id: `time_${i}`,
    title: `Посмотреть ${i} часов кино`,
    desc: `Суммарное время просмотра: ${i}ч`,
    type: 'hours',
    target: i,
    xp: i * 50,
    icon: '⏱'
  });
}

// 2. Квесты на количество (1-200)
for (let i = 1; i <= 200; i++) {
  QUESTS.push({
    id: `count_${i}`,
    title: `Посмотреть ${i} тайтлов`,
    desc: `Фильмы и сериалы вместе`,
    type: 'total_watched',
    target: i,
    xp: i * 20,
    icon: '🍿'
  });
}

// 3. Квесты на сериалы (1-150)
for (let i = 1; i <= 150; i++) {
  QUESTS.push({
    id: `series_${i}`,
    title: `Посмотреть ${i} серий`,
    desc: `Любых сериалов`,
    type: 'episodes',
    target: i,
    xp: i * 15,
    icon: '📺'
  });
}

// 4. Квесты на фильмы (1-150)
for (let i = 1; i <= 150; i++) {
  QUESTS.push({
    id: `movie_${i}`,
    title: `Посмотреть ${i} фильмов`,
    desc: `Полнометражные фильмы`,
    type: 'movies',
    target: i,
    xp: i * 25,
    icon: '🎬'
  });
}

// 5. Квесты на день (1-50)
for (let i = 1; i <= 50; i++) {
  QUESTS.push({
    id: `daily_${i}`,
    title: `Посмотреть ${i} тайтлов за сегодня`,
    desc: `Сброс каждые 24 часа`,
    type: 'daily_watched',
    target: i,
    xp: i * 40,
    icon: '🔥'
  });
}

// 6. Квесты на подборки и франшизы (1-350)
const franchises = [
  { id: 'spiderman', name: 'Человек-паук' },
  { id: 'fastall', name: 'Форсаж' },
  { id: 'pirates', name: 'Пираты Карибского моря' },
  { id: 'tvd', name: 'Дневники вампира' },
  { id: 'theboys', name: 'Пацаны' },
  { id: 'invincible', name: 'Неуязвимый' },
  { id: 'rickandmorty', name: 'Рик и Морти' },
  { id: 'brooklyn99', name: 'Бруклин 9-9' },
  { id: 'scrubs', name: 'Клиника' }
];

let franchiseCount = 0;
for (const fr of franchises) {
  for (let i = 1; i <= 40 && franchiseCount < 350; i++) {
    QUESTS.push({
      id: `fran_${fr.id}_${i}`,
      title: `Посмотреть ${i} частей/серий из «${fr.name}»`,
      desc: `Франшиза: ${fr.name}`,
      type: 'franchise',
      target: i,
      franchise: fr.id,
      xp: i * 30,
      icon: '🏆'
    });
    franchiseCount++;
  }
}

// Добиваем до ровно 1000 квестов, если не хватило
while (QUESTS.length < 1000) {
  const i = QUESTS.length;
  QUESTS.push({
    id: `extra_${i}`,
    title: `Секретный квест #${i}`,
    desc: `Особое достижение`,
    type: 'secret',
    target: 1,
    xp: 100,
    icon: '❓'
  });
}

window.QUESTS = QUESTS;