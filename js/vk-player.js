/* ==========================================================
   VK VIDEO PLAYER — индивидуальная ссылка для каждого тайтла
   ========================================================== */

function vkEmbedUrl({ ownerId, videoId, hd = 2, autoplay = 1 }) {
  const params = new URLSearchParams({
    oid: ownerId, id: videoId, hd: hd, autoplay: autoplay
  });
  return `https://vk.com/video_ext.php?${params.toString()}`;
}

function getCurrentVideoConfig() {
  const params = new URLSearchParams(location.search);
  const id = params.get('id');

  if (id && typeof findById === 'function') {
    const movie = findById(id);
    if (movie && movie.video && movie.video.ownerId && movie.video.videoId) {
      return {
        ownerId:  movie.video.ownerId,
        videoId:  movie.video.videoId,
        hd:       2,
        autoplay: 1
      };
    }
  }

  return VK_CONFIG;
}

let vkHeartbeatTimer = null;

function initVkPlayer() {
  const placeholder = document.getElementById('vkPlaceholder');
  const holder      = document.getElementById('vkFrameHolder');
  const playBtn     = document.getElementById('vkPlayBtn');
  const fullBtn     = document.getElementById('vkFullscreen');
  const reloadBtn   = document.getElementById('vkReload');

  if (!placeholder || !holder) return;

  const load = () => {
    const cfg = getCurrentVideoConfig();
    placeholder.classList.add('hidden');
    holder.innerHTML = `
      <iframe
        src="${vkEmbedUrl(cfg)}"
        allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
        allowfullscreen referrerpolicy="no-referrer-when-downgrade" frameborder="0"></iframe>
    `;
    showToast('▶️ Просмотр начат — XP начисляется!');
    startWatchHeartbeat();
  };

  placeholder.addEventListener('click', load);
  playBtn?.addEventListener('click', e => { e.stopPropagation(); load(); });

  fullBtn?.addEventListener('click', () => {
    const wrap = document.getElementById('vkPlayerWrap');
    if (!document.fullscreenElement) wrap.requestFullscreen?.();
    else document.exitFullscreen();
  });

  reloadBtn?.addEventListener('click', () => {
    holder.innerHTML = '';
    placeholder.classList.remove('hidden');
    stopWatchHeartbeat();
  });
}

function startWatchHeartbeat() {
  stopWatchHeartbeat();
  vkHeartbeatTimer = setInterval(() => {
    if (document.visibilityState !== 'visible') return;
    document.dispatchEvent(new Event('player:minute'));
  }, 60000);
}

function stopWatchHeartbeat() {
  clearInterval(vkHeartbeatTimer);
  vkHeartbeatTimer = null;
}