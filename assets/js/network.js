/* ═══════════════════════════════════════════════════════════════════
   NETWORK VISUALIZATION MODULE
   Interactive knowledge-graph canvas for The Engineer's Mind
   ═══════════════════════════════════════════════════════════════════ */

const NetworkViz = (() => {
  let canvas, ctx;
  let nodes = [];
  let edges = [];
  let nodeDetails = {};
  let hoveredNode = null;
  let selectedNode = null;
  let animId = null;
  let startTime = null;
  let devicePR = 1;

  /* ── Init ───────────────────────────────────────────── */
  function init(data) {
    canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    devicePR = window.devicePixelRatio || 1;

    // Build nodes from data
    nodes = data.networkNodes.map(n => ({
      ...n,
      x: 0, y: 0,
      r: n.center ? 42 : 28,
      textColor: '#fff',
    }));

    // Edges: all outer nodes connect to center; some connect to each other
    edges = [
      [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],
      [1,3],[1,4],[2,3],[5,6],[2,5]
    ];

    nodeDetails = data.networkNodeDetails || {};

    resize();
    window.addEventListener('resize', resize);
    bindEvents();

    startTime = performance.now();
    animId = requestAnimationFrame(loop);
  }

  /* ── Resize ─────────────────────────────────────────── */
  function resize() {
    if (!canvas) return;
    const parent = canvas.parentElement;
    const cssW = parent.clientWidth;
    const cssH = Math.min(460, cssW * 0.58);

    canvas.width  = cssW * devicePR;
    canvas.height = cssH * devicePR;
    canvas.style.width  = cssW + 'px';
    canvas.style.height = cssH + 'px';

    ctx.scale(devicePR, devicePR);
    placeNodes(cssW, cssH);
  }

  function cssW() { return canvas.width  / devicePR; }
  function cssH() { return canvas.height / devicePR; }

  /* ── Node placement ─────────────────────────────────── */
  function placeNodes(w, h) {
    const cx = w / 2, cy = h / 2;
    const r  = Math.min(w, h) * 0.315;
    nodes[0].x = cx; nodes[0].y = cy;
    for (let i = 1; i < nodes.length; i++) {
      const rad = (nodes[i].angle * Math.PI) / 180;
      nodes[i].x = cx + r * Math.cos(rad);
      nodes[i].y = cy + r * Math.sin(rad);
    }
  }

  /* ── Animation loop ─────────────────────────────────── */
  function loop(ts) {
    const t = ts - startTime;
    ctx.clearRect(0, 0, cssW(), cssH());

    wobbleNodes(t);
    drawEdges(t);
    drawNodes(t);

    animId = requestAnimationFrame(loop);
  }

  /* ── Wobble outer nodes ─────────────────────────────── */
  function wobbleNodes(t) {
    const cx = cssW() / 2, cy = cssH() / 2;
    const r  = Math.min(cssW(), cssH()) * 0.315;
    for (let i = 1; i < nodes.length; i++) {
      const base = (nodes[i].angle * Math.PI) / 180;
      const w    = Math.sin(t * 0.00075 + i * 1.15) * 0.028;
      nodes[i].x = cx + r * Math.cos(base + w);
      nodes[i].y = cy + r * Math.sin(base + w);
    }
  }

  /* ── Draw edges ─────────────────────────────────────── */
  function drawEdges(t) {
    const dark = document.documentElement.classList.contains('dark');
    edges.forEach(([a, b]) => {
      const na = nodes[a], nb = nodes[b];
      const hl = hoveredNode === a || hoveredNode === b || selectedNode === a || selectedNode === b;
      const alpha = hl ? 0.55 : 0.16;

      // Edge line
      ctx.beginPath();
      ctx.moveTo(na.x, na.y);
      ctx.lineTo(nb.x, nb.y);
      ctx.strokeStyle = dark
        ? `rgba(165,180,252,${alpha})`
        : `rgba(99,102,241,${alpha})`;
      ctx.lineWidth = hl ? 2 : 1;
      ctx.stroke();

      // Traveling particle on highlighted edge
      if (hl) {
        const p = (t * 0.00085) % 1;
        const px = na.x + (nb.x - na.x) * p;
        const py = na.y + (nb.y - na.y) * p;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 5);
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });
  }

  /* ── Draw nodes ─────────────────────────────────────── */
  function drawNodes() {
    nodes.forEach((n, i) => {
      const hl  = hoveredNode === i || selectedNode === i;
      const scale = hl ? 1.18 : 1;
      const r = n.r * scale;

      // Outer glow
      if (hl || n.center) {
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2.4);
        grd.addColorStop(0, n.color + '38');
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // Pulse ring for center
      if (n.center) {
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.002);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r + 10 + pulse * 6, 0, Math.PI * 2);
        ctx.strokeStyle = n.color + '28';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Circle fill
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);

      // Gradient fill
      const fillGrd = ctx.createRadialGradient(n.x - r * 0.3, n.y - r * 0.3, 0, n.x, n.y, r);
      fillGrd.addColorStop(0, lighten(n.color, 30));
      fillGrd.addColorStop(1, n.color);
      ctx.fillStyle = fillGrd;
      ctx.fill();

      // Border
      ctx.strokeStyle = n.color + 'aa';
      ctx.lineWidth = hl ? 2.5 : 1.5;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const lines = n.label.split('\n');
      const lh = 13;
      const isCenter = n.center;
      ctx.font = `${isCenter ? '600' : '500'} ${isCenter ? '11' : '9.5'}px 'Instrument Sans', sans-serif`;

      const totalH = (lines.length - 1) * lh;
      lines.forEach((line, li) => {
        ctx.fillText(line, n.x, n.y - totalH / 2 + li * lh);
      });
      ctx.restore();
    });
  }

  /* ── Lighten hex color ──────────────────────────────── */
  function lighten(hex, amount) {
    const num = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
  }

  /* ── Get node at coords ─────────────────────────────── */
  function getNodeAt(x, y) {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (Math.hypot(x - n.x, y - n.y) <= n.r + 8) return i;
    }
    return null;
  }

  function canvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  }

  /* ── Events ─────────────────────────────────────────── */
  function bindEvents() {
    canvas.addEventListener('mousemove', e => {
      const { x, y } = canvasCoords(e);
      hoveredNode = getNodeAt(x, y);
      canvas.style.cursor = hoveredNode !== null ? 'pointer' : 'crosshair';
    });

    canvas.addEventListener('mouseleave', () => { hoveredNode = null; });

    canvas.addEventListener('click', e => {
      const { x, y } = canvasCoords(e);
      const ni = getNodeAt(x, y);
      if (ni !== null && ni !== 0) {
        selectedNode = ni;
        showNodePanel(ni);
      } else if (ni === null) {
        selectedNode = null;
        hideNodePanel();
      }
    });

    canvas.addEventListener('touchend', e => {
      e.preventDefault();
      const { x, y } = canvasCoords(e.changedTouches[0]);
      const ni = getNodeAt(x, y);
      if (ni !== null && ni !== 0) { selectedNode = ni; showNodePanel(ni); }
    }, { passive: false });
  }

  /* ── Info panel ─────────────────────────────────────── */
  function showNodePanel(i) {
    const n    = nodes[i];
    const key  = n.label.replace('\n', ' ');
    const data = nodeDetails[key];
    const panel = document.getElementById('node-info');
    if (!panel) return;

    document.getElementById('node-title').textContent = key;
    document.getElementById('node-desc').textContent  = data ? data.desc : '';

    const skillsEl = document.getElementById('node-skills');
    skillsEl.innerHTML = '';
    (data?.skills || []).forEach(s => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = s;
      skillsEl.appendChild(chip);
    });

    panel.style.borderLeftColor = n.color;
    panel.classList.remove('hidden', 'opacity-0');
    panel.classList.add('reveal', 'visible');
    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  }

  function hideNodePanel() {
    const panel = document.getElementById('node-info');
    if (panel) panel.classList.add('opacity-0');
    setTimeout(() => panel?.classList.add('hidden'), 400);
  }

  /* ── Destroy ────────────────────────────────────────── */
  function destroy() {
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resize);
  }

  return { init, destroy };
})();
