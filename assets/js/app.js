/* ═══════════════════════════════════════════════════════════════════
   APP.JS — Portfolio Bootstrap
   Loads data, renders dynamic sections, inits modules
   ═══════════════════════════════════════════════════════════════════ */

(async () => {
  /* ── Load data ──────────────────────────────────────── */
  let data;
  try {
    const res = await fetch('./assets/data/portfolio.json');
    data = await res.json();
  } catch (e) {
    console.error('Failed to load portfolio data:', e);
    return;
  }

  /* ── Render sections from data ──────────────────────── */
  renderStats(data.stats);
  renderSkills(data.skills);
  renderExperience(data.experience);
  renderJourney(data.journey);
  renderProjects(data.projects);
  renderArticles(data.articles);
  renderCourses(data.courses);
  renderServiceTopics(data.service);
  renderRecommendations(data.recommendations);
  renderOfferings(data.offerings);
  renderClients(data.clients);
  setInitialWisdom(data.wisdomQuotes[0]);
  setHeroMeta(data.meta);

  /* ── Bootstrap modules ──────────────────────────────── */
  // Ensure DOM is fully parsed before initializing
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      UI.init(data);
      NetworkViz.init(data);
    });
  } else {
    UI.init(data);
    NetworkViz.init(data);
  }

  /* ══════════════════════════════════════════════════════
     RENDER HELPERS
  ══════════════════════════════════════════════════════ */

  /* ── Hero meta ──────────────────────────────────────── */
  function setHeroMeta(meta) {
    const badge = document.getElementById('hero-status');
    if (badge && meta.available) badge.classList.remove('hidden');

    // Name and Tagline
    const nameEl = document.getElementById('hero-name');
    if (nameEl) nameEl.innerHTML = `<span class="text-slate-900 dark:text-white">${meta.name.split(' ')[0]}</span><br /><span class="gradient-text">${meta.name.split(' ').slice(1).join(' ')}</span>`;

    const taglineEl = document.getElementById('hero-tagline');
    if (taglineEl) taglineEl.textContent = meta.tagline;

    // Roles
    const rolesEl = document.getElementById('hero-roles');
    if (rolesEl && meta.roles) {
      rolesEl.innerHTML = meta.roles.map(role => `<span class="code-tag" role="listitem">${role}</span>`).join('');
    }

    // Photo
    const photoEl = document.getElementById('hero-photo');
    if (photoEl && meta.photo) photoEl.src = meta.photo;

    const ghLink = document.getElementById('hero-github');
    if (ghLink) ghLink.href = meta.github;

    const medLink = document.getElementById('hero-medium');
    if (medLink) medLink.href = meta.medium;
  }

  /* ── Stats ──────────────────────────────────────────── */
  function renderStats(stats) {
    const el = document.getElementById('stats-grid');
    if (!el) return;
    const colorMap = {
      indigo:  'text-indigo-600 dark:text-indigo-400',
      amber:   'text-amber-600 dark:text-amber-400',
      emerald: 'text-emerald-600 dark:text-emerald-400',
      violet:  'text-violet-600 dark:text-violet-400',
    };
    el.innerHTML = stats.map((s, i) => `
      <div class="stat-card glow-card ${s.color} p-5 text-center reveal" style="transition-delay:${i * 0.08}s">
        <div class="font-display text-3xl font-semibold ${colorMap[s.color] || colorMap.indigo} mb-1">${s.value}</div>
        <div class="text-xs font-mono text-slate-500 dark:text-slate-400 tracking-wide">${s.label}</div>
      </div>
    `).join('');
  }

  /* ── Skills ─────────────────────────────────────────── */
  function renderSkills(skills) {
    const el = document.getElementById('skills-grid');
    if (!el) return;

    const iconMap = {
      monitor: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2"/>`,
      server:  `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"/>`,
      chart:   `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`,
      layers:  `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>`,
    };

    const colorAccent = {
      indigo:  { text: 'text-indigo-600 dark:text-indigo-400',  bg: 'bg-indigo-100 dark:bg-indigo-900/40', grad: 'from-indigo-500 to-indigo-400'  },
      emerald: { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40', grad: 'from-emerald-500 to-emerald-400' },
      amber:   { text: 'text-amber-600 dark:text-amber-400',    bg: 'bg-amber-100 dark:bg-amber-900/40',   grad: 'from-amber-500 to-amber-400'    },
      violet:  { text: 'text-violet-600 dark:text-violet-400',  bg: 'bg-violet-100 dark:bg-violet-900/40', grad: 'from-violet-500 to-violet-400'  },
    };

    el.innerHTML = skills.map((s, gi) => {
      const c = colorAccent[s.color] || colorAccent.indigo;
      const bars = s.items.map((item, ii) => `
        <div class="mb-3">
          <div class="flex justify-between text-xs mb-1.5">
            <span class="text-slate-700 dark:text-slate-300 font-medium">${item.name}</span>
            <span class="font-mono text-slate-400">${item.level}%</span>
          </div>
          <div class="skill-bar-track">
            <div class="skill-bar-fill ${s.color} bg-gradient-to-r ${c.grad}" data-width="${item.level}" data-delay="${ii * 150}" style="width:0%"></div>
          </div>
        </div>
      `).join('');

      const chips = s.chips.map(ch => `<span class="chip">${ch}</span>`).join('');

      return `
        <div class="card p-6 reveal" style="transition-delay:${gi*0.1}s" data-skill-group>
          <div class="flex items-center gap-3 mb-5">
            <div class="w-9 h-9 rounded-xl ${c.bg} flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 ${c.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                ${iconMap[s.icon] || iconMap.monitor}
              </svg>
            </div>
            <span class="text-xs font-mono font-semibold ${c.text} uppercase tracking-widest">${s.layer}</span>
          </div>
          ${bars}
          <div class="flex flex-wrap gap-1.5 mt-4">${chips}</div>
        </div>
      `;
    }).join('');
  }

  /* ── Experience ─────────────────────────────────────── */
  function renderExperience(exp) {
    const el = document.getElementById('experience-list');
    if (!el) return;

    const colorDot = { indigo: '#6366f1', amber: '#f59e0b', emerald: '#10b981' };

    el.innerHTML = exp.map((job, i) => {
      const dot  = colorDot[job.color] || colorDot.indigo;
      const side = i % 2 === 0 ? 'left' : 'right';
      const ach  = job.achievements.map(a => `
        <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span class="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style="background:${dot}"></span>
          <span>${a}</span>
        </li>`).join('');
      const chips = job.chips.map(c => `<span class="chip">${c}</span>`).join('');

      return `
        <div class="relative flex flex-row md:flex-row gap-0 md:gap-6 mb-12 reveal" style="transition-delay:${i*0.12}s">
          <!-- Desktop Side Text (Empty on Mobile) -->
          <div class="hidden md:block md:w-1/2 ${side === 'left' ? 'pr-10 text-right order-1' : 'pl-10 text-left order-3'}">
            <span class="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">${job.period}</span>
            <h3 class="font-display text-lg font-semibold text-slate-900 dark:text-white mt-0.5">${job.title}</h3>
            <p class="text-sm font-medium" style="color:${dot}">${job.company}</p>
          </div>

          <!-- Dot / Indicator -->
          <div class="flex-shrink-0 z-20 order-1 md:absolute md:left-1/2 md:-ml-3.5 mt-1.5 ml-[2px] md:ml-0">
            <div class="w-7 h-7 rounded-full bg-white dark:bg-slate-900 border-2 flex items-center justify-center shadow-lg" style="border-color:${dot}">
              <div class="w-2.5 h-2.5 rounded-full" style="background:${dot}"></div>
            </div>
          </div>

          <!-- Card Content -->
          <div class="flex-grow md:w-1/2 order-2 ${side === 'left' ? 'md:order-3 md:pl-10' : 'md:order-1 md:pr-10'} ml-8 md:ml-0">
            <div class="md:hidden mb-2">
              <span class="text-xs font-mono text-amber-600 dark:text-amber-400 font-semibold">${job.period}</span>
              <h3 class="font-display text-lg font-semibold text-slate-900 dark:text-white">${job.title}</h3>
              <p class="text-sm font-medium" style="color:${dot}">${job.company}</p>
            </div>
            <div class="card-lifted rounded-xl p-5 hover:shadow-xl transition-shadow duration-300">
              <ul class="space-y-2">${ach}</ul>
              <div class="flex flex-wrap gap-1.5 mt-4">${chips}</div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /* ── Journey ────────────────────────────────────────── */
  function renderJourney(journey) {
    const el = document.getElementById('journey-grid');
    if (!el) return;

    const iconPaths = {
      book:  `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`,
      code:  `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>`,
      flask: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>`,
      chart: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>`,
      spark: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
    };

    const bgMap = {
      indigo:  'from-indigo-50 to-indigo-100/50 dark:from-indigo-900/40 dark:to-indigo-950/20 border-indigo-200 dark:border-indigo-700',
      emerald: 'from-emerald-50 to-emerald-100/50 dark:from-emerald-900/40 dark:to-emerald-950/20 border-emerald-200 dark:border-emerald-700',
      amber:   'from-amber-50 to-amber-100/50 dark:from-amber-900/40 dark:to-amber-950/20 border-amber-200 dark:border-amber-700',
      violet:  'from-violet-50 to-violet-100/50 dark:from-violet-900/40 dark:to-violet-950/20 border-violet-200 dark:border-violet-700',
    };
    const textMap = {
      indigo: 'text-indigo-600 dark:text-indigo-400',
      emerald:'text-emerald-600 dark:text-emerald-400',
      amber:  'text-amber-600 dark:text-amber-400',
      violet: 'text-violet-600 dark:text-violet-400',
    };

    el.innerHTML = journey.map((j, i) => `
      <div class="journey-item text-center reveal ${j.year === '∞' ? 'col-span-2 md:col-span-1' : ''}" style="transition-delay:${i*0.1}s">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${bgMap[j.color]} border flex items-center justify-center mb-3 shadow-md ${j.active ? 'pulse-glow' : ''} ${j.future ? 'border-dashed' : ''}">
          <svg class="w-7 h-7 ${textMap[j.color]}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${iconPaths[j.icon] || iconPaths.spark}
          </svg>
        </div>
        <div class="text-xs font-mono font-semibold ${j.future ? 'text-violet-600 dark:text-violet-400' : 'text-amber-600 dark:text-amber-400'}">${j.year}</div>
        <div class="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">${j.title}</div>
        <div class="text-xs text-slate-500 dark:text-slate-500">${j.sub}</div>
      </div>
    `).join('');
  }

  /* ── Projects ───────────────────────────────────────── */
  function renderProjects(projects) {
    const el = document.getElementById('projects-grid');
    if (!el) return;

    const topColors = {
      indigo:  'from-indigo-500 to-violet-500',
      amber:   'from-amber-400 to-orange-400',
      emerald: 'from-emerald-500 to-teal-400',
    };
    const iconColors = {
      indigo:  'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
      amber:   'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    };
    const tagColors = {
      indigo:  'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
      amber:   'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      emerald: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
    };
    const impactColors = {
      emerald: 'text-emerald-600 dark:text-emerald-400',
      amber:   'text-amber-600 dark:text-amber-400',
    };

    el.innerHTML = projects.map((p, i) => `
      <div class="project-card card rounded-2xl overflow-hidden reveal group" style="transition-delay:${i*0.1}s">
        <div class="h-1.5 bg-gradient-to-r ${topColors[p.color] || topColors.indigo}"></div>
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="w-10 h-10 rounded-xl ${iconColors[p.color]} flex items-center justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
              </svg>
            </div>
            <span class="text-xs font-mono px-2.5 py-1 rounded-full ${tagColors[p.color]}">${p.category}</span>
          </div>
          <h3 class="font-display text-lg font-semibold text-slate-900 dark:text-white mb-3">${p.title}</h3>
          <div class="space-y-2.5 mb-4">
            <div>
              <p class="text-xs font-mono text-slate-400 uppercase tracking-wider mb-0.5">Problem</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">${p.problem}</p>
            </div>
            <div>
              <p class="text-xs font-mono text-slate-400 uppercase tracking-wider mb-0.5">Approach</p>
              <p class="text-sm text-slate-600 dark:text-slate-400">${p.approach}</p>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5 mb-4">
            ${p.chips.map(c => `<span class="chip">${c}</span>`).join('')}
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-1.5 text-xs ${impactColors[p.impactColor] || impactColors.emerald} font-medium">
              <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
              ${p.impact}
            </div>
            <a href="${p.github}" target="_blank" rel="noopener" class="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              GitHub
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          </div>
        </div>
      </div>
    `).join('');
  }

  /* ── Articles ───────────────────────────────────────── */
  function renderArticles(articles) {
    const el = document.getElementById('articles-grid');
    if (!el) return;

    el.innerHTML = articles.map((a, i) => `
      <div class="card p-5 group reveal h-full flex flex-col" style="transition-delay:${i*0.08}s">
        <div class="mb-3"><span class="chip">${a.tag}</span></div>
        <h3 class="font-display text-base font-semibold text-slate-900 dark:text-white transition-colors mb-2">${a.title}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed flex-grow">${a.summary}</p>
        <div class="mt-auto">
          <a href="https://medium.com/@tilakpoudel" target="_blank" rel="noopener" 
             class="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:text-amber-600 dark:hover:text-amber-400 transition-colors group/link" 
             aria-label="Read article: ${a.title}">
            Read on Medium
            <svg class="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7-7 7M3 12h18"/>
            </svg>
          </a>
        </div>
      </div>
    `).join('');
  }

  /* ── Courses ────────────────────────────────────────── */
  function renderCourses(courses) {
    const el = document.getElementById('courses-list');
    if (!el) return;

    const iconMap = {
      spark: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
      db:    `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/>`,
      code:  `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>`,
    };
    const bgMap = {
      indigo:  'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',
      amber:   'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    };

    el.innerHTML = courses.map((c, i) => `
      <div class="card-lifted rounded-xl p-5 flex items-start gap-4 reveal" style="transition-delay:${i*0.1}s">
        <div class="w-10 h-10 rounded-xl ${bgMap[c.color]} flex items-center justify-center flex-shrink-0">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">${iconMap[c.icon] || iconMap.spark}</svg>
        </div>
        <div>
          <h4 class="font-semibold text-slate-900 dark:text-white text-sm mb-1">${c.name}</h4>
          <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">${c.desc}</p>
        </div>
      </div>
    `).join('');
  }

  /* ── Service Topics ─────────────────────────────────── */
  function renderServiceTopics(service) {
    const el = document.getElementById('service-topics');
    if (!el || !service) return;
    el.innerHTML = service.topics.map(t => `<span class="chip amber">${t}</span>`).join('');

    const seminarsEl = document.getElementById('service-seminars');
    const engagedEl  = document.getElementById('service-engaged');
    if (seminarsEl) seminarsEl.textContent = service.seminars;
    if (engagedEl)  engagedEl.textContent  = service.engaged;
  }

  /* ── Initial wisdom ─────────────────────────────────── */
  function setInitialWisdom(w) {
    if (!w) return;
    const san   = document.getElementById('wisdom-sanskrit');
    const trans = document.getElementById('wisdom-translation');
    const src   = document.getElementById('wisdom-source');
    if (san)   san.textContent   = '"' + w.sanskrit + '"';
    if (trans) trans.textContent = w.translation;
    if (src)   src.textContent   = '— ' + w.source;
  }
  /* ── Recommendations ────────────────────────────────── */
  function renderRecommendations(recs) {
    const el = document.getElementById('recommendations-container');
    if (!el || !recs) return;

    el.innerHTML = recs.map((r, i) => {
      const needsTruncation = r.text.length > 100;
      const displayContent  = needsTruncation ? r.text.slice(0, 200) + '...' : r.text;
      
      return `
        <div class="rec-card glow-card indigo p-6 reveal h-full flex flex-col group/rec" style="transition-delay:${i * 0.1}s">
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-indigo-900/50 flex-shrink-0">
                <img src="${r.avatar}" alt="${r.name}" class="w-full h-full object-cover">
              </div>
              <div>
                <h4 class="font-display font-semibold text-slate-900 dark:text-white text-sm">${r.name}</h4>
                <p class="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">${r.position}</p>
              </div>
            </div>
            ${r.url ? `
              <a href="${r.url}" target="_blank" rel="noopener" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all shadow-sm" title="View LinkedIn Profile">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
              </a>
            ` : ''}
          </div>
          <div class="relative flex-grow flex flex-col justify-between">
            <svg class="absolute -top-2 -left-2 w-8 h-8 text-indigo-500/10" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
            <div 
              class="recommendation-text text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic relative z-10" 
              id="rec-text-${i}"
              data-full="${r.text}"
              data-short="${displayContent}"
            >
              "${displayContent}"
            </div>
            ${needsTruncation ? `<span class="cursor-pointer read-more-btn" onclick="UI.toggleReadMore(${i})">Read More</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /* ── Offerings ───────────────────────────────────────── */
  function renderOfferings(offerings) {
    const el = document.getElementById('offerings-grid');
    if (!el || !offerings) return;

    const iconPaths = {
      code:   `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>`,
      mentor: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>`,
      book:   `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>`,
      spark:  `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>`,
    };

    const colorMap = {
      indigo:  'from-indigo-500 to-indigo-600 shadow-indigo-200 dark:shadow-indigo-900/20',
      amber:   'from-amber-400 to-amber-500 shadow-amber-200 dark:shadow-amber-900/20',
      emerald: 'from-emerald-400 to-emerald-500 shadow-emerald-200 dark:shadow-emerald-900/20',
      violet:  'from-violet-500 to-violet-600 shadow-violet-200 dark:shadow-violet-900/20',
    };

    el.innerHTML = offerings.map((o, i) => `
      <div class="glow-card ${o.color} p-8 reveal" style="transition-delay:${i * 0.12}s">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${colorMap[o.color]} flex items-center justify-center text-white mb-6 shadow-xl transform group-hover:rotate-6 transition-transform">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            ${iconPaths[o.icon] || iconPaths.spark}
          </svg>
        </div>
        <h3 class="font-display text-xl font-semibold text-slate-900 dark:text-white mb-4">${o.title}</h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          ${o.desc}
        </p>
      </div>
    `).join('');
  }

  /* ── Clients ─────────────────────────────────────────── */
  function renderClients(clients) {
    const rail = document.getElementById('clients-rail');
    if (!rail || !clients) return;

    // Double the items for seamless loop
    const doubled = [...clients, ...clients];
    
    rail.innerHTML = doubled.map(c => `
      <div class="logo-item group/logo" title="${c.name}">
        <img src="${c.logo}" alt="${c.name} logo" class="max-h-16 transition-all">
        ${c.url ? `
          <a href="${c.url}" target="_blank" rel="noopener" class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center text-slate-400 opacity-0 group-hover/logo:opacity-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm z-10" title="Visit Website">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
          </a>
        ` : ''}
      </div>
    `).join('');
  }

})();
