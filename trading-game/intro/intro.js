// The trading game in 60 seconds: a canvas animation timed to the voiceover.
// Every scene is a function of the master time t (seconds), so seeking, pausing
// and frame-exact previews (?t=12.5) all work the same way.

(() => {
  "use strict";

  const W = 1920, H = 1080, M = 160;          // stage size and side margin
  const C = {
    bg: "#ffffff", ink: "#3d3d3d", mute: "#8b8783", faint: "#e6e3df",
    surface: "#f7f6f5", red: "#901a1e", redFaint: "rgba(144, 26, 30, 0.10)",
  };
  const SANS = '"Roboto", "Helvetica Neue", Arial, sans-serif';
  const MONO = '"Roboto Mono", "SFMono-Regular", Menlo, monospace';

  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  canvas.width = W;
  canvas.height = H;

  // ---------- timing ----------
  const T = window.TIMINGS;
  const SCRIPT = window.SCRIPT;
  const seg = Object.fromEntries(T.segments.map((s) => [s.id, s]));
  const order = T.segments.map((s) => s.id);
  const LEAD = 0.35;                           // a scene appears just before its words

  // Time at which a word is spoken, estimated from its position in the text
  function cue(id, word) {
    const s = seg[id], text = SCRIPT[id];
    const i = text.indexOf(word);
    return s.start + (s.end - s.start) * (i < 0 ? 0 : i / text.length);
  }
  function sceneWindow(id) {
    const k = order.indexOf(id);
    const start = k === 0 ? 0 : seg[id].start - LEAD;
    const end = k === order.length - 1 ? T.total : seg[order[k + 1]].start - LEAD;
    return [start, end];
  }

  // ---------- helpers ----------
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (x) => { x = clamp(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const prog = (t, a, d) => clamp((t - a) / d);      // 0 → 1 over [a, a + d]

  function rng(seed) {                              // mulberry32
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r()); }

  function text(str, x, y, o = {}) {
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    ctx.font = `${o.italic ? "italic " : ""}${o.weight ?? 300} ${o.size ?? 32}px ${o.mono ? MONO : SANS}`;
    ctx.fillStyle = o.color ?? C.ink;
    ctx.textAlign = o.align ?? "left";
    ctx.textBaseline = o.baseline ?? "alphabetic";
    if ("letterSpacing" in ctx) ctx.letterSpacing = o.spacing ?? "0px";
    ctx.fillText(str, x, y);
    const w = ctx.measureText(str).width;
    ctx.restore();
    return w;
  }
  function overline(str, alpha) {
    text(str.toUpperCase(), M, 168, { size: 22, weight: 400, color: C.mute, spacing: "5px", alpha });
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = C.red;
    ctx.fillRect(M, 186, 36, 2);
    ctx.restore();
  }
  function line(x1, y1, x2, y2, color, width = 1, dash = null) {
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = width;
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.restore();
  }
  // Draw the first fraction p of a polyline
  function path(points, p, color, width, dash = null) {
    if (p <= 0) return null;
    const n = points.length - 1, upto = p * n, k = Math.floor(upto);
    ctx.save();
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = "round"; ctx.lineCap = "round";
    if (dash) ctx.setLineDash(dash);
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i <= Math.min(k, n); i++) ctx.lineTo(points[i][0], points[i][1]);
    let end = points[Math.min(k, n)];
    if (k < n) {
      const f = upto - k, a = points[k], b = points[k + 1];
      end = [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
      ctx.lineTo(end[0], end[1]);
    }
    ctx.stroke();
    ctx.restore();
    return end;
  }
  function dot(x, y, r, color, alpha = 1) {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI); ctx.fill(); ctx.restore();
  }
  function roundRect(x, y, w, h, r, fill) {
    ctx.save(); ctx.fillStyle = fill; ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(x, y, w, h, r) : ctx.rect(x, y, w, h);
    ctx.fill(); ctx.restore();
  }
  // Generated line drawings sit on white; multiply makes the white disappear
  function image(name, x, y, w, alpha) {
    const img = IMAGES[name];
    if (!img || !img.complete || !img.naturalWidth || alpha <= 0) return 0;
    const h = w * img.naturalHeight / img.naturalWidth;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
    return h;
  }
  const money = (v) => "$" + Math.round(v).toLocaleString("en-US");

  // ---------- data for the scenes (seeded, so every frame is reproducible) ----------
  function walk(seed, n, drift, vol) {
    const r = rng(seed), out = [0];
    for (let i = 1; i < n; i++) out.push(out[i - 1] + drift + vol * gauss(r));
    return out;
  }
  const TITLE_WALK = walk(7, 120, 0.004, 0.035);
  const DAYS = 63;                               // trading days, 16 Feb to 14 May 2027
  const SERIES = [
    { name: "Your team", color: C.red, width: 4, v: walk(74, DAYS, 0.00055, 0.0085) },
    { name: "Equal weight", color: C.ink, width: 2, v: walk(12, DAYS, 0.0004, 0.0082) },
    { name: "Buy and hold", color: "#9a9590", width: 2, v: walk(14, DAYS, 0.00025, 0.0080) },
    { name: "Market", color: "#9a9590", width: 2, dash: [10, 8], v: walk(24, DAYS, 0.0003, 0.0090) },
  ].map((s) => ({ ...s, v: s.v.map((x) => 1 + x) }));
  // Other teams (illustration): different skill, different luck
  const PEERS = Array.from({ length: 31 }, (_, k) => {
    const r = rng(300 + k);
    return walk(100 + k, DAYS, -0.0003 + 0.0011 * r(), 0.007 + 0.004 * r()).map((x) => 1 + x);
  });
  // Annualized Sharpe ratio of a value path (risk-free rate ignored in the illustration)
  function sharpe(v) {
    const r = v.slice(1).map((x, i) => x / v[i] - 1);
    const m = r.reduce((s, x) => s + x, 0) / r.length;
    const sd = Math.sqrt(r.reduce((s, x) => s + (x - m) ** 2, 0) / (r.length - 1));
    return m / sd * Math.sqrt(252);
  }
  const TEAM_SHARPE = sharpe(SERIES[0].v);
  const PEER_SHARPE = PEERS.map(sharpe);
  const GRID = { cols: 78, rows: 43, n: 3354, eligible: 2434 };   // 11 November 2026
  const DROPPED = (() => {                        // which dots are not tradable
    const r = rng(5), idx = Array.from({ length: GRID.n }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return new Set(idx.slice(0, GRID.n - GRID.eligible));
  })();

  // ---------- scenes ----------
  // Each scene gets the time t, its own window [a, b] and a fade factor
  const SCENES = {
    title(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      const x0 = M, x1 = W - M, y0 = 690;
      line(x0, y0, x0 + (x1 - x0) * ease(prog(t, 0.15, 1.1)), y0, C.faint, 2);
      const pts = TITLE_WALK.map((v, i) => [x0 + (x1 - x0) * i / (TITLE_WALK.length - 1), y0 - 140 * v]);
      const end = path(pts, ease(prog(t, 0.9, 3.2)), C.red, 3);
      if (end && prog(t, 0.9, 3.2) > 0.02) dot(end[0], end[1], 7, C.red);
      const p = easeOut(prog(t, 0.5, 1.2));
      text("The trading game", M - 6, 420 + 24 * (1 - p), { size: 150, weight: 200, alpha: p });
      const q = easeOut(prog(t, 1.1, 1.0));
      text("Advanced Empirical Finance", M, 500 + 16 * (1 - q), { size: 46, weight: 300, color: C.red, alpha: q });
      text("aef-course.ku.dk", M, 900, { size: 26, color: C.mute, alpha: prog(t, 2.2, 0.8) });
      text("Spring 2027", W - M, 900, { size: 26, color: C.mute, align: "right", alpha: prog(t, 2.2, 0.8) });
      ctx.restore();
    },

    portfolio(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      overline("Portfolio", prog(t, a, 0.5));
      const c0 = cue("portfolio", "starting"), c1 = seg.portfolio.end;
      const v = 1e6 * ease(prog(t, c0, Math.max(0.8, c1 - c0)));
      const p = easeOut(prog(t, a, 0.6));
      text(money(v), M - 8, 500, { size: 210, weight: 200, alpha: p });
      text("in cash at the start, per team", M, 575, { size: 34, color: C.mute, alpha: prog(t, a + 0.4, 0.6) });
      const facts = [
        ["Paper portfolio", "US stocks, real prices"],
        ["Team", "1 to 3 students"],
        ["Trading", "16 Feb – 14 May 2027"],
      ];
      const cw = (W - 2 * M) / 3;
      facts.forEach(([label, value], i) => {
        const s = easeOut(prog(t, cue("portfolio", "paper") + 0.25 * i, 0.6));
        const x = M + i * cw;
        line(x, 720, x + (cw - 60) * s, 720, C.faint, 2);
        text(label.toUpperCase(), x, 775, { size: 20, weight: 400, color: C.mute, spacing: "4px", alpha: s });
        text(value, x, 830, { size: 38, alpha: s });
      });
      ctx.restore();
    },

    universe(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      overline("Asset universe", prog(t, a, 0.5));
      const gx = 790, gy = 250, step = 12.9;
      const filterAt = cue("universe", "closed"), f = ease(prog(t, filterAt, 1.2));
      for (let i = 0; i < GRID.n; i++) {
        const col = i % GRID.cols, row = Math.floor(i / GRID.cols);
        const appear = prog(t, a + 0.1 + (col + row) * 0.011, 0.35);
        if (appear <= 0) continue;
        const gone = DROPPED.has(i) ? f : 0;
        ctx.globalAlpha = alpha * appear;
        ctx.fillStyle = gone > 0.5 ? C.faint : C.ink;
        const r = 3.6 - 1.6 * gone;
        ctx.fillRect(gx + col * step - r, gy + row * step - r, 2 * r, 2 * r);
      }
      ctx.globalAlpha = alpha;
      const n = Math.round(GRID.n - (GRID.n - GRID.eligible) * f);
      text(n.toLocaleString("en-US"), M - 6, 420, { size: 150, weight: 200, color: f > 0.5 ? C.red : C.ink, alpha: prog(t, a + 0.2, 0.5) });
      const out = 1 - clamp(f * 2.5), into = clamp(f * 2.5 - 1.2);
      text("US common stocks in CRSP", M, 480, { size: 32, alpha: prog(t, a + 0.4, 0.5) * out });
      text("NYSE, NYSE American, Nasdaq", M, 525, { size: 28, color: C.mute, alpha: prog(t, a + 0.6, 0.5) * out });
      text("closed at $5 or more the day before:", M, 480, { size: 32, alpha: into });
      text("tradable", M, 525, { size: 28, color: C.red, alpha: into });
      text("Counts on 11 November 2026", M, 820, { size: 22, color: C.mute, alpha: prog(t, a + 1, 0.6) });
      ctx.restore();
    },

    setup(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      overline("Setup", prog(t, a, 0.5));
      // Terminal: the client from GitHub, with uvr (R) or uv (Python)
      const x = M, y = 240, w = W - 2 * M;
      roundRect(x, y, w, 330, 12, C.surface);
      const install = [
        ["# R, in a uvr project", C.mute],
        ["uvr add advanced-empirical-finance/aefsim/r", C.ink],
        ["# Python, in a uv project", C.mute],
        ['uv add "git+https://github.com/advanced-empirical-finance/aefsim#subdirectory=python"', C.ink],
      ];
      const total = install.reduce((n, [l]) => n + l.length, 0);
      let left = Math.floor(ease(prog(t, a + 0.3, Math.max(1.8, cue("setup", "save") - a - 0.5))) * total);
      install.forEach(([l, col], i) => {
        text(l.slice(0, Math.max(0, Math.min(l.length, left))), x + 44, y + 72 + i * 66, { size: 27, mono: true, weight: 400, color: col });
        left -= l.length;
      });
      // The token: once per project
      const k = easeOut(prog(t, cue("setup", "save"), 0.6));
      roundRect(x, 640, w, 170, 12, C.surface);
      ctx.save(); ctx.globalAlpha *= k;
      text("set_token()", x + 44, 715, { size: 27, mono: true, weight: 400 });
      text("# R; in Python: aefsim.set_token()", x + 300, 715, { size: 27, mono: true, weight: 400, color: C.mute });
      text("Once per project: paste your team's token, which starts with aef_", x + 44, 775, { size: 28, color: C.red });
      ctx.restore();
      ctx.restore();
    },

    submit(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      overline("Your decision", prog(t, a, 0.5));
      // Code card with R | Python tabs, as on the course homepage
      const x = M, y = 230, w = 980, h = 610;
      roundRect(x, y, w, h, 12, C.surface);
      const pyAt = cue("submit", "Python"), py = prog(t, pyAt, 0.35);
      const tabs = [["R", 1 - py], ["Python", py]];
      let tx = x + 36;
      tabs.forEach(([name, on]) => {
        const tw = text(name, tx, y + 62, { size: 28, weight: on > 0.5 ? 400 : 300, color: on > 0.5 ? C.ink : C.mute });
        if (on > 0) { ctx.fillStyle = C.red; ctx.globalAlpha = alpha * on; ctx.fillRect(tx - 6, y + 80, tw + 12, 4); ctx.globalAlpha = alpha; }
        tx += tw + 56;
      });
      line(x, y + 84, x + w, y + 84, C.faint, 2);
      const R = [
        ["library(aefsim)", 0],
        ["library(tibble)", 0],
        ["", 0],
        ["weights <- tibble(", 0],
        ['  ticker = c("JNJ", "PG", "KO", "WMT"),', 0],
        ["  weight = c(0.30, 0.25, 0.25, 0.20)", 0],
        [")", 0],
        ['submit(weights, close_date = "2027-02-05",', 0],
        ['  rationale = "Low volatility, smaller drawdowns")', 1],
      ];
      const PY = [
        ["import aefsim", 0],
        ["import polars as pl", 0],
        ["", 0],
        ["weights = pl.DataFrame({", 0],
        ['    "ticker": ["JNJ", "PG", "KO", "WMT"],', 0],
        ['    "weight": [0.30, 0.25, 0.25, 0.20],', 0],
        ["})", 0],
        ['aefsim.submit(weights, close_date="2027-02-05",', 0],
        ['    rationale="Low volatility, smaller drawdowns")', 1],
      ];
      const ratAt = cue("submit", "rationale");
      const typed = ease(prog(t, a + 0.2, Math.max(1.5, pyAt - a - 0.3)));
      const total = R.reduce((s, [l]) => s + l.length, 0);
      const drawCode = (lines, chars, alphaCode) => {
        let left = chars;
        lines.forEach(([l, isRationale], i) => {
          const shown = l.slice(0, Math.max(0, Math.min(l.length, left)));
          left -= l.length;
          const col = isRationale && t > ratAt ? C.red : C.ink;
          text(shown, x + 40, y + 145 + i * 52, { size: 27, mono: true, weight: 400, color: col, alpha: alphaCode });
        });
      };
      if (py < 1) drawCode(R, Math.floor(typed * total), 1 - py);
      if (py > 0) drawCode(PY, 1e9, py);
      // Weight bars, filled as the weights appear in the code
      const bx = 1260, by = 270;
      text("Weight vector", bx, by, { size: 22, weight: 400, color: C.mute, spacing: "4px" });
      [["JNJ", 0.30], ["PG", 0.25], ["KO", 0.25], ["WMT", 0.20]].forEach(([tk, wt], i) => {
        const s = easeOut(prog(typed, 0.42 + 0.05 * i, 0.25));
        const yy = by + 50 + i * 54;
        text(tk, bx, yy + 10, { size: 26, mono: true, weight: 400, alpha: s });
        ctx.fillStyle = C.ink; ctx.globalAlpha = alpha * s;
        ctx.fillRect(bx + 110, yy - 10, 900 * wt * s, 22);
        ctx.globalAlpha = alpha;
        text(`${Math.round(wt * 100)} %`, bx + 120 + 900 * wt * s, yy + 10, { size: 24, color: C.mute, alpha: s });
      });
      // The rationale becomes the decision log
      const rq = easeOut(prog(t, ratAt, 0.8));
      image("notebook", bx - 30, 520, 430, rq);
      text("Rationale:", bx + 420, 640, { size: 28, weight: 400, color: C.red, alpha: rq });
      text("what you expect", bx + 420, 682, { size: 28, alpha: rq });
      text("and why", bx + 420, 722, { size: 28, alpha: rq });
      text("Your decision log", bx + 420, 790, { size: 24, color: C.mute, alpha: prog(t, cue("submit", "why"), 0.6) });
      ctx.restore();
    },

    clock(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      overline("Deadline", prog(t, a, 0.5));
      const cph = cue("clock", "Copenhagen");
      const cities = [
        { name: "New York", img: "nyse", x: M, at: a + 0.1, from: 7.5, to: 9, label: "09:00", note: "deadline for the next open" },
        { name: "Copenhagen", img: "copenhagen", x: 1000, at: cph - 0.4, from: 13.5, to: 15, label: "15:00", note: "the same moment" },
      ];
      cities.forEach((c) => {
        const s = easeOut(prog(t, c.at, 0.8));
        image(c.img, c.x, 230, 760, 0.95 * s);
        // Clock face: the hands turn to the deadline
        const cx = c.x + 70, cy = 760, r = 58;
        ctx.save(); ctx.globalAlpha = alpha * s;
        ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 2 * Math.PI); ctx.stroke();
        const hours = c.from + (c.to - c.from) * ease(prog(t, c.at + 0.2, 1.2));
        const ha = (hours % 12) / 12 * 2 * Math.PI - Math.PI / 2, ma = (hours % 1) * 2 * Math.PI - Math.PI / 2;
        line(cx, cy, cx + 30 * Math.cos(ha), cy + 30 * Math.sin(ha), C.ink, 4);
        line(cx, cy, cx + 46 * Math.cos(ma), cy + 46 * Math.sin(ma), C.red, 3);
        dot(cx, cy, 5, C.ink);
        ctx.restore();
        text(c.name, c.x + 160, 745, { size: 34, alpha: s });
        text(c.label, c.x + 160, 812, { size: 64, weight: 200, alpha: s });
        text(c.note, c.x + 160, 858, { size: 24, color: C.mute, alpha: s });
      });
      const o = easeOut(prog(t, cue("clock", "trades"), 0.7));
      text("Your last submission trades at the market open, 09:30 New York time.", M, 960, { size: 30, alpha: o });
      ctx.restore();
    },

    evening(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      overline("Every trading day", prog(t, a, 0.5));
      // One day on a time axis, New York time
      const x0 = M + 40, x1 = W - M - 40, y = 640;
      const hx = (h) => x0 + (x1 - x0) * (h - 8.5) / (17.5 - 8.5);
      line(x0, y, x0 + (x1 - x0) * ease(prog(t, a + 0.1, 0.9)), y, C.faint, 2);
      [9, 10, 11, 12, 13, 14, 15, 16, 17].forEach((h) => {
        const s = prog(t, a + 0.2 + (h - 9) * 0.05, 0.3);
        line(hx(h), y - 8, hx(h), y + 8, C.faint, 2);
        text(`${String(h).padStart(2, "0")}:00`, hx(h), y + 46, { size: 22, color: C.mute, align: "center", alpha: s });
      });
      // Portfolio value through the day (illustration)
      const r = rng(41), vals = [0];
      for (let i = 1; i <= 80; i++) vals.push(vals[i - 1] + 0.00045 * gauss(r) + 0.00007);
      const pts = vals.map((v, i) => [hx(9.5 + 6.5 * i / 80), 470 - 9000 * v]);
      const p = ease(prog(t, a + 0.6, Math.max(1.5, seg.evening.end - a - 1.2)));
      const end = path(pts, p, C.red, 3);
      const events = [
        { h: 9, label: "Deadline", sub: "09:00", color: C.red, at: a + 0.4 },
        { h: 9.5, label: "Trade at the open", sub: "09:30", color: C.ink, at: a + 0.7 },
        { h: 16, label: "Valued at the close", sub: "16:00", color: C.ink, at: cue("evening", "closing") },
      ];
      events.forEach((e, i) => {
        const s = easeOut(prog(t, e.at, 0.5));
        dot(hx(e.h), y, 9, e.color, s);
        text(e.label, hx(e.h), y + 112 + (i === 1 ? 52 : 0), { size: 30, align: e.h === 16 ? "right" : "left", alpha: s });
      });
      if (end && p > 0.98) {
        const v = 1e6 * (1 + vals[vals.length - 1]);
        const s = easeOut(prog(t, cue("evening", "closing"), 0.6));
        dot(end[0], end[1], 8, C.red, s);
        text(money(v), end[0] + 24, end[1] + 12, { size: 34, weight: 400, alpha: s });
      }
      text("Results appear on your dashboard after the nightly update.", M, 960, {
        size: 26, color: C.mute, alpha: prog(t, cue("evening", "closing") + 0.6, 0.7) });
      ctx.restore();
    },

    dashboard(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      overline("Dashboard", prog(t, a, 0.5));
      // ggplot-like panel: value of $1 over the semester, other teams in grey
      const px = M + 90, py = 240, pw = 980, ph = 580;
      const lo = 0.9, hi = 1.15;
      const X = (i) => px + pw * i / (DAYS - 1), Y = (v) => py + ph * (hi - v) / (hi - lo);
      const g = prog(t, a + 0.1, 0.6);
      [0.9, 0.95, 1.0, 1.05, 1.1, 1.15].forEach((v) => {
        line(px, Y(v), px + pw, Y(v), C.faint, Math.abs(v - 1) < 1e-9 ? 2 : 1);
        text(v.toFixed(2), px - 18, Y(v) + 8, { size: 22, color: C.mute, align: "right", alpha: g });
      });
      [["Feb", 0], ["Mar", 9], ["Apr", 31], ["May", 53]].forEach(([m, i]) =>
        text(m, X(i), py + ph + 42, { size: 22, color: C.mute, align: "center", alpha: g }));
      text("Value of $1, net of costs", px - 90, py - 30, { size: 24, color: C.mute, alpha: g });
      const p = ease(prog(t, a + 0.4, 2.6));
      const peersAt = Math.min(cue("dashboard", "peers") - 0.3, a + 3), peers = easeOut(prog(t, peersAt, 0.8));
      ctx.save();
      ctx.beginPath(); ctx.rect(px, py, pw + 4, ph); ctx.clip();
      PEERS.forEach((v) => path(v.map((x, i) => [X(i), Y(x)]), p * peers, "#dcd7d2", 1.5));
      ctx.restore();
      const labels = [];
      SERIES.slice().reverse().forEach((s) => {
        const end = path(s.v.map((v, i) => [X(i), Y(v)]), p, s.color, s.width, s.dash);
        if (end && p > 0.97) labels.push({ s, x: end[0] + 14, y: end[1] + 8 });
      });
      // Line labels at least 26 px apart, top to bottom
      labels.sort((a, b) => a.y - b.y);
      labels.forEach((l, i) => { if (i > 0) l.y = Math.max(l.y, labels[i - 1].y + 26); });
      labels.forEach(({ s, x, y }) => text(s.name, x, y, { size: 22, weight: s.color === C.red ? 400 : 300,
        color: s.color === C.red ? C.red : C.ink, alpha: prog(p, 0.97, 0.03) }));
      // Sharpe ratio of every team as a dot plot; yours in red
      const sx = 1430, sw = 340, base = 640;
      const S = (v) => sx + sw * (v + 4) / 10;
      text("Sharpe ratio of every team", sx - 20, py - 30, { size: 24, color: C.mute, alpha: peers });
      line(sx, base + 22, sx + sw, base + 22, C.faint, 2);
      [-4, -2, 0, 2, 4, 6].forEach((v) => text(String(v), S(v), base + 60, { size: 20, color: C.mute, align: "center", alpha: peers }));
      const stacks = {};
      [...PEER_SHARPE.map((v) => [v, false]), [TEAM_SHARPE, true]].forEach(([v, mine], i) => {
        const bin = Math.round(clamp(v, -3.9, 5.9) / 0.6);
        const level = stacks[bin] = (stacks[bin] ?? -1) + 1;
        const k = easeOut(prog(t, peersAt + 0.03 * i, 0.4));
        dot(S(bin * 0.6), base - level * 27, mine ? 12 : 10, mine ? C.red : "#c4beb8", k);
        if (mine) text("Your team", S(bin * 0.6), base - level * 27 - 28, { size: 22, weight: 400, color: C.red, align: "center", alpha: k });
      });
      text("Illustration", M, 960, { size: 24, color: C.mute, alpha: g });
      ctx.restore();
    },

    close(t, a, b, alpha) {
      ctx.save(); ctx.globalAlpha = alpha;
      const p = easeOut(prog(t, a + 0.1, 0.8));
      text("Trading starts on 16 February 2027", M - 4, 470, { size: 96, weight: 200, alpha: p });
      const s = easeOut(prog(t, cue("close", "Everything"), 0.7));
      text("aef-course.ku.dk/trading-game", M, 560, { size: 40, color: C.red, alpha: s });
      line(M, 760, M + (W - 2 * M) * ease(prog(t, a + 0.3, 1.4)), 760, C.faint, 2);
      const pts = TITLE_WALK.map((v, i) => [M + (W - 2 * M) * i / (TITLE_WALK.length - 1), 760 - 110 * v]);
      path(pts, ease(prog(t, a + 0.6, 3.2)), C.red, 3);
      ctx.restore();
    },
  };

  // ---------- frame ----------
  function frame(t) {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);
    for (const id of order) {
      const [a, b] = sceneWindow(id);
      if (t < a - 0.01 || t > b + 0.45) continue;
      const fadeIn = id === "title" ? 1 : prog(t, a, 0.4);
      const fadeOut = id === "close" ? 1 - prog(t, T.total - 0.8, 0.8) : 1 - prog(t, b, 0.4);
      const alpha = Math.min(fadeIn, fadeOut);
      if (alpha > 0) SCENES[id](t, a, b, alpha);
    }
    ctx.restore();
  }

  // ---------- assets and playback ----------
  const IMAGES = {};
  ["nyse", "copenhagen", "notebook"].forEach((n) => {
    const img = new Image();
    img.src = `assets/img/${n}.jpg`;
    img.onload = () => draw();
    IMAGES[n] = img;
  });

  const vo = document.getElementById("vo");
  const music = document.getElementById("music");
  const playButton = document.getElementById("play");
  const bar = document.getElementById("bar");
  const fill = document.getElementById("fill");
  const clockLabel = document.getElementById("time");
  const params = new URLSearchParams(location.search);
  const frozen = params.has("t") ? parseFloat(params.get("t")) : null;

  let audioCtx = null, musicGain = null, started = false;
  // Music sits under the voice: lower while someone speaks, fades out at the end
  function musicLevel(t) {
    const speaking = T.segments.some((s) => t > s.start - 0.25 && t < s.end + 0.15);
    const base = speaking ? 0.16 : 0.36;
    return base * Math.min(prog(t, 0, 0.8), 1 - prog(t, T.total - 2.5, 2.5));
  }
  function setupAudio() {
    if (audioCtx) return;
    try {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const src = audioCtx.createMediaElementSource(music);
      musicGain = audioCtx.createGain();
      musicGain.gain.value = 0;
      src.connect(musicGain).connect(audioCtx.destination);
    } catch (e) { audioCtx = null; }
  }
  const REST = 3.6;                            // the resting frame: the title in full
  function now() { return frozen ?? (started ? vo.currentTime : REST); }

  function draw() {
    const t = now();
    frame(t);
    const p = started || frozen !== null ? clamp(t / T.total) : 0;
    fill.style.transform = `scaleX(${p})`;
    const shown = started || frozen !== null ? Math.min(Math.floor(t), 60) : 0;
    clockLabel.textContent = `${Math.floor(shown / 60)}:${String(shown % 60).padStart(2, "0")} / 1:00`;
  }
  function loop() {
    const t = now();
    if (musicGain) musicGain.gain.setTargetAtTime(musicLevel(t), audioCtx.currentTime, 0.12);
    else music.volume = clamp(musicLevel(t));
    if (Math.abs(music.currentTime - t) > 0.25 && !music.paused) music.currentTime = t;
    draw();
    if (!vo.paused && !vo.ended) requestAnimationFrame(loop);
  }
  function play() {
    setupAudio();
    if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
    if (vo.ended || vo.currentTime >= T.total - 0.05) { vo.currentTime = 0; music.currentTime = 0; }
    started = true;
    document.body.classList.add("playing");
    music.currentTime = vo.currentTime;
    Promise.all([vo.play(), music.play().catch(() => null)]).then(loop).catch(() => {
      document.body.classList.remove("playing");
    });
  }
  function pause() { vo.pause(); music.pause(); document.body.classList.remove("playing"); draw(); }
  playButton.addEventListener("click", () => (vo.paused ? play() : pause()));
  canvas.addEventListener("click", () => (vo.paused ? play() : pause()));
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") { e.preventDefault(); vo.paused ? play() : pause(); }
    if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
      e.preventDefault();
      const t = clamp(vo.currentTime + (e.code === "ArrowLeft" ? -5 : 5), 0, T.total);
      started = true; vo.currentTime = t; music.currentTime = t; draw();
    }
  });
  bar.addEventListener("click", (e) => {
    const r = bar.getBoundingClientRect();
    const t = clamp((e.clientX - r.left) / r.width) * T.total;
    started = true;
    vo.currentTime = t; music.currentTime = t;
    draw();
  });
  vo.addEventListener("ended", () => { music.pause(); document.body.classList.remove("playing"); draw(); });
  vo.addEventListener("pause", () => document.body.classList.remove("playing"));

  // Draw once the fonts are there, so the first frame is not in a fallback face
  const fonts = ["200 40px Roboto", "300 40px Roboto", "400 40px Roboto", "400 40px 'Roboto Mono'"];
  Promise.all(fonts.map((f) => document.fonts.load(f))).catch(() => null).then(() => {
    draw();
    document.body.classList.add("ready");
    if (frozen !== null) document.body.classList.add("preview");
  });
})();
