/* ================================================================
   WEDDING WEBSITE — Javier & Marta
================================================================ */

// Wedding date: October 24, 2026 at noon (adjust time when known)
const WEDDING_DATE = new Date('2026-10-24T12:00:00');

/* ----------------------------------------------------------------
   ENVELOPE OPENING SCREEN
---------------------------------------------------------------- */
(function initEnvelope() {
  const screen   = document.getElementById('opening-screen');
  const envelope = document.getElementById('envelope');
  const main     = document.getElementById('main-content');

  if (!screen || !envelope || !main) return;

  function open() {
    // Animate envelope away
    envelope.classList.add('opening--open');
    // After a short delay close the screen
    setTimeout(() => {
      screen.classList.add('opening--closing');
    }, 300);
    // Show main content
    setTimeout(() => {
      main.removeAttribute('hidden');
      // Force reflow so transition triggers
      main.offsetHeight; // eslint-disable-line no-unused-expressions
      main.classList.add('visible');
      screen.style.pointerEvents = 'none';
      // Trigger hero reveal
      triggerHeroReveal();
      // Start scroll observers
      initScrollReveal();
    }, 700);
    // Remove screen from DOM after full transition
    setTimeout(() => {
      screen.remove();
    }, 1700);
  }

  envelope.addEventListener('click', open);
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
})();

/* ----------------------------------------------------------------
   HERO PARALLAX (subtle)
---------------------------------------------------------------- */
function triggerHeroReveal() {
  const hero = document.querySelector('.reveal-hero');
  if (hero) {
    setTimeout(() => hero.classList.add('revealed'), 80);
  }

  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroImg.style.transform = `scale(1.08) translateY(${y * 0.25}px)`;
    }, { passive: true });
  }
}

/* ----------------------------------------------------------------
   SCROLL REVEAL — generic sections & timeline items
---------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
  );

  document.querySelectorAll('.reveal-section').forEach((el) => {
    if (prefersReduced) {
      el.classList.add('revealed');
    } else {
      sectionObserver.observe(el);
    }
  });

  // Timeline items with staggered delay
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const items = entry.target.querySelectorAll('.reveal-timeline');
          items.forEach((item, i) => {
            setTimeout(() => item.classList.add('revealed'), i * 120);
          });
          timelineObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.timeline').forEach((el) => {
    if (prefersReduced) {
      el.querySelectorAll('.reveal-timeline').forEach((i) => i.classList.add('revealed'));
    } else {
      timelineObserver.observe(el);
    }
  });

  // Location cards
  const locationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll('.reveal-location');
          cards.forEach((card, i) => {
            setTimeout(() => card.classList.add('revealed'), i * 120);
          });
          locationObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll('.locations-grid').forEach((el) => {
    if (prefersReduced) {
      el.querySelectorAll('.reveal-location').forEach((c) => c.classList.add('revealed'));
    } else {
      locationObserver.observe(el);
    }
  });
}

/* ----------------------------------------------------------------
   COUNTDOWN TIMER
---------------------------------------------------------------- */
(function initCountdown() {
  const days  = document.getElementById('cd-days');
  const hours = document.getElementById('cd-hours');
  const mins  = document.getElementById('cd-min');
  const secs  = document.getElementById('cd-sec');

  if (!days) return;

  function update() {
    const now  = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      setValues('00', '00', '00', '00');
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    setValues(pad(d), pad(h), pad(m), pad(s));
  }

  function setValues(d, h, m, s) {
    days.querySelector('.countdown-num').textContent  = d;
    hours.querySelector('.countdown-num').textContent = h;
    mins.querySelector('.countdown-num').textContent  = m;
    secs.querySelector('.countdown-num').textContent  = s;
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
})();

/* ----------------------------------------------------------------
   PHOTO GALLERY CAROUSEL
---------------------------------------------------------------- */
(function initGallery() {
  const slider = document.getElementById('gallery-slider');
  const phrase = document.getElementById('gallery-phrase');
  const dotsContainer = document.getElementById('gallery-dots');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');

  if (!slider) return;

  const slides = slider.querySelectorAll('.gallery-slide');
  const dots   = dotsContainer ? dotsContainer.querySelectorAll('.gallery-dot') : [];
  let current  = 0;
  let timer    = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');

    // Update phrase
    if (phrase) {
      const p = slides[current].dataset.phrase;
      if (p) phrase.querySelector('p').textContent = p;
    }
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  function resetAuto() {
    startAuto();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goTo(current - 1);
      resetAuto();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goTo(current + 1);
      resetAuto();
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goTo(i);
      resetAuto();
    });
  });

  // Swipe support
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      dx < 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  }, { passive: true });

  startAuto();
})();
