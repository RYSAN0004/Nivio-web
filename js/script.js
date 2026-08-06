/* ==========================================================================
   NIVIO — script.js
   Vanilla JS. No dependencies.
   ========================================================================== */
'use strict';

(function () {

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Loader
     --------------------------------------------------------------------- */
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (!loader) return;
    setTimeout(() => {
      loader.classList.add('loaded');
      document.body.style.overflow = '';
    }, 500);
  });

  /* ---------------------------------------------------------------------
     Scroll progress bar
     --------------------------------------------------------------------- */
  const scrollProgress = document.getElementById('scrollProgress');
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = pct + '%';
  }

  /* ---------------------------------------------------------------------
     Navbar: scrolled state + active link indicator
     --------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = Array.from(document.querySelectorAll('[data-nav]'));
  const navIndicator = document.getElementById('navIndicator');
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  function updateNavbarBg() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 24);
  }

  function moveIndicatorTo(link) {
    if (!navIndicator || !link) return;
    const navInner = link.closest('.nav-inner');
    const linkRect = link.getBoundingClientRect();
    const parentRect = navInner.getBoundingClientRect();
    navIndicator.style.width = linkRect.width + 'px';
    navIndicator.style.transform = `translateX(${linkRect.left - parentRect.left}px)`;
    navIndicator.style.opacity = '1';
  }

  function setActiveLink(link) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (link) {
      link.classList.add('active');
      moveIndicatorTo(link);
    }
  }

  let activeSectionId = 'home';
  function updateActiveSection() {
    const scrollPos = window.scrollY + window.innerHeight * 0.35;
    let current = sections[0];
    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) current = sec;
    }
    if (current && current.id !== activeSectionId) {
      activeSectionId = current.id;
      const matchingLink = navLinks.find(l => l.getAttribute('href') === '#' + current.id);
      setActiveLink(matchingLink);
    }
  }

  // init indicator position after fonts settle
  window.addEventListener('load', () => {
    const activeLink = navLinks.find(l => l.classList.contains('active')) || navLinks[0];
    setActiveLink(activeLink);
  });
  window.addEventListener('resize', () => {
    const activeLink = navLinks.find(l => l.classList.contains('active'));
    if (activeLink) moveIndicatorTo(activeLink);
  });

  /* ---------------------------------------------------------------------
     Smooth anchor scrolling (accounts for sticky navbar)
     --------------------------------------------------------------------- */
  function smoothScrollTo(targetEl) {
    const navH = document.getElementById('navbar').offsetHeight;
    const top = targetEl.getBoundingClientRect().top + window.scrollY - navH + 1;
    window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href.length <= 1) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        smoothScrollTo(target);
        closeMobileMenu();
      }
    });
  });

  document.getElementById('scrollIndicator')?.addEventListener('click', () => {
    const about = document.getElementById('about');
    if (about) smoothScrollTo(about);
  });

  /* ---------------------------------------------------------------------
     Mobile menu
     --------------------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');

  function openMobileMenu() {
    mobileMenu.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
  }
  function closeMobileMenu() {
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle?.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  /* ---------------------------------------------------------------------
     Master scroll handler (throttled via rAF)
     --------------------------------------------------------------------- */
  let scrollTicking = false;
  function onScroll() {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateNavbarBg();
        updateActiveSection();
        updateBackToTop();
        updateTimelineFill();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

})();

/* ==========================================================================
   Back to top
   ========================================================================== */
(function () {
  const btn = document.getElementById('backToTop');
  window.updateBackToTop = function () {
    if (!btn) return;
    btn.classList.toggle('visible', window.scrollY > 600);
  };
  btn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  });
})();

/* ==========================================================================
   Reveal on scroll (IntersectionObserver)
   ========================================================================== */
