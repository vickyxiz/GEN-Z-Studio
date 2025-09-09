// Enhanced script: mobile menu, smooth scroll, GSAP animations, counters, tilt, active nav highlight
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const brand = document.getElementById('brand');
  const themeToggle = document.getElementById('themeToggle');
  const logoPills = document.querySelectorAll('.logo-pill');
  const serviceItems = document.querySelectorAll('.service-item');
  const statNums = document.querySelectorAll('.stat-num');

  // Mobile menu open/close (slide)
  function openMobile() {
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    mobileBtn.setAttribute('aria-expanded', 'true');
  }
  function closeMobile() {
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileBtn.setAttribute('aria-expanded', 'false');
  }
  mobileBtn && mobileBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) closeMobile(); else openMobile();
  });
  mobileClose && mobileClose.addEventListener('click', closeMobile);
  mobileLinks.forEach(l => l.addEventListener('click', closeMobile));

  // Smooth scroll for nav links (desktop)
  function smoothScrollTo(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  navLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      // Check if the link points to a section on the same page
      const href = a.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href.replace('#', ''));
      }
    });
  });
  document.querySelectorAll('.mobile-link, .brand, .btn-primary, .btn-primary-mobile').forEach(el => {
    el.addEventListener('click', (ev) => {
      const href = el.getAttribute('href');
      if (href && href.startsWith('#')) {
        ev.preventDefault();
        smoothScrollTo(href.replace('#', ''));
      }
    });
  });

  // Brand click
  brand && brand.addEventListener('click', (e) => {
    e.preventDefault();
    smoothScrollTo('hero');
  });

  // Theme toggle (light/dark swap - minor)
  themeToggle && themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    // optional: persist to localStorage
  });

  // GSAP Animations (entrance + loop)
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    // Hero entry
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' }});
    tl.from('.brand', { y: -16, opacity: 0, duration: .6 })
      .from('.hero-text span', { y: 60, opacity: 0, stagger: .14, duration: .9 }, '-=.15')
      .from('.hero-subtitle', { y: 30, opacity: 0, duration: .6 }, '-=.45')
      .from('.hero-logos .logo-pill', { y: 20, opacity: 0, stagger: .08, duration: .45 }, '-=.3');

    // Network lines and dots animation
    gsap.set('.network .line', { strokeDasharray: 80, strokeDashoffset: 80 });
    gsap.set('.network .dot', { scale: 0, transformOrigin: 'center center' });

    gsap.to('.network .line', {
      strokeDashoffset: 0,
      duration: 2.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });

    gsap.to('.network .dot', {
      scale: 1,
      duration: 1.2,
      stagger: 0.3,
      ease: 'back.out(1.7)',
      onComplete: () => {
        gsap.to('.network .dot', {
          scale: 1.12,
          duration: 1.9,
          repeat: -1,
          yoyo: true,
          stagger: .35,
          ease: 'sine.inOut',
        });
      }
    });

    // Random wiggle animation for the hero graphic
    gsap.to('.hero-graphic', {
      x: 'random(-5, 5)',
      y: 'random(-5, 5)',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Section reveal on scroll
    document.querySelectorAll('section').forEach(section => {
      gsap.from(section.querySelectorAll('h2, p, .card, .service-item, .stat, .testimonial-card, .founder-card'), {
        scrollTrigger: { trigger: section, start: 'top 75%' },
        y: 40,
        opacity: 0,
        stagger: 0.10,
        duration: 0.7,
        ease: 'power2.out',
      });
    });

    // Subtle parallax on blobs (slower)
    gsap.to('.blob.b1', { y: -30, x: -20, duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.blob.b2', { y: 40, x: 20, duration: 20, repeat: -1, yoyo: true, ease: 'sine.inOut' });
  }

  // Active nav highlight via IntersectionObserver
  const sectionIds = ['hero','design-services','tech-services','marketing-services','projects','testimonials','founder','contact','work','services','clients','about','knowledge'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navMap = Array.from(navLinks).reduce((acc, a) => {
    const href = a.getAttribute('href')?.replace('#','');
    if (href) acc[href]=a;
    return acc;
  }, {});
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        // remove active
        navLinks.forEach(n => n.classList.remove('active'));
        if (navMap[id]) navMap[id].classLi
      }
    });
  }, { rootMargin: '-30% 0px -70% 0px' });

  sections.forEach(section => observer.observe(section));

  // Stat counter animation on scroll
  statNums.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const counter = { val: 0 };

    gsap.to(counter, {
      val: target,
      duration: 1.5,
      ease: 'power1.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      onUpdate: () => {
        el.textContent = Math.ceil(counter.val);
      }
    });
  });
});