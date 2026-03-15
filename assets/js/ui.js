/* ═══════════════════════════════════════════════════════════════════
   UI MODULE — Interactions, animations, utilities
   ═══════════════════════════════════════════════════════════════════ */

const UI = (() => {

  /* ── Dark Mode ──────────────────────────────────────── */
  let isDark = false;

  function initDarkMode() {
    const saved  = localStorage.getItem('theme');
    const prefer = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark = saved ? saved === 'dark' : prefer;
    applyDark(isDark);

    document.getElementById('dark-toggle')?.addEventListener('click', () => {
      isDark = !isDark;
      applyDark(isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  function applyDark(dark) {
    document.documentElement.classList.toggle('dark', dark);
    const sun  = document.getElementById('sun-icon');
    const moon = document.getElementById('moon-icon');
    sun?.classList.toggle('hidden', !dark);
    moon?.classList.toggle('hidden', dark);
    isDark = dark;
  }

  /* ── Scroll Progress ────────────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          bar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ── Intersection Reveal ────────────────────────────── */
  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
      .forEach(el => observer.observe(el));
  }

  /* ── Skill Bars ─────────────────────────────────────── */
  function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
            setTimeout(() => {
              bar.style.width = bar.dataset.width + '%';
            }, parseInt(bar.dataset.delay || 0));
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('[data-skill-group]').forEach(el => observer.observe(el));
  }

  /* ── Mobile Nav ─────────────────────────────────────── */
  function initMobileNav() {
    const btn  = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    let open = false;

    btn.addEventListener('click', () => {
      open = !open;
      btn.setAttribute('aria-expanded', open);

      if (open) {
        menu.classList.remove('hidden-menu');
        menu.classList.remove('opacity-0', 'pointer-events-none');
      } else {
        menu.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => menu.classList.add('hidden-menu'), 250);
      }
    });

    // Close on link click
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        open = false;
        btn.setAttribute('aria-expanded', false);
        menu.classList.add('opacity-0', 'pointer-events-none');
        setTimeout(() => menu.classList.add('hidden-menu'), 250);
      });
    });
  }

  /* ── Quote Rotator ──────────────────────────────────── */
  function initQuoteRotator(quotes) {
    if (!quotes || !quotes.length) return;
    let idx = 0;
    const textEl   = document.getElementById('rotating-quote');
    const srcEl    = document.getElementById('quote-source');
    const transEl  = document.getElementById('quote-translation');
    if (!textEl) return;

    function showQuote(i) {
      const q = quotes[i];
      [textEl, srcEl, transEl].forEach(el => el && el.classList.add('exiting'));

      setTimeout(() => {
        if (textEl) textEl.textContent = q.text;
        if (srcEl)  srcEl.textContent  = '— ' + q.source;
        if (transEl && q.translation) {
          transEl.textContent = q.translation;
          transEl.style.display = '';
        } else if (transEl) {
          transEl.style.display = 'none';
        }

        [textEl, srcEl, transEl].forEach(el => {
          if (el) { el.classList.remove('exiting'); el.classList.add('entering'); }
        });

        setTimeout(() => {
          [textEl, srcEl, transEl].forEach(el => el?.classList.remove('entering'));
        }, 50);
      }, 450);
    }

    setInterval(() => {
      idx = (idx + 1) % quotes.length;
      showQuote(idx);
    }, 5500);
  }

  /* ── Wisdom Rotator ─────────────────────────────────── */
  let wisdomIdx = 0;
  let wisdomData = [];

  function initWisdomRotator(wisdom) {
    wisdomData = wisdom || [];
    document.getElementById('wisdom-next-btn')?.addEventListener('click', nextWisdom);
    
    // Auto change after 8 seconds
    setInterval(nextWisdom, 8000);
  }

  function nextWisdom() {
    wisdomIdx = (wisdomIdx + 1) % wisdomData.length;
    const w = wisdomData[wisdomIdx];
    const san   = document.getElementById('wisdom-sanskrit');
    const trans = document.getElementById('wisdom-translation');
    const src   = document.getElementById('wisdom-source');

    [san, trans, src].forEach(el => {
      if (el) { el.style.opacity = 0; el.style.transform = 'translateY(-6px)'; }
    });

    setTimeout(() => {
      if (san)   san.textContent   = '"' + w.sanskrit + '"';
      if (trans) trans.textContent = w.translation;
      if (src)   src.textContent   = '— ' + w.source;
      [san, trans, src].forEach(el => {
        if (el) { el.style.opacity = 1; el.style.transform = 'translateY(0)'; }
      });
    }, 300);
  }

  function toggleReadMore(idx) {
    const el = document.getElementById(`rec-text-${idx}`);
    const btn = el.nextElementSibling;
    if (!el || !btn) return;
    
    const isExpanded = el.classList.toggle('expanded');
    const fullText  = el.getAttribute('data-full');
    const shortText = el.getAttribute('data-short');
    
    el.textContent = isExpanded ? `"${fullText}"` : `"${shortText}"`;
    btn.textContent = isExpanded ? 'Read Less' : 'Read More';
  }



  /* ── Contact Form ───────────────────────────────────── */
  function initContactForm() {
    document.getElementById('send-message')?.addEventListener('click', handleSubmit);

    ['name','email','message'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', clearError.bind(null, id));
    });
  }

  function handleSubmit() {
    const name    = document.getElementById('name')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    let valid = true;
    if (!name)    { showError('name', 'Name is required');           valid = false; }
    if (!email || !email.includes('@')) { showError('email', 'Valid email required'); valid = false; }
    if (!message) { showError('message', 'Message cannot be empty'); valid = false; }

    if (!valid) return;

    document.getElementById('contact-form')?.classList.add('hidden');
    document.getElementById('form-success')?.classList.remove('hidden');
  }

  function showError(id, msg) {
    const el = document.getElementById(id + '-error');
    if (el) { el.textContent = msg; el.classList.remove('hidden'); }
    document.getElementById(id)?.classList.add('border-red-400');
  }

  function clearError(id) {
    document.getElementById(id + '-error')?.classList.add('hidden');
    document.getElementById(id)?.classList.remove('border-red-400');
  }

  /* ── Mantra Scroll Band ─────────────────────────────── */
  function initMantraBand() {
    const band = document.getElementById('mantra-band');
    if (!band) return;

    const mantras = [
      'ॐ तत् सत्',
      'Karma · Dharma · Jnana',
      'योगः कर्मसु कौशलम्',
      'Code with Consciousness',
      'सर्वे भवन्तु सुखिनः',
      'Build · Learn · Serve',
      'हरे कृष्ण',
      'Engineering as Devotion',
    ];

    const doubled = [...mantras, ...mantras];
    const inner   = document.createElement('div');
    inner.className = 'mantra-scroll font-mono text-xs text-slate-400 dark:text-slate-600 tracking-widest uppercase';
    inner.innerHTML = doubled.map(m => `<span>✦ ${m}</span>`).join('');
    band.appendChild(inner);
  }

  /* ── Custom Cursor ──────────────────────────────────── */


  /* ── Active Nav Link ────────────────────────────────── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const activeSections = new Set();

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activeSections.add(entry.target.id);
        } else {
          activeSections.delete(entry.target.id);
        }
      });

      // Highlight the first visible section that has a corresponding nav link
      let currentSection = null;
      for (const section of sections) {
        if (activeSections.has(section.id)) {
          // Check if this section has a link in nav
          const hasLink = Array.from(navLinks).some(link => link.getAttribute('href') === '#' + section.id);
          if (hasLink) {
            currentSection = section.id;
            break;
          }
        }
      }

      navLinks.forEach(link => {
        const active = currentSection && link.getAttribute('href') === '#' + currentSection;
        link.classList.toggle('nav-link-active', active);
      });
    }, { 
      threshold: [0.1, 0.5, 0.8], 
      rootMargin: '-20% 0px -60% 0px' // Focus on the upper-middle of the screen
    });

    sections.forEach(s => observer.observe(s));
  }

  /* ── Scroll To Top ──────────────────────────────────── */
  function initScrollToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        btn.classList.remove('translate-y-24', 'opacity-0');
        btn.classList.add('translate-y-0', 'opacity-100');
      } else {
        btn.classList.add('translate-y-24', 'opacity-0');
        btn.classList.remove('translate-y-0', 'opacity-100');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Hero Image Switcher ────────────────────────────── */
  function initHeroImageSwitcher() {
    const img = document.getElementById('hero-photo');
    if (!img) return;

    const images = [
      'assets/images/tilakpoudel.jpeg',
      'assets/images/tilak-poudel-with-bg.jpg'
    ];
    let currentIdx = 0;

    setInterval(() => {
      currentIdx = (currentIdx + 1) % images.length;
      
      // Simple cross-fade logic
      img.style.transition = 'opacity 0.8s ease-in-out';
      img.style.opacity = '0.3';
      
      setTimeout(() => {
        img.src = images[currentIdx];
        img.style.opacity = '1';
      }, 800);
    }, 10000);
  }

  /* ── Public init ────────────────────────────────────── */
  function init(data) {
    initDarkMode();
    initScrollProgress();
    initReveal();
    initSkillBars();
    initMobileNav();
    initQuoteRotator(data.quotes);
    initWisdomRotator(data.wisdomQuotes);

    initContactForm();
    initMantraBand();
    initActiveNav();
    initScrollToTop();
    initHeroImageSwitcher();
  }

  return { init, nextWisdom, applyDark, toggleReadMore };
})();