(function () {
  const revealEls = document.querySelectorAll('[data-reveal]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => el.classList.add('in-view'), Number(delay));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ==========================================================================
   Animated counters (About stat: 2023)
   ========================================================================== */
(function () {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (reducedMotion) { el.textContent = target; return; }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    }
    requestAnimationFrame(tick);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ==========================================================================
   Timeline progress fill
   ========================================================================== */
(function () {
  const fill = document.getElementById('timelineFill');
  const timeline = document.querySelector('.timeline');
  window.updateTimelineFill = function () {
    if (!fill || !timeline) return;
    const rect = timeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const total = rect.height;
    let visible = vh * 0.75 - rect.top;
    visible = Math.max(0, Math.min(visible, total));
    const pct = total > 0 ? (visible / total) * 100 : 0;
    fill.style.height = pct + '%';
  };
})();

/* ==========================================================================
   Hero: particle canvas
   ========================================================================== */
(function () {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height, dpr;
  let animId = null;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    const count = Math.min(60, Math.floor((width * height) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.4 + 0.15
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(127, 180, 255, ${p.alpha})`;
      ctx.fill();
    });
    animId = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    initParticles();
    if (!reducedMotion) {
      if (animId) cancelAnimationFrame(animId);
      draw();
    } else {
      draw = function () {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(127, 180, 255, ${p.alpha})`;
          ctx.fill();
        });
      };
      draw();
    }
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(start, 200);
  });

  start();

  // Pause when hero not visible (perf)
  const hero = document.getElementById('home');
  if (hero && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animId && !reducedMotion) draw();
        } else {
          if (animId) { cancelAnimationFrame(animId); animId = null; }
        }
      });
    }, { threshold: 0 });
    io.observe(hero);
  }
})();

/* ==========================================================================
   Hero: mouse parallax (aurora + glow)
   ========================================================================== */
(function () {
  const hero = document.getElementById('home');
  const aurora1 = document.querySelector('.aurora-1');
  const aurora2 = document.querySelector('.aurora-2');
  const glow = document.querySelector('.hero-glow');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hero || reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0;
  let raf = null;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    if (!raf) raf = requestAnimationFrame(loop);
  });

  function loop() {
    curX += (mouseX - curX) * 0.06;
    curY += (mouseY - curY) * 0.06;
    if (aurora1) aurora1.style.transform = `translate(${curX * 30}px, ${curY * 20}px)`;
    if (aurora2) aurora2.style.transform = `translate(${curX * -25}px, ${curY * -15}px)`;
    if (glow) glow.style.transform = `translate(calc(-50% + ${curX * 18}px), calc(-50% + ${curY * 12}px))`;
    if (Math.abs(mouseX - curX) > 0.001 || Math.abs(mouseY - curY) > 0.001) {
      raf = requestAnimationFrame(loop);
    } else {
      raf = null;
    }
  }
})();

/* ==========================================================================
   Magnetic buttons
   ========================================================================== */
(function () {
  const buttons = document.querySelectorAll('.magnetic');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
    });
  });
})();

/* ==========================================================================
   Ripple effect on buttons
   ========================================================================== */
(function () {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
})();

/* ==========================================================================
   Product modal
   ========================================================================== */
