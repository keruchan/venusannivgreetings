/* =========================================================
   Anniversary Site — script.js
   Edit the CONFIG block below to personalize everything.
   ========================================================= */

const CONFIG = {
  partnerName: "My Love",                 // shows in the big hero title
  heroSubtitle: "Every day with you feels like the best chapter of my favorite story.",
  anniversaryDate: "2017-07-28T00:00:00", // YYYY-MM-DDTHH:MM:SS — set your real start date
  anniversaryLabel: "July 28, 2017",

  loveLetter:
`My Dearest,

Happy anniversary mahal ko! Salamat at palagi ka anjan para sakin lalo sa mga panahong kailangan ko ng kasama.

Maraming pagkakataon na sumisigaw ako o mabilis magalit, pagpasensyahan mo na. Magulo lang talaga ang isipan ko kapag ganon, sa dami ng problemang iniisip. Alam mo naman kung ano ano yon. Salamat kasi di moko inaalisan kahit na nagagalit ako sayo minsan.

Sana wag kana rin magalit sakin ng madalas kasi marami na kong iniisip, gusto ko maging stable na buhay natin. Ayoko ng parang bahay bahayan nalang, gusto ko na magkasariling bahay at buhay. Wait mo lang, ginagawa ko na lahat ng makakaya ko. Matutupad din natin tong mga binabalak natin. Need lang talaga muna natin magtiis sa mga nangyayari ngayon.

I love you more today than yesterday, and I'll love you even more tomorrow.`,

  storyEvents: [
    { emoji: "💘", title: "The Day We Met", text: "Edit this in js/script.js (storyEvents) — tell the story of how it all began." },
    { emoji: "🌹", title: "Our First Date", text: "Add the little details that made it unforgettable." },
    { emoji: "💍", title: 'Becoming "Us"', text: "The moment you knew this was something special." },
    { emoji: "💗", title: "Today & Always", text: "Still falling for you, every single day." },
  ],

  surpriseMessages: [
    "I love you to the moon and back!",
    "Sobrang thankful ko na nakilala kita <3",
    "Home isn't a place, it's you!",
  ],

  quotes: [
    "9 years in, wag kana lagi mang away.",
    "Salamat sa laging pag aalaga saakin lalo na sa mga panahong magulo isipan ko.",
    "Sobrang proud ako sa mga naabot mo na, at sa mga pagsisikap na ginagawa mo kapag may gusto kang bagay.",
    "Salamat sa pag intindi sa ugali ko, nagiging mainitin ulo ko palagi dahil sa dami ng problema.",
    "Magtiwala kalang din lagi sa sarili mo, lahat ng taong naging successful dumaan sa stage na doughtful sila sa sarili nila.",
    "Miss na miss na po kita! mwa.",
  ],

  // Songs play in this order, looping back to the first after the last.
  musicPlaylist: ["audio/song.mp3", "audio/song2.mp3"],
};

/* ---------------------------------------------------------
   Ambient background particles (hearts / flowers / sparkles)
--------------------------------------------------------- */
if (window.startParticleField) {
  startParticleField(document.getElementById("ambient-particles"));
}

/* ---------------------------------------------------------
   Preloader
--------------------------------------------------------- */
window.addEventListener("load", () => {
  const pre = document.getElementById("preloader");
  setTimeout(() => pre.classList.add("hidden"), 500);
});

/* ---------------------------------------------------------
   Hero personalization
--------------------------------------------------------- */
document.getElementById("partner-name").textContent = CONFIG.partnerName;
document.getElementById("hero-subtitle").textContent = CONFIG.heroSubtitle;
document.getElementById("anniversary-date-label").textContent = CONFIG.anniversaryLabel;
document.getElementById("footer-date").textContent =
  "Page crafted on " + new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

/* ===========================================================
   LIVE "TOGETHER FOR" COUNTER
=========================================================== */
(function counter() {
  const start = new Date(CONFIG.anniversaryDate).getTime();
  const els = {
    years: document.getElementById("c-years"),
    months: document.getElementById("c-months"),
    days: document.getElementById("c-days"),
    hours: document.getElementById("c-hours"),
    mins: document.getElementById("c-mins"),
    secs: document.getElementById("c-secs"),
  };

  function update() {
    const now = new Date();
    const startDate = new Date(CONFIG.anniversaryDate);
    if (isNaN(start)) return;

    let years = now.getFullYear() - startDate.getFullYear();
    let months = now.getMonth() - startDate.getMonth();
    let days = now.getDate() - startDate.getDate();
    let hours = now.getHours() - startDate.getHours();
    let mins = now.getMinutes() - startDate.getMinutes();
    let secs = now.getSeconds() - startDate.getSeconds();

    if (secs < 0) { secs += 60; mins--; }
    if (mins < 0) { mins += 60; hours--; }
    if (hours < 0) { hours += 24; days--; }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
      days += prevMonth;
      months--;
    }
    if (months < 0) { months += 12; years--; }

    if (years < 0) years = months = days = hours = mins = secs = 0;

    els.years.textContent = years;
    els.months.textContent = months;
    els.days.textContent = days;
    els.hours.textContent = String(hours).padStart(2, "0");
    els.mins.textContent = String(mins).padStart(2, "0");
    els.secs.textContent = String(secs).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
})();

