/* ═══════════════════════════════════════════════════════════════
   JusticeCMS — Course Application  (js/app.js)
   Handles: routing, sidebar, quiz, terminal, progress, search
═══════════════════════════════════════════════════════════════ */

'use strict';

// ─── Storage key ───────────────────────────────────────────────
const STORAGE_KEY = 'justicecms_progress';

// ─── Progress helpers ──────────────────────────────────────────
const Progress = {
  _data: null,
  load() {
    if (this._data) return this._data;
    try { this._data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch { this._data = {}; }
    return this._data;
  },
  save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data)); } catch {} },
  isDone(id)    { return !!this.load()[id]; },
  mark(id, v=true) { this.load()[id] = v; this.save(); },
  countDone()   { return Object.values(this.load()).filter(Boolean).length; },
  totalLessons() {
    let n = 0;
    COURSE_DATA.modules.forEach(m => n += m.lessons.length);
    return n;
  },
  pct() { return Math.round((this.countDone() / (this.totalLessons() || 1)) * 100); }
};

// ─── Flat lesson index (for prev/next) ─────────────────────────
function buildFlatIndex() {
  const flat = [];
  COURSE_DATA.modules.forEach(mod => {
    mod.lessons.forEach(les => flat.push({ modId: mod.id, lesId: les.id, title: les.title, modTitle: mod.title }));
  });
  return flat;
}

// ─── DOM helpers ───────────────────────────────────────────────
const $  = id => document.getElementById(id);
const el = (tag, cls, html='') => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };

