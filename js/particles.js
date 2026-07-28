/* =========================================================
   Ambient floating particles — hearts, flowers, sparkles.
   Reusable on any page: point it at a full-screen fixed div
   for a background effect, or at a small relatively-positioned
   (and overflow:hidden) element — like a photo frame — for a
   subtle, contained effect that drifts in front of the content.
   ========================================================= */

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function spawnParticle(container, opts) {
  const el = document.createElement("span");
  el.className = "amb-particle";
  el.textContent = opts.symbols[Math.floor(Math.random() * opts.symbols.length)];

  const size = rand(opts.minSize, opts.maxSize);
  const opacity = rand(opts.minOpacity, opts.maxOpacity);
  const duration = rand(opts.minDuration, opts.maxDuration);
  const startX = rand(0, container.clientWidth || window.innerWidth);
  const drift = rand(-60, 60);
  const rotate = rand(-40, 40);
  const h = container.clientHeight || window.innerHeight;

  el.style.fontSize = size + "px";
  el.style.left = startX + "px";
  el.style.top = h + size + "px";
  container.appendChild(el);

  const anim = el.animate(
    [
      { transform: "translate(0, 0) rotate(0deg)", opacity: 0 },
      { transform: `translate(${drift * 0.4}px, ${-h * 0.5}px) rotate(${rotate * 0.5}deg)`, opacity, offset: 0.15 },
      { transform: `translate(${drift}px, ${-(h + size * 2)}px) rotate(${rotate}deg)`, opacity: 0 },
    ],
    { duration, easing: "linear" }
  );
  anim.onfinish = () => el.remove();
}

/**
 * Continuously spawns floating particles inside `container`.
 * container: a positioned element (fixed full-screen, or a
 *            relatively-positioned + overflow:hidden box).
 */
function startParticleField(container, options) {
  if (!container) return;
  const opts = Object.assign(
    {
      symbols: ["💕", "💗", "🌸", "✨", "🌷", "💫"],
      count: 12,
      minOpacity: 0.25,
      maxOpacity: 0.55,
      minSize: 14,
      maxSize: 24,
      minDuration: 9000,
      maxDuration: 17000,
      spawnEvery: 1100,
    },
    options
  );

  for (let i = 0; i < opts.count; i++) {
    setTimeout(() => spawnParticle(container, opts), i * (opts.spawnEvery / 2));
  }
  setInterval(() => spawnParticle(container, opts), opts.spawnEvery);
}

window.startParticleField = startParticleField;
