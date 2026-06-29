'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initRevealObserver();
  initCounterAnimation();
  initSmoothScroll();
  initFaqAccordion();
  initStaggerObserver();
  initMouseParallax();
  initMagneticButtons();
  initDashboardTilt();
  initDashboardCounters();
  initHeroTitleStagger();
  initCardTilt();
  initCardGlow();
  initScrollParallax();
});

function initHeader() {
  const header = document.querySelector('.js-header');
  const hamburger = document.querySelector('.js-hamburger');
  const offcanvas = document.querySelector('.js-offcanvas');
  const overlay = document.querySelector('.js-overlay');
  const closeBtn = document.querySelector('.js-offcanvas-close');

  if (!header) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const openOffcanvas = () => {
    if (!offcanvas || !overlay) return;
    offcanvas.classList.add('is-open');
    overlay.classList.add('is-visible');
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.classList.add('is-active');
  };

  const closeOffcanvas = () => {
    if (!offcanvas || !overlay) return;
    offcanvas.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
    if (hamburger) hamburger.classList.remove('is-active');
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = offcanvas && offcanvas.classList.contains('is-open');
      if (isOpen) closeOffcanvas();
      else openOffcanvas();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeOffcanvas);
  if (overlay) overlay.addEventListener('click', closeOffcanvas);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeOffcanvas();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth >= 1024) closeOffcanvas();
    }, 200);
  });
}

function initRevealObserver() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

function initStaggerObserver() {
  const containers = document.querySelectorAll('.stagger-children');
  if (!containers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  containers.forEach((el) => observer.observe(el));
}

function initCounterAnimation() {
  const counters = document.querySelectorAll('.stats__number');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          animateCounter(counter, target);
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCounter(element, target) {
  const duration = 2000;
  const startTime = performance.now();
  const startValue = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + (target - startValue) * eased);

    element.textContent = currentValue.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

function initFaqAccordion() {
  document.querySelectorAll('.faq__item').forEach((item) => {
    const question = item.querySelector('.faq__question');
    if (!question) return;

    question.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  });
}

function initMouseParallax() {
  const section = document.querySelector('.js-parallax-section');
  if (!section) return;

  const heroVisual = section.querySelector('.hero__visual');
  const glow = section.querySelector('.hero__glow');
  if (!heroVisual) return;

  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroVisual.style.transform = `translate(${x * -20}px, ${y * -20}px)`;

    if (glow) {
      glow.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
    }
  });

  section.addEventListener('mouseleave', () => {
    heroVisual.style.transform = '';
    heroVisual.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    setTimeout(() => { heroVisual.style.transition = ''; }, 800);

    if (glow) {
      glow.style.transform = '';
    }
  });
}

function initMagneticButtons() {
  document.querySelectorAll('.js-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}

function initDashboardTilt() {
  const dashboards = document.querySelectorAll('.js-dashboard[data-tilt]');
  if (!dashboards.length) return;

  dashboards.forEach((dash) => {
    dash.addEventListener('mousemove', (e) => {
      const rect = dash.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      dash.style.transform = `perspective(800px) rotateX(${y * -16}deg) rotateY(${x * 16}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    dash.addEventListener('mouseleave', () => {
      dash.style.transform = '';
      dash.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { dash.style.transition = ''; }, 600);
    });
  });
}

function initDashboardCounters() {
  const counters = document.querySelectorAll('.hero__dashboard-stat-value[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;
          const parent = el.closest('.hero__dashboard-stat');
          const suffix = parent ? parent.querySelector('.hero__dashboard-stat-suffix') : null;

          animateDashboardCounter(el, target, suffix);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateDashboardCounter(el, target, suffixEl) {
  const duration = 1800;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    el.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
      if (suffixEl) {
        suffixEl.style.opacity = '1';
      }
    }
  }

  requestAnimationFrame(update);
}

function initHeroTitleStagger() {
  const title = document.querySelector('.hero__title');
  if (!title || title.getAttribute('data-staggered')) return;

  const text = title.textContent.trim();
  const words = text.split(' ');
  title.setAttribute('data-staggered', 'true');
  title.innerHTML = '';

  words.forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'hero__title-word';
    span.textContent = word;
    span.style.transitionDelay = `${0.4 + i * 0.08}s`;
    span.style.opacity = '0';
    span.style.transform = 'translateY(24px)';
    title.appendChild(span);
    if (i < words.length - 1) {
      title.appendChild(document.createTextNode(' '));
    }
  });

  requestAnimationFrame(() => {
    title.querySelectorAll('.hero__title-word').forEach((span) => {
      span.style.transition = 'opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)';
      span.style.opacity = '1';
      span.style.transform = 'translateY(0)';
    });
  });
}

function initCardTilt() {
  const cards = document.querySelectorAll('.js-tilt-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(600px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
}

function initCardGlow() {
  const cards = document.querySelectorAll('.js-glow-card');
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });
}

function initScrollParallax() {
  const els = document.querySelectorAll('.js-parallax-scroll');
  if (!els.length) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        els.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const viewportCenter = window.innerHeight / 2;
          const offset = (center - viewportCenter) / viewportCenter;
          el.style.transform = `translateY(${offset * -20}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