// ─── App object ────────────────────────────────────────────────
const app = {
  flat: [],
  currentId: null,   // "modId/lesId"

  init() {
    this.flat = buildFlatIndex();
    this.buildSidebar();
    this.updateRing();
    this.initSearch();
    this.initSidebarToggle();
    this.initKeyNav();

    // Route from hash
    const hash = location.hash.replace('#','');
    if (hash) this.navigate(hash);
    else this.showWelcome();

    window.addEventListener('hashchange', () => {
      const h = location.hash.replace('#','');
      if (h) this.navigate(h); else this.showWelcome();
    });
  },

  // ── Build sidebar nav tree ────────────────────────────────────
  buildSidebar() {
    const nav = $('sidebarNav');
    nav.innerHTML = '';
    COURSE_DATA.modules.forEach(mod => {
      const modDone = mod.lessons.every(l => Progress.isDone(mod.id + '/' + l.id));

      const header = el('div', 'sidebar-module-header');
      header.dataset.mod = mod.id;
      header.innerHTML = `
        <div class="mod-badge">${mod.num}</div>
        <span class="mod-label">${mod.title}</span>
        ${modDone ? '<span class="mod-check">✓</span>' : ''}
        <span class="chevron">›</span>`;

      const lessonsDiv = el('div', 'sidebar-lessons');
      mod.lessons.forEach(les => {
        const id = mod.id + '/' + les.id;
        const a = el('a', 'sidebar-lesson' + (Progress.isDone(id) ? ' done' : ''));
        a.href = '#' + id;
        a.dataset.id = id;
        a.textContent = les.title;
        lessonsDiv.appendChild(a);
      });

      header.addEventListener('click', () => {
        header.classList.toggle('open');
        lessonsDiv.classList.toggle('open');
      });

      const wrap = el('div', 'sidebar-module');
      wrap.appendChild(header);
      wrap.appendChild(lessonsDiv);
      nav.appendChild(wrap);
    });
  },

  // ── Navigate to a lesson ──────────────────────────────────────
  navigate(id) {
    // id format: "m00/l01"  or  "m00"
    let modId = id, lesId = null;
    if (id.includes('/')) { [modId, lesId] = id.split('/'); }
    else {
      const mod = COURSE_DATA.modules.find(m => m.id === modId);
      if (mod) lesId = mod.lessons[0]?.id;
    }

    const mod = COURSE_DATA.modules.find(m => m.id === modId);
    if (!mod) { this.showWelcome(); return; }

    const les = mod.lessons.find(l => l.id === lesId) || mod.lessons[0];
    if (!les) { this.showWelcome(); return; }

    this.currentId = mod.id + '/' + les.id;
    location.hash = this.currentId;   // keep hash in sync

    this.renderLesson(mod, les);
    this.updateSidebarActive(mod.id, les.id);
    this.updateRing();
    $('headerCrumb').textContent = `${mod.title} › ${les.title}`;

    // Scroll main to top
    document.querySelector('.course-main')?.scrollTo(0, 0);

    // Close sidebar on mobile
    if (window.innerWidth <= 768) this.closeSidebar();
  },

  // ── Render a lesson ───────────────────────────────────────────
  renderLesson(mod, les) {
    $('welcomeScreen').style.display = 'none';
    const wrapper = $('lessonWrapper');
    wrapper.style.display = 'block';

    const fullId = mod.id + '/' + les.id;
    const done = Progress.isDone(fullId);

    // Prev / Next
    const idx = this.flat.findIndex(f => f.modId === mod.id && f.lesId === les.id);
    const prev = this.flat[idx - 1] || null;
    const next = this.flat[idx + 1] || null;

    wrapper.innerHTML = `
      <div class="lesson-header">
        <div class="lesson-meta">
          <span class="lesson-tag">Module ${mod.num}</span>
          <span class="lesson-num">${les.id.toUpperCase()}</span>
          ${les.duration ? `<span class="lesson-time">${les.duration}</span>` : ''}
        </div>
        <h1 class="lesson-title">${les.title}</h1>
        ${les.intro ? `<p class="lesson-intro">${les.intro}</p>` : ''}
      </div>
      ${les.builds ? `<div class="build-tracker"><span class="bt-icon">🔨</span><div><span class="bt-label">What you'll add to JusticeCMS</span><span class="bt-value">${les.builds}</span></div></div>` : ''}
      <div class="lesson-body" id="lessonBody"></div>
      <div class="lesson-nav">
        <a class="lesson-nav-btn ${!prev ? 'disabled' : ''}" href="${prev ? '#' + prev.modId + '/' + prev.lesId : '#'}">
          <span class="nav-arrow">←</span>
          <div><span class="nav-sub">Previous</span><span class="nav-name">${prev ? prev.title : '—'}</span></div>
        </a>
        <button class="mark-complete-btn ${done ? 'done' : ''}" id="markBtn" data-id="${fullId}">
          ${done ? '✓ Completed' : 'Mark Complete'}
        </button>
        <a class="lesson-nav-btn ${!next ? 'disabled' : ''}" href="${next ? '#' + next.modId + '/' + next.lesId : '#'}">
          <div style="text-align:right"><span class="nav-sub">Next</span><span class="nav-name">${next ? next.title : '—'}</span></div>
          <span class="nav-arrow">→</span>
        </a>
      </div>`;

    // Render content blocks
    const body = $('lessonBody');
    if (les.content) {
      if (typeof les.content === 'string') {
        body.innerHTML = les.content;
      } else if (Array.isArray(les.content)) {
        les.content.forEach(block => body.appendChild(this.renderBlock(block)));
      }
    }

    // Wire mark-complete button
    $('markBtn')?.addEventListener('click', e => {
      const id = e.currentTarget.dataset.id;
      if (Progress.isDone(id)) return;
      Progress.mark(id, true);
      e.currentTarget.textContent = '✓ Completed';
      e.currentTarget.classList.add('done');
      this.updateRing();
      this.buildSidebar();
      this.updateSidebarActive(mod.id, les.id);
    });

    // Init interactive elements
    this.initCopyButtons();
    this.initQuizzes();
    this.initTerminals();
  },

  // ── Render a content block ────────────────────────────────────
  renderBlock(block) {
    switch (block.type) {
      case 'md': {
        const div = el('div', 'lesson-body-md');
        div.innerHTML = block.content;
        return div;
      }
      case 'code': {
        const wrap = el('div', 'code-block');
        wrap.innerHTML = `
          <div class="code-header">
            <span class="code-lang">${block.lang || 'code'}</span>
            ${block.file ? `<span class="code-file">${block.file}</span>` : ''}
            <button class="btn-copy">Copy</button>
          </div>
          <pre>${block.code}</pre>`;
        return wrap;
      }
      case 'callout': {
        const icons = { info:'ℹ️', warn:'⚠️', tip:'💡', key:'🔑' };
        const div = el('div', `callout ${block.variant || 'info'}`);
        div.innerHTML = `<span class="callout-icon">${icons[block.variant]||'ℹ️'}</span>
          <div class="callout-body"><strong>${block.label||block.variant}</strong>${block.content}</div>`;
        return div;
      }
      case 'quiz': {
        return this.buildQuizBlock(block);
      }
      case 'terminal': {
        return this.buildTerminal(block);
      }
      case 'exercise': {
        const div = el('div', 'exercise');
        div.innerHTML = `<div class="exercise-badge">🏋️ Exercise</div>
          <h3>${block.title}</h3>
          <div>${block.content}</div>`;
        return div;
      }
      default: {
        const div = el('div','');
        div.innerHTML = block.content || '';
        return div;
      }
    }
  },

  // ── Quiz builder ──────────────────────────────────────────────
  buildQuizBlock(block) {
    const div = el('div', 'quiz-block');
    const letters = ['A','B','C','D','E'];
    let answered = 0;
    let correct  = 0;

    const questions = block.questions || [block];  // support single-q

    questions.forEach((q, qi) => {
      const qDiv = el('div', 'quiz-question-wrap');
      qDiv.innerHTML = `<div class="quiz-label">Quiz ${questions.length > 1 ? (qi+1) + '/' + questions.length : ''}</div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-options" id="qopts_${qi}"></div>
        <div class="quiz-explanation" id="qexp_${qi}">${q.explanation||''}</div>`;
      div.appendChild(qDiv);

      const optsDiv = qDiv.querySelector('.quiz-options');
      q.options.forEach((opt, oi) => {
        const btn = el('div', 'quiz-option');
        btn.innerHTML = `<div class="opt-letter">${letters[oi]}</div><span>${opt}</span>`;
        btn.addEventListener('click', () => {
          if (btn.classList.contains('locked') || optsDiv.querySelector('.locked')) return;
          // lock all
          optsDiv.querySelectorAll('.quiz-option').forEach(b => b.classList.add('locked'));
          const isCorrect = oi === q.correct;
          btn.classList.add(isCorrect ? 'correct' : 'wrong');
          if (!isCorrect) optsDiv.querySelectorAll('.quiz-option')[q.correct].classList.add('correct');
          qDiv.querySelector('.quiz-explanation').classList.add('visible');
          answered++;
          if (isCorrect) correct++;
        });
        optsDiv.appendChild(btn);
      });
    });

    return div;
  },

  // ── Terminal builder ──────────────────────────────────────────
  buildTerminal(block) {
    const id = 'term_' + Math.random().toString(36).slice(2);
    const div = el('div', 'terminal');
    div.innerHTML = `
      <div class="terminal-titlebar">
        <div class="terminal-dot red"></div>
        <div class="terminal-dot yellow"></div>
        <div class="terminal-dot green"></div>
        <span class="terminal-label">${block.title || 'Terminal'}</span>
      </div>
      <div class="terminal-output" id="${id}_out"></div>
      <div class="terminal-input-row">
        <span class="t-prompt">${block.prompt || 'user@server:~$'}&nbsp;</span>
        <input class="terminal-input" id="${id}_inp" type="text" spellcheck="false" autocomplete="off" placeholder="type a command…">
      </div>
      <div class="terminal-hint">Try: ${(block.hints || ['ls','pwd','python3 --version']).join(', ')}</div>`;

    // Pre-populate output
    const out = div.querySelector('.terminal-output');
    if (block.intro) {
      const line = el('div', '');
      line.innerHTML = `<span class="t-info">${block.intro}</span>`;
      out.appendChild(line);
    }

    // Command handler
    const inp = div.querySelector('.terminal-input');
    const history = [];
    let histIdx = -1;

    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = inp.value.trim();
        if (!cmd) return;
        history.unshift(cmd); histIdx = -1;
        inp.value = '';
        this.runTerminalCmd(out, cmd, block);
      }
      if (e.key === 'ArrowUp') { e.preventDefault(); histIdx = Math.min(histIdx+1, history.length-1); inp.value = history[histIdx]||''; }
      if (e.key === 'ArrowDown') { e.preventDefault(); histIdx = Math.max(histIdx-1, -1); inp.value = history[histIdx]||''; }
    });

    return div;
  },

  // ── Terminal command executor ─────────────────────────────────
  runTerminalCmd(out, cmd, block) {
    const addLine = (cls, text) => {
      const row = el('div','');
      row.innerHTML = `<span class="${cls}">${escHtml(text)}</span>`;
      out.appendChild(row);
      out.scrollTop = out.scrollHeight;
    };

    const prompt = block.prompt || 'user@server:~$';
    // echo the command
    const echo = el('div','');
    echo.innerHTML = `<span class="t-prompt">${escHtml(prompt)}&nbsp;</span><span class="t-cmd">${escHtml(cmd)}</span>`;
    out.appendChild(echo);

    // Custom commands from block
    if (block.commands && block.commands[cmd]) {
      const resp = block.commands[cmd];
      if (Array.isArray(resp)) resp.forEach(r => addLine('t-out', r));
      else addLine('t-out', resp);
      return;
    }

    // Built-in simulated commands
    const c = cmd.split(' ')[0];
    const args = cmd.slice(c.length).trim();

    const builtins = {
      pwd:  () => ['/home/user'],
      whoami: () => ['user'],
      date: () => [new Date().toString()],
      echo: () => [args],
      clear: () => { out.innerHTML = ''; return []; },
      ls:   () => ['app/  config/  requirements.txt  .env  docker-compose.yml'],
      'ls -la': () => [
        'total 28',
        'drwxr-xr-x 4 user user 4096 Jan 01 00:00 .',
        'drwxr-xr-x 8 user user 4096 Jan 01 00:00 ..',
        'drwxr-xr-x 3 user user 4096 Jan 01 00:00 app',
        '-rw-r--r-- 1 user user  312 Jan 01 00:00 requirements.txt',
        '-rw------- 1 user user  128 Jan 01 00:00 .env',
      ],
      python3: () => args === '--version' ? ['Python 3.12.0'] : ['>>> (interactive mode — not supported in simulator)'],
      pip:    () => args.startsWith('install') ? [`Collecting ${args.slice(8)}`, 'Successfully installed.'] : ['pip 23.0'],
      'python3 --version': () => ['Python 3.12.0'],
      'pip --version': () => ['pip 23.0 from /usr/lib/python3/dist-packages (python 3.12)'],
      'which python3': () => ['/usr/bin/python3'],
      uname: () => ['Linux server 6.1.0 #1 SMP x86_64 GNU/Linux'],
      'uname -a': () => ['Linux server 6.1.0-22-generic #22-Ubuntu SMP x86_64 x86_64 x86_64 GNU/Linux'],
      cat:   () => args ? [`(contents of ${args} — not available in simulator)`] : ['cat: missing file operand'],
      mkdir: () => args ? [`mkdir: created directory '${args}'`] : ['mkdir: missing operand'],
      cd:    () => ['(directory changed — simulated)'],
      help:  () => ['Available: pwd, ls, cd, whoami, date, echo, clear, uname, python3, pip, cat, mkdir, help'],
    };

    const handler = builtins[cmd] || builtins[c];
    if (handler) {
      const lines = handler();
      lines.forEach(l => l && addLine('t-out', l));
    } else {
      addLine('t-err', `bash: ${c}: command not found`);
      addLine('t-out', 'Type "help" to see available simulated commands.');
    }
  },

  // ── Copy buttons ──────────────────────────────────────────────
  initCopyButtons() {
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const pre = btn.closest('.code-block')?.querySelector('pre');
        if (!pre) return;
        const text = pre.innerText || pre.textContent;
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 2000);
        }).catch(() => {
          // Fallback
          const ta = document.createElement('textarea');
          ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
        });
      });
    });
  },

  // ── Quiz init (for string-rendered quizzes) ───────────────────
  initQuizzes() {
    // Quizzes built dynamically via renderBlock are already wired.
    // This handles any raw .quiz-block HTML in string content.
    document.querySelectorAll('.quiz-option:not([data-wired])').forEach(opt => {
      opt.dataset.wired = '1';
      opt.addEventListener('click', () => {
        if (opt.closest('.quiz-options').querySelector('.locked')) return;
        const correct = opt.dataset.correct === '1';
        opt.closest('.quiz-options').querySelectorAll('.quiz-option').forEach(o => o.classList.add('locked'));
        opt.classList.add(correct ? 'correct' : 'wrong');
        if (!correct) opt.closest('.quiz-options').querySelector('[data-correct="1"]').classList.add('correct');
        opt.closest('.quiz-block')?.querySelector('.quiz-explanation')?.classList.add('visible');
      });
    });
  },

  // ── Terminal init ─────────────────────────────────────────────
  initTerminals() { /* terminals are self-contained via buildTerminal */ },

  // ── Sidebar active state ──────────────────────────────────────
  updateSidebarActive(modId, lesId) {
    const fullId = modId + '/' + lesId;
    document.querySelectorAll('.sidebar-lesson').forEach(a => {
      a.classList.toggle('active', a.dataset.id === fullId);
    });
    document.querySelectorAll('.sidebar-module-header').forEach(h => {
      const isActive = h.dataset.mod === modId;
      h.classList.toggle('active', isActive);
      if (isActive && !h.classList.contains('open')) {
        h.classList.add('open');
        h.nextElementSibling?.classList.add('open');
      }
    });
  },

  // ── Progress ring ─────────────────────────────────────────────
  updateRing() {
    const pct = Progress.pct();
    const ring = $('ringFill');
    const circumference = 87.96;
    if (ring) ring.style.strokeDashoffset = circumference - (circumference * pct / 100);
    const pctEl = $('ringPct');
    if (pctEl) pctEl.textContent = pct + '%';
  },

  // ── Welcome screen ────────────────────────────────────────────
  showWelcome() {
    $('welcomeScreen').style.display = 'flex';
    $('lessonWrapper').style.display = 'none';
    $('headerCrumb').textContent = 'Select a lesson';
    this.currentId = null;

    const done = Progress.countDone();
    const total = Progress.totalLessons();
    const stats = $('welcomeStats');
    if (stats && done > 0) {
      stats.innerHTML = `Progress: <strong>${done}</strong> of <strong>${total}</strong> lessons complete (${Progress.pct()}%)`;
    }

    document.querySelectorAll('.sidebar-lesson.active').forEach(a => a.classList.remove('active'));
  },

  goToFirst() {
    const first = this.flat[0];
    if (first) this.navigate(first.modId + '/' + first.lesId);
  },

  // ── Search ────────────────────────────────────────────────────
  initSearch() {
    const input = $('searchInput');
    const results = $('searchResults');
    if (!input || !results) return;

    let activeIdx = -1;
    const items = () => results.querySelectorAll('.search-result-item');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      results.innerHTML = '';
      activeIdx = -1;
      if (q.length < 2) { results.classList.remove('open'); return; }

      const hits = [];
      COURSE_DATA.modules.forEach(mod => {
        mod.lessons.forEach(les => {
          const haystack = (mod.title + ' ' + les.title + ' ' + (les.intro||'')).toLowerCase();
          if (haystack.includes(q)) hits.push({ mod, les });
        });
      });

      if (!hits.length) {
        results.innerHTML = '<div class="search-result-item" style="color:var(--text-muted)">No results</div>';
      } else {
        hits.slice(0,12).forEach(({ mod, les }) => {
          const id = mod.id + '/' + les.id;
          const div = el('div', 'search-result-item');
          div.innerHTML = `<strong>M${mod.num} — ${mod.title}</strong>${les.title}`;
          div.addEventListener('click', () => {
            input.value = ''; results.classList.remove('open');
            this.navigate(id);
          });
          results.appendChild(div);
        });
      }
      results.classList.add('open');
    });

    input.addEventListener('keydown', e => {
      const its = items();
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIdx = Math.min(activeIdx+1, its.length-1); its.forEach((i,x) => i.classList.toggle('active', x===activeIdx)); }
      if (e.key === 'ArrowUp')   { e.preventDefault(); activeIdx = Math.max(activeIdx-1, 0); its.forEach((i,x) => i.classList.toggle('active', x===activeIdx)); }
      if (e.key === 'Enter' && activeIdx >= 0) its[activeIdx].click();
      if (e.key === 'Escape') { results.classList.remove('open'); input.blur(); }
    });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-wrap')) results.classList.remove('open');
    });
  },

  // ── Sidebar toggle (mobile + desktop) ─────────────────────────
  initSidebarToggle() {
    const btn = $('sidebarToggle');
    const sidebar = $('sidebar');
    const overlay = $('sidebarOverlay');
    btn?.addEventListener('click', () => this.toggleSidebar());
    overlay?.addEventListener('click', () => this.closeSidebar());
  },

  toggleSidebar() {
    const sidebar = $('sidebar');
    const overlay = $('sidebarOverlay');
    const isOpen  = sidebar.classList.contains('open');
    if (isOpen) this.closeSidebar();
    else { sidebar.classList.add('open'); overlay.classList.add('open'); }
  },

  closeSidebar() {
    $('sidebar')?.classList.remove('open');
    $('sidebarOverlay')?.classList.remove('open');
  },

  // ── Keyboard navigation ───────────────────────────────────────
  initKeyNav() {
    document.addEventListener('keydown', e => {
      // Don't intercept when typing in inputs
      if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        if (!this.currentId) { this.goToFirst(); return; }
        const idx = this.flat.findIndex(f => f.modId + '/' + f.lesId === this.currentId);
        const target = e.key === 'ArrowRight' ? this.flat[idx+1] : this.flat[idx-1];
        if (target) this.navigate(target.modId + '/' + target.lesId);
      }
      if (e.key === '/') { e.preventDefault(); $('searchInput')?.focus(); }
    });
  }
};

// ─── Utility ───────────────────────────────────────────────────
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ─── Boot ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => app.init());
