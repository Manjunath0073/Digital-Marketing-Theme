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
  initCaseFilter();
  initBlogFilter();
  initMapInteract();
  initContactForm();
  initBlogSubscribe();
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
  const counters = document.querySelectorAll('.stats__number, .services-stats__card-number');
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

function initBlogSubscribe() {
  const form = document.getElementById('blogSubscribeForm');
  if (!form) return;

  const input = document.getElementById('subscribeEmail');
  const successMsg = document.getElementById('subscribeSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = input.value.trim();

    if (!email) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return;
    }

    input.classList.remove('is-invalid');
    input.classList.add('is-valid');

    if (successMsg) {
      successMsg.style.display = 'block';
      setTimeout(() => {
        successMsg.style.display = 'none';
        input.value = '';
        input.classList.remove('is-valid');
      }, 3000);
    }
  });
}

function initFaqAccordion() {
  document.querySelectorAll('.faq__item, .services-faq__item').forEach((item) => {
    const question = item.querySelector('.faq__question, .services-faq__question');
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
  const counters = document.querySelectorAll('.hero__dashboard-stat-value[data-count], .case-hero__stat-value[data-count]');
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
  const title = document.querySelector('.hero__title, .services-hero__title, .about-hero__title, .case-hero__title, .blog-hero__title, .contact-hero__title');
  if (!title || title.getAttribute('data-staggered')) return;

  title.setAttribute('data-staggered', 'true');

  const frag = document.createDocumentFragment();
  let wordIndex = 0;

  function staggerText(text) {
    const words = text.trim().split(/\s+/);
    if (!words[0]) return;
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'hero__title-word';
      span.textContent = word;
      span.style.transitionDelay = `${0.4 + wordIndex * 0.08}s`;
      span.style.opacity = '0';
      span.style.transform = 'translateY(24px)';
      frag.appendChild(span);
      if (i < words.length - 1) {
        frag.appendChild(document.createTextNode(' '));
      }
      wordIndex++;
    });
  }

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      staggerText(node.textContent);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'BR') {
        frag.appendChild(document.createElement('br'));
      } else {
        const clone = node.cloneNode();
        clone.innerHTML = '';
        for (const child of node.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
            const words = child.textContent.trim().split(/\s+/);
            if (!words[0]) continue;
            words.forEach((word, i) => {
              const span = document.createElement('span');
              span.className = 'hero__title-word';
              span.textContent = word;
              span.style.transitionDelay = `${0.4 + wordIndex * 0.08}s`;
              span.style.opacity = '0';
              span.style.transform = 'translateY(24px)';
              clone.appendChild(span);
              if (i < words.length - 1) {
                clone.appendChild(document.createTextNode(' '));
              }
              wordIndex++;
            });
          } else {
            clone.appendChild(child.cloneNode(true));
          }
        }
        frag.appendChild(clone);
      }
    }
  }

  for (const child of title.childNodes) {
    processNode(child);
  }

  title.innerHTML = '';
  title.appendChild(frag);

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

