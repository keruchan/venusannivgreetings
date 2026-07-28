/* =========================================================
   Shared background: interactive balloons + cursor heart trail
   + confetti burst. Included on every page — needs a
   #balloon-canvas canvas and a #heart-trail-container div
   present in the page markup. Exposes window.__burstConfetti
   for other scripts (upload success, buttons, etc.) to reuse.
   ========================================================= */
(function balloonSystem() {
  const canvas = document.getElementById("balloon-canvas");
  const ctx = canvas.getContext("2d");
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const colors = ["#ff6f91", "#ff9ebb", "#c9a6ff", "#ffd6e8", "#ff8fab", "#e0aaff"];
  const mouse = { x: -9999, y: -9999, active: false };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
    spawnTrailHeart(e.clientX, e.clientY);
  });
  window.addEventListener("mouseleave", () => (mouse.active = false));
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches[0];
      if (!t) return;
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      mouse.active = true;
      spawnTrailHeart(t.clientX, t.clientY);
    },
    { passive: true }
  );

  class Balloon {
    constructor(forceBottom = true) {
      this.reset(forceBottom);
    }
    reset(forceBottom) {
      this.r = 22 + Math.random() * 18;
      this.baseX = Math.random() * w;
      this.x = this.baseX;
      this.y = forceBottom ? h + this.r + Math.random() * h * 0.6 : Math.random() * h;
      this.speed = 0.4 + Math.random() * 0.6;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.sway = Math.random() * Math.PI * 2;
      this.swaySpeed = 0.01 + Math.random() * 0.015;
      this.swayAmount = 20 + Math.random() * 30;
      this.popped = false;
      this.vx = 0;
      this.vy = 0;
    }
    update() {
      if (this.popped) return;
      this.sway += this.swaySpeed;
      this.y -= this.speed;
      const targetX = this.baseX + Math.sin(this.sway) * this.swayAmount;

      // repulsion from cursor
      if (mouse.active) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        const minDist = 140;
        if (dist < minDist) {
          const force = (minDist - dist) / minDist;
          this.vx += (dx / (dist || 1)) * force * 2.2;
          this.vy += (dy / (dist || 1)) * force * 2.2;
        }
      }

      // ease toward the swaying path, damp velocity
      this.vx += (targetX - this.x) * 0.01;
      this.vx *= 0.9;
      this.vy *= 0.85;

      this.x += this.vx;
      this.y += this.vy;

      if (this.y < -this.r * 4) this.reset(true);
    }
    draw() {
      if (this.popped) return;
      const { x, y, r, color } = this;
      // string
      ctx.beginPath();
      ctx.moveTo(x, y + r);
      ctx.lineTo(x + Math.sin(this.sway * 2) * 6, y + r + 40);
      ctx.strokeStyle = "rgba(150,100,120,0.35)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // balloon body
      ctx.beginPath();
      ctx.ellipse(x, y, r * 0.82, r, 0, 0, Math.PI * 2);
      const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, r);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.15, color);
      grad.addColorStop(1, color);
      ctx.fillStyle = grad;
      ctx.fill();

      // knot
      ctx.beginPath();
      ctx.moveTo(x - 4, y + r - 2);
      ctx.lineTo(x + 4, y + r - 2);
      ctx.lineTo(x, y + r + 6);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }
    hitTest(px, py) {
      return Math.hypot(px - this.x, py - this.y) < this.r + 6;
    }
  }

  const BALLOON_COUNT = window.innerWidth < 700 ? 9 : 16;
  const balloons = Array.from({ length: BALLOON_COUNT }, () => new Balloon(false));

  canvas.style.pointerEvents = "none";
  // use a transparent click layer instead so page content stays clickable everywhere else
  document.addEventListener("click", (e) => {
    for (const b of balloons) {
      if (!b.popped && b.hitTest(e.clientX, e.clientY)) {
        b.popped = true;
        burstConfetti(e.clientX, e.clientY, b.color);
        setTimeout(() => b.reset(true), 900 + Math.random() * 600);
        break;
      }
    }
  });

  function loop() {
    ctx.clearRect(0, 0, w, h);
    balloons.forEach((b) => {
      b.update();
      b.draw();
    });
    requestAnimationFrame(loop);
  }
  loop();

  /* -------- cursor heart trail -------- */
  let lastTrail = 0;
  function spawnTrailHeart(x, y) {
    const now = Date.now();
    if (now - lastTrail < 60) return;
    lastTrail = now;
    const el = document.createElement("div");
    el.className = "trail-heart";
    el.textContent = ["💕", "💗", "✨", "💖"][Math.floor(Math.random() * 4)];
    el.style.left = x - 8 + "px";
    el.style.top = y - 8 + "px";
    document.getElementById("heart-trail-container").appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  /* expose for other scripts (surprise button, uploads, etc.) */
  window.__burstConfetti = burstConfetti;

  function burstConfetti(x, y, color) {
    const pieceColors = color ? [color, "#fff", "#ffd6e8"] : colors;
    const count = 26;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.background = pieceColors[Math.floor(Math.random() * pieceColors.length)];
      piece.style.left = x + "px";
      piece.style.top = y + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      document.body.appendChild(piece);

      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 140;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 40;
      const rot = Math.random() * 720 - 360;

      piece.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy + 220}px) rotate(${rot}deg)`, opacity: 0 },
        ],
        { duration: 1100 + Math.random() * 500, easing: "cubic-bezier(.2,.8,.4,1)" }
      );
      setTimeout(() => piece.remove(), 1700);
    }
  }
})();
