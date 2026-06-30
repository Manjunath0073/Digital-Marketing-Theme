'use strict';

document.addEventListener('DOMContentLoaded', function () {
  initDashboard();
});

function initDashboard() {
  var user = getDashboardUser();
  if (!user) return;

  displayUserInfo(user);
  initSidebar();
  initLogout();
}

/* --------------------------------------------
   User
   -------------------------------------------- */
function getDashboardUser() {
  try {
    var raw = localStorage.getItem('stackly_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  var isAdmin = window.location.pathname.indexOf('dashboard-admin') !== -1;
  return {
    name: isAdmin ? 'Admin User' : 'Demo Client',
    email: isAdmin ? 'admin@stackly.com' : 'demo@stackly.com',
    role: isAdmin ? 'admin' : 'client'
  };
}

function displayUserInfo(user) {
  var els = document.querySelectorAll('.js-dashboard-user-name');
  els.forEach(function (el) { el.textContent = user.name; });

  var roleEls = document.querySelectorAll('.js-dashboard-user-role');
  roleEls.forEach(function (el) { el.textContent = user.role; });

  var avatarEls = document.querySelectorAll('.js-dashboard-user-avatar');
  avatarEls.forEach(function (el) { el.textContent = user.name.charAt(0).toUpperCase(); });

  var greetingEl = document.querySelector('.js-dashboard-greeting');
  if (greetingEl) {
    greetingEl.textContent = 'Welcome back, ' + user.name.split(' ')[0] + '!';
  }
}

/* --------------------------------------------
   Sidebar
   -------------------------------------------- */
function initSidebar() {
  var hamburger = document.querySelector('.js-dashboard-hamburger');
  var sidebar = document.querySelector('.js-dashboard-sidebar');
  var overlay = document.querySelector('.js-dashboard-overlay');

  if (!hamburger || !sidebar) return;

  hamburger.addEventListener('click', function () {
    sidebar.classList.toggle('is-open');
    if (overlay) overlay.classList.toggle('is-visible');
  });

  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
    });
  }

  var links = sidebar.querySelectorAll('.dashboard__sidebar-link');
  links.forEach(function (link) {
    link.addEventListener('click', function () {
      sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
    });
  });
}

/* --------------------------------------------
   Logout
   -------------------------------------------- */
function initLogout() {
  var btns = document.querySelectorAll('.js-dashboard-logout');
  btns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      localStorage.removeItem('stackly_user');
      window.location.href = 'signin.html';
    });
  });
}

/* --------------------------------------------
   Section switching (show/hide)
   -------------------------------------------- */
function switchSection(sectionId) {
  var sections = document.querySelectorAll('.js-dashboard-section');
  sections.forEach(function (s) { s.style.display = 'none'; });

  var target = document.getElementById(sectionId);
  if (target) target.style.display = 'block';

  var links = document.querySelectorAll('.dashboard__sidebar-link');
  links.forEach(function (l) { l.classList.remove('is-active'); });

  var activeLink = document.querySelector('[data-section="' + sectionId + '"]');
  if (activeLink) activeLink.classList.add('is-active');
}

/* --------------------------------------------
   Chart defaults
   -------------------------------------------- */
function createChart(canvasId, config) {
  var canvas = document.getElementById(canvasId);
  if (!canvas) return null;
  return new Chart(canvas.getContext('2d'), config);
}

function getChartDefaults() {
  return {
    color: '#A5A3A8',
    gridColor: 'rgba(255,255,255,0.04)',
    accentColor: '#E8923E',
    accentAlpha: 'rgba(232,146,62,0.15)',
  };
}