function initCaseFilter() {
  const container = document.querySelector('.case-showcase__grid');
  const filters = document.querySelectorAll('.case-showcase__filter');
  if (!container || !filters.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filters.forEach((f) => f.classList.remove('is-active'));
      btn.classList.add('is-active');

      Array.from(container.children).forEach((card) => {
        if (filter === '*' || card.getAttribute('data-category') === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

function initBlogFilter() {
  const container = document.querySelector('.blog-grid__items');
  const filters = document.querySelectorAll('.blog-grid__category');
  if (!container || !filters.length) return;

  filters.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filters.forEach((f) => f.classList.remove('is-active'));
      btn.classList.add('is-active');

      Array.from(container.children).forEach((card) => {
        if (filter === '*' || card.getAttribute('data-category') === filter) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });
}

function initMapInteract() {
  const overlay = document.querySelector('.js-map-overlay');
  const iframe = document.querySelector('.js-map-iframe');
  const btn = document.querySelector('.js-map-interact');
  if (!overlay || !iframe || !btn) return;

  btn.addEventListener('click', () => {
    overlay.classList.add('is-hidden');
    iframe.classList.add('is-active');
  });

  document.addEventListener('click', (e) => {
    if (iframe.classList.contains('is-active') && !overlay.contains(e.target) && !iframe.contains(e.target)) {
      overlay.classList.remove('is-hidden');
      iframe.classList.remove('is-active');
    }
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const serviceSelect = document.getElementById('service');
  const budgetSelect = document.getElementById('budget');
  const messageTextarea = document.getElementById('message');
  const successMsg = document.getElementById('contactFormSuccess');

  function setNameError(msg) {
    let err = nameInput.parentElement.querySelector('.contact-form__field-error');
    if (!err) return;
    err.textContent = msg;
    err.classList.toggle('is-visible', !!msg);
  }

  function setFieldValidity(el, valid) {
    el.classList.toggle('is-valid', valid);
    el.classList.toggle('is-invalid', !valid);
  }

  function createErrorEl(parent) {
    if (parent.querySelector('.contact-form__field-error')) return;
    const div = document.createElement('div');
    div.className = 'contact-form__field-error';
    parent.appendChild(div);
  }

  [nameInput, emailInput, serviceSelect, budgetSelect, messageTextarea].forEach(el => {
    if (el) createErrorEl(el.parentElement);
    if (el && el.id === 'name') {
      el.addEventListener('input', () => {
        el.value = el.value.replace(/[^A-Za-z\s]/g, '');
      });
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const name = nameInput.value.trim();
    if (!name) {
      setFieldValidity(nameInput, false);
      setNameError('Name is required');
      valid = false;
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      setFieldValidity(nameInput, false);
      setNameError('Name must contain only alphabets');
      valid = false;
    } else {
      setFieldValidity(nameInput, true);
      setNameError('');
    }

    const email = emailInput.value.trim();
    if (!email) {
      setFieldValidity(emailInput, false);
      const err = emailInput.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = 'Email is required'; err.classList.add('is-visible'); }
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldValidity(emailInput, false);
      const err = emailInput.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = 'Enter a valid email address'; err.classList.add('is-visible'); }
      valid = false;
    } else {
      setFieldValidity(emailInput, true);
      const err = emailInput.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = ''; err.classList.remove('is-visible'); }
    }

    if (!serviceSelect.value) {
      setFieldValidity(serviceSelect, false);
      const err = serviceSelect.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = 'Please select a service'; err.classList.add('is-visible'); }
      valid = false;
    } else {
      setFieldValidity(serviceSelect, true);
      const err = serviceSelect.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = ''; err.classList.remove('is-visible'); }
    }

    if (!budgetSelect.value) {
      setFieldValidity(budgetSelect, false);
      const err = budgetSelect.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = 'Please select a budget range'; err.classList.add('is-visible'); }
      valid = false;
    } else {
      setFieldValidity(budgetSelect, true);
      const err = budgetSelect.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = ''; err.classList.remove('is-visible'); }
    }

    const msg = messageTextarea.value.trim();
    if (!msg) {
      setFieldValidity(messageTextarea, false);
      const err = messageTextarea.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = 'Message is required'; err.classList.add('is-visible'); }
      valid = false;
    } else if (msg.length < 10) {
      setFieldValidity(messageTextarea, false);
      const err = messageTextarea.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = 'Message must be at least 10 characters'; err.classList.add('is-visible'); }
      valid = false;
    } else {
      setFieldValidity(messageTextarea, true);
      const err = messageTextarea.parentElement.querySelector('.contact-form__field-error');
      if (err) { err.textContent = ''; err.classList.remove('is-visible'); }
    }

    if (valid && successMsg) {
      successMsg.style.display = 'block';
      setTimeout(() => {
        successMsg.style.display = 'none';
        form.reset();
        [nameInput, emailInput, serviceSelect, budgetSelect, messageTextarea].forEach(el => {
          if (el) {
            el.classList.remove('is-valid', 'is-invalid');
            const err = el.parentElement.querySelector('.contact-form__field-error');
            if (err) { err.textContent = ''; err.classList.remove('is-visible'); }
          }
        });
      }, 3000);
    }
  });
}
