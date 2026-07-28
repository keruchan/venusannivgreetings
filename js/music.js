/* =========================================================
   Shared background music — index.html and memories.html both
   include this file. Playback position, current track, and
   play/pause state are saved to sessionStorage as she listens,
   so moving between pages resumes exactly where she left off
   instead of cutting out or restarting the song from zero.
   ========================================================= */

// Songs play in this order, looping back to the first after the last.
// Edit this list to add/remove/reorder songs.
const MUSIC_PLAYLIST = ["audio/song.mp3", "audio/song2.mp3"];

const MUSIC_STATE_KEY = "anniversary_music_state";

(function music() {
  const btn = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-music");
  if (!btn || !audio) return;

  const playlist = MUSIC_PLAYLIST.length ? MUSIC_PLAYLIST : [audio.getAttribute("src")].filter(Boolean);
  if (!playlist.length) return;

  function loadState() {
    try {
      return JSON.parse(sessionStorage.getItem(MUSIC_STATE_KEY));
    } catch {
      return null;
    }
  }

  let lastSavedTime = -1;
  function saveState(force) {
    const t = audio.currentTime || 0;
    if (!force && Math.abs(t - lastSavedTime) < 1) return; // throttle writes
    lastSavedTime = t;
    try {
      sessionStorage.setItem(
        MUSIC_STATE_KEY,
        JSON.stringify({ trackIndex, currentTime: t, playing })
      );
    } catch {}
  }

  const saved = loadState();
  let trackIndex = 0;
  let restoredTime = 0;
  let playing = false;

  // first time this session: nothing saved yet, so try to autoplay from
  // the top. otherwise, pick up exactly where the last page left off.
  const shouldAutoResume = saved ? !!saved.playing : true;
  if (saved && playlist[saved.trackIndex] != null) {
    trackIndex = saved.trackIndex;
    restoredTime = saved.currentTime || 0;
  }

  audio.src = playlist[trackIndex];

  function whenMetadataReady(cb) {
    if (audio.readyState >= 1) cb();
    else audio.addEventListener("loadedmetadata", cb, { once: true });
  }

  audio.addEventListener("ended", () => {
    trackIndex = (trackIndex + 1) % playlist.length;
    audio.src = playlist[trackIndex];
    saveState(true);
    audio.play().catch(() => {});
  });

  audio.addEventListener("timeupdate", () => saveState(false));
  window.addEventListener("pagehide", () => saveState(true));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) saveState(true);
  });

  function setPlayingUI(isPlaying) {
    playing = isPlaying;
    btn.classList.toggle("playing", isPlaying);
    btn.textContent = isPlaying ? "🎶" : "🎵";
    saveState(true);
  }

  function startPlaying() {
    if (playing) return Promise.resolve();
    return audio.play().then(() => setPlayingUI(true));
  }

  function armInteractionFallback() {
    const tryOnInteraction = () => {
      startPlaying().finally(() => {
        document.removeEventListener("click", tryOnInteraction);
        document.removeEventListener("touchstart", tryOnInteraction);
        document.removeEventListener("keydown", tryOnInteraction);
      });
    };
    document.addEventListener("click", tryOnInteraction, { once: true });
    document.addEventListener("touchstart", tryOnInteraction, { once: true });
    document.addEventListener("keydown", tryOnInteraction, { once: true });
  }

  btn.addEventListener("click", () => {
    if (!playing) {
      startPlaying().catch(() => {
        btn.textContent = "🔇";
        setTimeout(() => (btn.textContent = "🎵"), 1200);
      });
    } else {
      audio.pause();
      setPlayingUI(false);
    }
  });

  whenMetadataReady(() => {
    if (restoredTime > 0 && isFinite(audio.duration) && restoredTime < audio.duration) {
      audio.currentTime = restoredTime;
    }
    if (shouldAutoResume) {
      startPlaying().catch(armInteractionFallback);
    }
  });
})();
