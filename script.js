/* =====================================================
   Nikola — Portfolio interactions
   ===================================================== */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initHeaderScroll();
    initScrollReveal();
    initActiveNav();
    initMobileNav();
    initCoords();
  });

  /* Shrink header once the page is scrolled */
  function initHeaderScroll() {
    var header = document.querySelector('header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Fade + rise elements into view as they enter the viewport */
  function initScrollReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* Highlight the nav link for the section currently in view */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('header nav a[href^="#"]'));
    if (!links.length) return;

    var map = {};
    var sections = [];
    links.forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (section) {
        map[id] = link;
        sections.push(section);
      }
    });
    if (!sections.length || !('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove('active'); });
          var active = map[entry.target.id];
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.35, rootMargin: '-30% 0px -55% 0px' });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* Slide-out nav on small screens */
  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('header nav');
    if (!toggle || !nav) return;

    var close = function () {
      nav.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* Live local time in the hero coordinate label */
  function initCoords() {
    var el = document.querySelector('[data-clock]');
    if (!el) return;
    var update = function () {
      var now = new Date();
      var hh = String(now.getHours()).padStart(2, '0');
      var mm = String(now.getMinutes()).padStart(2, '0');
      el.textContent = hh + ':' + mm + ' LOCAL';
    };
    update();
    setInterval(update, 15000);
  }
})();
