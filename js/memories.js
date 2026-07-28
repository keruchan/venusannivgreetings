/* =========================================================
   Our Memories — scrapbook slideshow.
   Plays automatically through the photos in images/memories/
   (SEED_PHOTOS below). Purely for viewing — no adding or
   removing photos here; drop files in that folder and adjust
   the count below if you want to change the set later.
   ========================================================= */

// Auto-generated from images/memories/ — memory-01.jpg ... memory-45.jpg
// (memory-20 is a .png, the rest are .jpg).
const SEED_PHOTOS = Array.from({ length: 45 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  const ext = n === "20" ? "png" : "jpg";
  return `images/memories/memory-${n}.${ext}`;
});

(function memoriesPage() {
  const photos = SEED_PHOTOS;

  const frame = document.getElementById("mem-frame");
  const img = document.getElementById("mem-img");
  const caption = document.getElementById("mem-caption");
  const prevBtn = document.getElementById("mem-prev");
  const nextBtn = document.getElementById("mem-next");
  const autoplayBtn = document.getElementById("mem-autoplay");
  const thumbStrip = document.getElementById("thumb-strip");

  if (window.startParticleField) {
    startParticleField(document.getElementById("ambient-particles"));
    startParticleField(document.getElementById("mem-sparkles"), {
      symbols: ["✨", "💫", "🌸", "💕"],
      count: 5,
      minOpacity: 0.12,
      maxOpacity: 0.28,
      minSize: 12,
      maxSize: 18,
      minDuration: 7000,
      maxDuration: 12000,
      spawnEvery: 2200,
    });
  }

  let index = photos.length ? 0 : -1;
  let autoplayTimer = null;

  function tiltClass(i) {
    return ["tilt-a", "tilt-b", "tilt-c"][i % 3];
  }

  function renderStage() {
    const has = index >= 0 && photos[index];
    frame.classList.toggle("has-photo", !!has);
    frame.classList.remove("tilt-a", "tilt-b", "tilt-c");
    if (has) frame.classList.add(tiltClass(index));
    img.src = has ? photos[index] : "";
    caption.textContent = has ? `Memory ${index + 1} of ${photos.length}` : "";
    prevBtn.disabled = photos.length < 2;
    nextBtn.disabled = photos.length < 2;
    autoplayBtn.style.visibility = photos.length < 2 ? "hidden" : "visible";
  }

  function renderThumbs() {
    thumbStrip.innerHTML = "";
    photos.forEach((src, i) => {
      const thumb = document.createElement("div");
      thumb.className = "thumb" + (i === index ? " active" : "");

      const thumbImg = document.createElement("img");
      thumbImg.src = src;
      thumbImg.alt = "memory thumbnail";

      thumb.appendChild(thumbImg);
      thumbStrip.appendChild(thumb);

      thumb.addEventListener("click", () => goTo(i));
    });
  }

  function highlightThumb() {
    Array.from(thumbStrip.querySelectorAll(".thumb")).forEach((el, i) => {
      el.classList.toggle("active", i === index);
    });
    const active = thumbStrip.querySelector(".thumb.active");
    if (active) active.scrollIntoView({ inline: "center", behavior: "smooth", block: "nearest" });
  }

  /* ---- scrapbook-style swap transition: old photo slides/rotates
     off the page, the new one plops on from the other side ---- */
  function animateSwap(direction, updateFn) {
    if (!frame.classList.contains("has-photo") || !img.src) {
      updateFn();
      renderStage();
      return;
    }
    const exit = img.animate(
      [
        { transform: "translateX(0) rotate(0deg) scale(1)", opacity: 1 },
        { transform: `translateX(${direction * -50}px) rotate(${direction * -8}deg) scale(0.92)`, opacity: 0 },
      ],
      { duration: 200, easing: "ease-in" }
    );
    exit.onfinish = () => {
      updateFn();
      renderStage();
      img.animate(
        [
          { transform: `translateX(${direction * 50}px) rotate(${direction * 7}deg) scale(0.9)`, opacity: 0 },
          { transform: "translateX(0) rotate(0deg) scale(1.03)", opacity: 1, offset: 0.75 },
          { transform: "translateX(0) rotate(0deg) scale(1)", opacity: 1 },
        ],
        { duration: 420, easing: "cubic-bezier(.2,.8,.3,1.1)" }
      );
    };
  }

  function goTo(i) {
    if (i === index || !photos.length) return;
    const direction = i > index ? 1 : -1;
    animateSwap(direction, () => {
      index = i;
    });
    highlightThumb();
  }

  function showNext() {
    if (photos.length < 2) return;
    goTo((index + 1) % photos.length);
  }
  function showPrev() {
    if (photos.length < 2) return;
    goTo((index - 1 + photos.length) % photos.length);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    autoplayBtn.classList.remove("active");
    autoplayBtn.textContent = "▶";
  }
  function startAutoplay() {
    if (autoplayTimer || photos.length < 2) return;
    autoplayTimer = setInterval(showNext, 3200);
    autoplayBtn.classList.add("active");
    autoplayBtn.textContent = "⏸";
  }
  function toggleAutoplay() {
    if (autoplayTimer) stopAutoplay();
    else startAutoplay();
  }

  prevBtn.addEventListener("click", () => { stopAutoplay(); showPrev(); });
  nextBtn.addEventListener("click", () => { stopAutoplay(); showNext(); });
  autoplayBtn.addEventListener("click", toggleAutoplay);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { stopAutoplay(); showNext(); }
    if (e.key === "ArrowLeft") { stopAutoplay(); showPrev(); }
  });

  // swipe support on the photo frame
  let touchStartX = null;
  frame.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  frame.addEventListener("touchend", (e) => {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { stopAutoplay(); (dx < 0 ? showNext() : showPrev()); }
    touchStartX = null;
  }, { passive: true });

  renderStage();
  renderThumbs();
  startAutoplay();
})();