(function () {
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const iconEl = document.getElementById('modalIcon');
  const statusEl = document.getElementById('modalStatus');
  const titleEl = document.getElementById('modalTitle');
  const descEl = document.getElementById('modalDesc');
  const notifyBtn = document.getElementById('modalNotify');
  if (!overlay) return;

  const productData = {
    omniverse: {
      name: 'Omniverse',
      status: 'LIVE',
      statusClass: 'status-live',
      desc: 'Omniverse is a dedicated learning platform built specifically for JEE and NEET aspirants. It is designed to provide organized educational resources and learning tools for students who cannot afford expensive coaching, helping make quality preparation more accessible.',
      icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9z" stroke="currentColor" stroke-width="1.4"/></svg>'
    },
    focuz: {
      name: 'Focuz',
      status: 'BETA',
      statusClass: 'status-beta',
      desc: 'Focuz is a productivity application that helps students develop consistent study habits through smart focus sessions, timers, progress tracking and tools designed to reduce digital distractions.',
      icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" stroke-width="1.4"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>'
    },
    stayon: {
      name: 'StayOn',
      status: 'BETA',
      statusClass: 'status-beta',
      desc: 'StayOn is designed for students who rely on YouTube for learning. It helps reduce interruptions and supports a more focused learning experience while watching educational content.',
      icon: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M10 9.5l4.5 2.5L10 14.5v-5z" fill="currentColor"/></svg>'
    }
  };

  let lastFocused = null;

  function openModal(key) {
    const data = productData[key];
    if (!data) return;
    iconEl.innerHTML = data.icon;
    statusEl.textContent = data.status;
    statusEl.className = 'modal-status ' + data.statusClass;
    titleEl.textContent = data.name;
    descEl.textContent = data.desc;
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openModal(btn.getAttribute('data-open-modal'));
    });
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => openModal(card.getAttribute('data-product')));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card.getAttribute('data-product'));
      }
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  notifyBtn?.addEventListener('click', () => {
    notifyBtn.textContent = "You're on the list ✓";
    setTimeout(() => { notifyBtn.textContent = 'Notify Me'; closeModal(); }, 1400);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();

/* ==========================================================================
   Legal modal (Privacy / Terms)
   ========================================================================== */
(function () {
  const overlay = document.getElementById('legalOverlay');
  const closeBtn = document.getElementById('legalClose');
  const titleEl = document.getElementById('legalTitle');
  const bodyEl = document.getElementById('legalBody');
  if (!overlay) return;

  const content = {
    privacy: {
      title: 'Privacy Policy',
      html: `
        <h4>Overview</h4>
        <p>NIVIO ("we", "us") builds educational and productivity software for students. This policy explains, in plain terms, how we approach data on this website.</p>
        <h4>Information We Collect</h4>
        <p>The contact form on this site collects the name, email address, subject and message you choose to submit. We do not use tracking cookies or third-party advertising trackers on this site.</p>
        <h4>How We Use It</h4>
        <p>Information submitted via the contact form is used solely to respond to your inquiry. We do not sell or share your data with third parties.</p>
        <h4>Your Rights</h4>
        <p>You may request that we delete any information you've submitted by emailing iamrysan@gmail.com.</p>
        <h4>Contact</h4>
        <p>Questions about this policy can be sent to iamrysan@gmail.com.</p>
      `
    },
    terms: {
      title: 'Terms & Conditions',
      html: `
        <h4>Acceptance of Terms</h4>
        <p>By accessing this website, you agree to these terms. If you do not agree, please discontinue use of the site.</p>
        <h4>Use of Content</h4>
        <p>All content on this website, including the NIVIO name, logo and product names (Omniverse, Focuz, StayOn), is the property of NIVIO and may not be reproduced without permission.</p>
        <h4>Product Availability</h4>
        <p>Products listed as "BETA" or "Coming Soon" are under active development and may change before public release.</p>
        <h4>Limitation of Liability</h4>
        <p>This website and its content are provided "as is" without warranties of any kind.</p>
        <h4>Changes</h4>
        <p>These terms may be updated periodically. Continued use of the site constitutes acceptance of any changes.</p>
      `
    }
  };

  let lastFocused = null;
  function openLegal(key) {
    const data = content[key];
    if (!data) return;
    titleEl.textContent = data.title;
    bodyEl.innerHTML = data.html;
    lastFocused = document.activeElement;
    overlay.classList.add('open');
    document.body.classList.add('no-scroll');
    closeBtn.focus();
  }
  function closeLegal() {
    overlay.classList.remove('open');
    document.body.classList.remove('no-scroll');
    if (lastFocused) lastFocused.focus();
  }

  document.getElementById('openPrivacy')?.addEventListener('click', (e) => { e.preventDefault(); openLegal('privacy'); });
  document.getElementById('openTerms')?.addEventListener('click', (e) => { e.preventDefault(); openLegal('terms'); });
  closeBtn?.addEventListener('click', closeLegal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeLegal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeLegal();
  });
})();

/* ==========================================================================
   FAQ Accordion
   ========================================================================== */
(function () {
  const items = document.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      items.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
})();

/* ==========================================================================
   Contact form (client-side validation + simulated submit)
   ========================================================================== */
(function () {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitText = document.getElementById('submitText');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submitText.textContent = 'Sending...';
    status.textContent = '';
    status.style.color = 'var(--text-secondary)';

    // Simulated send — replace with real endpoint/integration as needed.
    setTimeout(() => {
      submitText.textContent = 'Send Message';
      status.style.color = 'var(--success)';
      status.textContent = "Thanks — your message has been received. We'll get back to you soon.";
      form.reset();
    }, 900);
  });
})();

/* ==========================================================================
   Prevent no-scroll body flash before load (in case JS-driven overflow lock)
   ========================================================================== */
document.body.style.overflow = 'hidden';
