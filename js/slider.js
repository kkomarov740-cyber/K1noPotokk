/* ==========================================================
   HERO SLIDER with VIDEO BACKGROUNDS (Auto-slide every 2m 15s)
   ========================================================== */

let heroIndex = 0;
let heroTimer = null;

function initHeroSlider() {
  const hero = document.getElementById('hero');
  if (!hero || typeof HERO_SLIDES === 'undefined') return;
  const dots = document.getElementById('heroDots');

  hero.insertAdjacentHTML('afterbegin', HERO_SLIDES.map((s, i) => {
    // Если есть ссылка на трейлер, делаем видео, иначе — картинку
    const mediaHtml = s.trailerUrl 
      ? `<video class="hero-video" src="${s.trailerUrl}" autoplay muted loop playsinline poster="${s.bg}"></video>
         <div class="video-controls">
           <button class="vid-btn toggle-sound" title="Включить звук">🔇</button>
           <button class="vid-btn toggle-pause" title="Пауза">⏸</button>
           <button class="vid-btn toggle-fullscreen" title="На весь экран">⛶</button>
         </div>`
      : `<div class="hero-bg" style="background-image:url('${s.bg}')"></div>`;

    return `
      <div class="hero-slide ${i === 0 ? 'active' : ''}">
        ${mediaHtml}
        <div class="hero-content">
          <h1 class="hero-title">${s.title}</h1>
          <div class="hero-tags">
            <span class="hero-tag rating">★ ${s.rating}</span>
            ${s.tags.map(t => `<span class="hero-tag">${t}</span>`).join('')}
            <span class="hero-tag age">${s.age}</span>
          </div>
          <p class="hero-desc">${s.desc}</p>
          <div class="hero-actions">
            <a href="title.html?id=${s.id}" class="btn btn-primary">▶ Смотреть</a>
            <a href="title.html?id=${s.id}" class="btn btn-ghost">Подробнее</a>
          </div>
        </div>
      </div>
    `;
  }).join(''));

  dots.innerHTML = HERO_SLIDES.map((_, i) =>
    `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`
  ).join('');

  document.getElementById('heroPrev').onclick = () => changeSlide(-1);
  document.getElementById('heroNext').onclick = () => changeSlide(1);
  dots.querySelectorAll('.hero-dot').forEach(d =>
    d.onclick = () => goToSlide(+d.dataset.index)
  );

  // Инициализация кнопок управления видео
  document.querySelectorAll('.hero-slide').forEach(slide => {
    const video = slide.querySelector('.hero-video');
    if (!video) return;

    const btnSound = slide.querySelector('.toggle-sound');
    const btnPause = slide.querySelector('.toggle-pause');
    const btnFull = slide.querySelector('.toggle-fullscreen');

    // Если видео не загрузилось (битая ссылка), показываем картинку-постер
    video.addEventListener('error', () => {
      video.style.display = 'none';
      const bg = document.createElement('div');
      bg.className = 'hero-bg';
      bg.style.backgroundImage = `url('${video.poster}')`;
      slide.insertBefore(bg, slide.firstChild);
    });

    // Звук
    btnSound.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      btnSound.textContent = video.muted ? '🔇' : '🔊';
    });

    // Пауза
    btnPause.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.paused) {
        video.play();
        btnPause.textContent = '⏸';
      } else {
        video.pause();
        btnPause.textContent = '▶';
      }
    });

    // На весь экран
    btnFull.addEventListener('click', (e) => {
      e.stopPropagation();
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    });
  });

  // Запускаем первый слайд
  const firstSlide = document.querySelector('.hero-slide.active');
  if (firstSlide) {
    const firstVid = firstSlide.querySelector('.hero-video');
    if (firstVid) {
      firstVid.play().catch(() => {});
    }
  }

  startAutoplay();
  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);
}

function goToSlide(i) {
  heroIndex = (i + HERO_SLIDES.length) % HERO_SLIDES.length;
  document.querySelectorAll('.hero-slide').forEach((el, idx) => {
    const isActive = idx === heroIndex;
    el.classList.toggle('active', isActive);
    
    // Автопауза видео при переключении слайда
    const vid = el.querySelector('.hero-video');
    if (vid) {
      if (isActive) {
        vid.currentTime = 0; // Сбрасываем в начало при переключении
        vid.play().catch(()=>{});
      } else {
        vid.pause();
      }
    }
  });
  document.querySelectorAll('.hero-dot').forEach((el, idx) =>
    el.classList.toggle('active', idx === heroIndex)
  );
}

const changeSlide = d => goToSlide(heroIndex + d);

// Таймер: 2 минуты 15 секунд = 135 секунд = 135000 миллисекунд
function startAutoplay() { heroTimer = setInterval(() => changeSlide(1), 135000); } 
function stopAutoplay()  { clearInterval(heroTimer); }