/* ===========================================================
   TIMELINE — populate + scroll reveal
=========================================================== */
(function timeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";
  CONFIG.storyEvents.forEach((ev, i) => {
    const item = document.createElement("div");
    item.className = "timeline-item reveal from-left";
    item.style.setProperty("--reveal-delay", (i % 4) * 0.12 + "s");
    item.innerHTML = `
      <div class="timeline-dot">${ev.emoji}</div>
      <div class="timeline-card">
        <h3>${ev.title}</h3>
        <p>${ev.text}</p>
      </div>`;
    container.appendChild(item);
  });
})();

/* ===========================================================
   SWEET NOTHINGS — quote slideshow
=========================================================== */
(function quoteSlideshow() {
  const track = document.getElementById("quote-track");
  const dotsWrap = document.getElementById("quote-dots");
  const prevBtn = document.getElementById("q-prev");
  const nextBtn = document.getElementById("q-next");
  if (!track || !CONFIG.quotes.length) return;

  let index = 0;
  let timer = null;

  CONFIG.quotes.forEach((q) => {
    const slide = document.createElement("div");
    slide.className = "quote-slide";
    slide.innerHTML = `<p>&ldquo;${q}&rdquo;</p>`;
    track.appendChild(slide);

    const dot = document.createElement("span");
    dotsWrap.appendChild(dot);
  });

  const dots = Array.from(dotsWrap.children);

  function render() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }
  function go(i) {
    index = ((i % CONFIG.quotes.length) + CONFIG.quotes.length) % CONFIG.quotes.length;
    render();
  }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  dots.forEach((d, i) => d.addEventListener("click", () => { go(i); resetTimer(); }));
  nextBtn.addEventListener("click", () => { next(); resetTimer(); });
  prevBtn.addEventListener("click", () => { prev(); resetTimer(); });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(next, 4200);
  }

  // swipe support
  let startX = null;
  track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev(); resetTimer(); }
    startX = null;
  }, { passive: true });

  render();
  resetTimer();
})();

(function scrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );
  // slight delay so dynamically-created elements (gallery/timeline) exist
  setTimeout(() => {
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  }, 0);
})();

/* ===========================================================
   LOVE LETTER — envelope open + typewriter
=========================================================== */
(function loveLetter() {
  const envelope = document.getElementById("envelope");
  const letterTextEl = document.getElementById("letter-text");
  let opened = false;
  let typing = false;

  envelope.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    envelope.classList.add("open");
    setTimeout(typeWriter, 500);
  });

  function typeWriter() {
    if (typing) return;
    typing = true;
    const text = CONFIG.loveLetter;
    let i = 0;
    letterTextEl.textContent = "";
    const speed = 18;
    (function step() {
      if (i <= text.length) {
        letterTextEl.textContent = text.slice(0, i);
        i += 2;
        setTimeout(step, speed);
      }
    })();
  }
})();

/* ===========================================================
   SURPRISE BUTTON
=========================================================== */
(function surprise() {
  const btn = document.getElementById("surprise-btn");
  const msg = document.getElementById("surprise-msg");
  btn.addEventListener("click", (e) => {
    const rect = btn.getBoundingClientRect();
    if (window.__burstConfetti) {
      window.__burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
      setTimeout(() => window.__burstConfetti(rect.left + rect.width / 2 - 80, rect.top + rect.height / 2), 150);
      setTimeout(() => window.__burstConfetti(rect.left + rect.width / 2 + 80, rect.top + rect.height / 2), 300);
    }
    const random = CONFIG.surpriseMessages[Math.floor(Math.random() * CONFIG.surpriseMessages.length)];
    msg.style.opacity = 0;
    setTimeout(() => {
      msg.textContent = random;
      msg.style.opacity = 1;
    }, 200);
  });
})();

/* ===========================================================
   MUSIC — auto-plays through CONFIG.musicPlaylist in order,
   looping back to the first song after the last one finishes.
   Browsers block audio until the visitor interacts with the
   page at least once, so we try immediately and, if blocked,
   retry on her first tap/click/keypress (answering the quiz
   counts).
=========================================================== */
(function music() {
  const btn = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-music");
  const playlist = CONFIG.musicPlaylist && CONFIG.musicPlaylist.length
    ? CONFIG.musicPlaylist
    : [audio.getAttribute("src")].filter(Boolean);
  let trackIndex = 0;
  let playing = false;

  if (playlist.length) audio.src = playlist[trackIndex];

  audio.addEventListener("ended", () => {
    trackIndex = (trackIndex + 1) % playlist.length;
    audio.src = playlist[trackIndex];
    audio.play().catch(() => {});
  });

  function setPlayingUI(isPlaying) {
    playing = isPlaying;
    btn.classList.toggle("playing", isPlaying);
    btn.textContent = isPlaying ? "🎶" : "🎵";
  }

  function startPlaying() {
    if (playing || !playlist.length) return Promise.resolve();
    return audio.play().then(() => setPlayingUI(true));
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

  // try to start right away; if the browser blocks it, start on her first
  // interaction with the page instead (quiz answers count)
  startPlaying().catch(() => {
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
  });
})();

/* ===========================================================
   DOT NAV — active section highlight + smooth click
=========================================================== */
(function dotNav() {
  const allLinks = document.querySelectorAll(".dot-nav a, .mobile-nav a");
  const hrefs = [...new Set(Array.from(allLinks).map((a) => a.getAttribute("href")))];
  const sections = hrefs.map((href) => document.querySelector(href));

  function onScroll() {
    const mid = window.scrollY + window.innerHeight / 2;
    let activeHref = hrefs[0];
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= mid) activeHref = hrefs[i];
    });
    allLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === activeHref));
  }
  window.addEventListener("scroll", onScroll);
  onScroll();
})();
