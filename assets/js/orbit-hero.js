/*
 * Eccentric binary mass-transfer hero animation.
 * Self-contained Canvas 2D animation, no dependencies. Draws a donor star and
 * a compact companion on a Kepler orbit; gas streams from the donor toward
 * the companion, intensifying near periastron when eccentricity is high.
 */
(() => {
  "use strict";

  const root = document.querySelector("[data-orbit-hero]");
  if (!root) return;

  const bg = root.querySelector("[data-orbit-bg]");
  const fx = root.querySelector("[data-orbit-fx]");
  const fg = root.querySelector("[data-orbit-fg]");
  const eccInput = root.querySelector("[data-orbit-ecc]");
  const eccVal = root.querySelector("[data-orbit-ecc-val]");
  if (!bg || !fx || !fg) return;

  const bctx = bg.getContext("2d");
  const xctx = fx.getContext("2d");
  const gctx = fg.getContext("2d");

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // --- system parameters ---
  const P = 9.0;                 // orbital period (seconds)
  const mDonor = 0.9;            // donor mass (arbitrary units)
  const mAcc = 1.4;              // accretor mass (compact object)
  const fD = mAcc / (mDonor + mAcc);   // donor's share of the separation
  const fA = mDonor / (mDonor + mAcc); // accretor's share
  const omega = -0.42;           // orientation of periapsis (radians)
  let ecc = eccInput ? parseFloat(eccInput.value) : 0.5;

  let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, S = 0, a = 0, muA = 0, vEject = 0;
  let stars = [], nebula = [];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const r = bg.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    for (const c of [bg, fx, fg]) {
      c.width = Math.round(W * DPR);
      c.height = Math.round(H * DPR);
    }
    for (const ctx of [bctx, xctx, gctx]) ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    cx = W * 0.62;
    cy = H * 0.44;
    S = Math.min(W, H);
    const maxExtent = 0.33 * S;
    a = maxExtent / (fD * (1 + ecc));
    const n = 2 * Math.PI / P;
    muA = 1.25 * n * n * a * a * a;
    vEject = 0.36 * n * a;
    buildStars();
    drawBackground();
  }

  function buildStars() {
    stars = [];
    const count = Math.round((W * H) / 5200);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.1 + 0.2,
        b: Math.random() * 0.6 + 0.2,
        tw: Math.random() * Math.PI * 2,
        big: Math.random() < 0.04
      });
    }
    nebula = [
      { x: W * 0.72, y: H * 0.28, r: S * 0.55, c: "rgba(60,90,150,0.14)" },
      { x: W * 0.22, y: H * 0.68, r: S * 0.5,  c: "rgba(120,70,150,0.10)" },
      { x: W * 0.5,  y: H * 0.5,  r: S * 0.7,  c: "rgba(20,120,140,0.06)" }
    ];
  }

  function keplerE(M, e) {
    let E = M;
    for (let i = 0; i < 6; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return E;
  }

  function orbitState(t) {
    const M = 2 * Math.PI * ((t / P) % 1);
    const E = keplerE(M, ecc);
    const nu = 2 * Math.atan2(Math.sqrt(1 + ecc) * Math.sin(E / 2),
                              Math.sqrt(1 - ecc) * Math.cos(E / 2));
    const r = a * (1 - ecc * Math.cos(E));
    const ang = nu + omega;
    const ux = Math.cos(ang), uy = Math.sin(ang);
    return {
      r, ux, uy,
      donor: { x: cx + fD * r * ux, y: cy + fD * r * uy },
      acc:   { x: cx - fA * r * ux, y: cy - fA * r * uy }
    };
  }

  function drawBackground() {
    bctx.clearRect(0, 0, W, H);
    const g = bctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#060912");
    g.addColorStop(1, "#03040a");
    bctx.fillStyle = g;
    bctx.fillRect(0, 0, W, H);
    bctx.globalCompositeOperation = "lighter";
    for (const nb of nebula) {
      const ng = bctx.createRadialGradient(nb.x, nb.y, 0, nb.x, nb.y, nb.r);
      ng.addColorStop(0, nb.c);
      ng.addColorStop(1, "rgba(0,0,0,0)");
      bctx.fillStyle = ng;
      bctx.fillRect(0, 0, W, H);
    }
    for (const s of stars) {
      const tw = reduced ? 1 : (0.6 + 0.4 * Math.sin(s.tw));
      bctx.globalAlpha = s.b * tw;
      bctx.fillStyle = "#dfe9ff";
      bctx.beginPath();
      bctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      bctx.fill();
      if (s.big) {
        bctx.globalAlpha = s.b * tw * 0.5;
        bctx.fillRect(s.x - s.r * 4, s.y - 0.3, s.r * 8, 0.6);
        bctx.fillRect(s.x - 0.3, s.y - s.r * 4, 0.6, s.r * 8);
      }
    }
    bctx.globalAlpha = 1;
    bctx.globalCompositeOperation = "source-over";
    drawOrbits();
  }

  function drawOrbits() {
    bctx.globalCompositeOperation = "lighter";
    for (const [frac, col] of [[fD, "rgba(255,150,90,0.16)"], [fA, "rgba(150,200,255,0.16)"]]) {
      bctx.beginPath();
      for (let i = 0; i <= 160; i++) {
        const nu = (i / 160) * Math.PI * 2;
        const r = a * (1 - ecc * ecc) / (1 + ecc * Math.cos(nu));
        const ang = nu + omega;
        const sgn = frac === fD ? 1 : -1;
        const x = cx + sgn * frac * r * Math.cos(ang);
        const y = cy + sgn * frac * r * Math.sin(ang);
        i === 0 ? bctx.moveTo(x, y) : bctx.lineTo(x, y);
      }
      bctx.closePath();
      bctx.strokeStyle = col;
      bctx.lineWidth = 1;
      bctx.stroke();
    }
    bctx.globalCompositeOperation = "source-over";
  }

  // --- particles ---
  const particles = [];
  const MAX_P = 1400;
  let accGlow = 0;
  let prev = null;

  function emit(state, donorVel, phi, dt) {
    const dx = state.acc.x - state.donor.x, dy = state.acc.y - state.donor.y;
    const d = Math.hypot(dx, dy) || 1;
    const nx = dx / d, ny = dy / d;
    const donorR = 0.062 * S;
    const ex = state.donor.x + nx * donorR * 1.02;
    const ey = state.donor.y + ny * donorR * 1.02;
    const rate = 7 * Math.pow(phi, 1.7) * (dt * 60);
    let count = Math.floor(rate) + (Math.random() < (rate % 1) ? 1 : 0);
    for (let i = 0; i < count && particles.length < MAX_P; i++) {
      const perp = (Math.random() - 0.5);
      const spread = 0.3;
      const vx = donorVel.x * 0.5 + nx * vEject - ny * perp * vEject * spread;
      const vy = donorVel.y * 0.5 + ny * vEject + nx * perp * vEject * spread;
      particles.push({
        x: ex + (Math.random() - 0.5) * donorR * 0.5,
        y: ey + (Math.random() - 0.5) * donorR * 0.5,
        vx, vy, life: 0,
        maxLife: 2.4 + Math.random() * 1.6
      });
    }
  }

  function stepParticles(state, dt) {
    const sub = 3;
    const h = dt / sub;
    const accR = 0.03 * S;
    for (let s = 0; s < sub; s++) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const dx = state.acc.x - p.x, dy = state.acc.y - p.y;
        const d2 = dx * dx + dy * dy + accR * accR;
        const d = Math.sqrt(d2);
        const f = muA / (d2 * d);
        p.vx += dx * f * h;
        p.vy += dy * f * h;
        if (d < 0.2 * S) {
          const drag = d < 0.1 * S ? 0.96 : 0.982;
          p.vx *= drag; p.vy *= drag;
        }
        p.x += p.vx * h;
        p.y += p.vy * h;
        p.life += h;
        if (d < accR * 2.2) { accGlow += 1; particles.splice(i, 1); continue; }
        if (p.life > p.maxLife) particles.splice(i, 1);
      }
    }
  }

  function renderParticles() {
    xctx.globalCompositeOperation = "destination-out";
    xctx.fillStyle = "rgba(0,0,0,0.085)";
    xctx.fillRect(0, 0, W, H);
    xctx.globalCompositeOperation = "lighter";
    for (const p of particles) {
      const heat = Math.min(1, p.life / 1.6);
      const r = 255 - heat * 60, g = 150 + heat * 80, b = 70 + heat * 185;
      const rad = 2.6 - heat * 0.8;
      const fade = Math.max(0, 1 - p.life / p.maxLife);
      const grd = xctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad * 2.4);
      grd.addColorStop(0, `rgba(${r | 0},${g | 0},${b | 0},${0.55 * fade})`);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      xctx.fillStyle = grd;
      xctx.beginPath();
      xctx.arc(p.x, p.y, rad * 2.4, 0, Math.PI * 2);
      xctx.fill();
    }
    xctx.globalCompositeOperation = "source-over";
  }

  function glowBall(ctx, x, y, r, inner, outer) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, inner);
    g.addColorStop(0.5, outer);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function renderForeground(state, phi) {
    gctx.clearRect(0, 0, W, H);
    gctx.globalCompositeOperation = "lighter";

    const disk = 0.5 + Math.min(1.2, accGlow * 0.03);
    accGlow *= 0.90;
    const dr = 0.085 * S * disk;
    gctx.save();
    gctx.translate(state.acc.x, state.acc.y);
    gctx.scale(1, 0.42);
    glowBall(gctx, 0, 0, dr, "rgba(210,235,255,0.5)", "rgba(90,160,255,0.16)");
    gctx.restore();

    const accR = 0.03 * S;
    glowBall(gctx, state.acc.x, state.acc.y, accR * 4.2, "rgba(230,244,255,0.95)", "rgba(120,180,255,0.25)");
    gctx.fillStyle = "#f2f8ff";
    gctx.beginPath();
    gctx.arc(state.acc.x, state.acc.y, accR * 0.7, 0, Math.PI * 2);
    gctx.fill();

    const donorR = 0.062 * S;
    const dx = state.acc.x - state.donor.x, dy = state.acc.y - state.donor.y;
    const dd = Math.hypot(dx, dy) || 1;
    const nx = dx / dd, ny = dy / dd;
    if (phi > 0.02) {
      const plume = donorR * (0.6 + phi * 1.5);
      glowBall(gctx, state.donor.x + nx * donorR * 0.7, state.donor.y + ny * donorR * 0.7,
               plume, `rgba(255,190,110,${0.35 * phi + 0.1})`, "rgba(255,120,60,0.05)");
    }
    glowBall(gctx, state.donor.x, state.donor.y, donorR * 2.4, "rgba(255,175,95,0.5)", "rgba(255,110,50,0.14)");
    const dg = gctx.createRadialGradient(
      state.donor.x - donorR * 0.3, state.donor.y - donorR * 0.3, donorR * 0.1,
      state.donor.x, state.donor.y, donorR);
    dg.addColorStop(0, "#ffd9a8");
    dg.addColorStop(0.6, "#ff9a4d");
    dg.addColorStop(1, "#e0662a");
    gctx.globalCompositeOperation = "source-over";
    gctx.fillStyle = dg;
    gctx.beginPath();
    gctx.arc(state.donor.x, state.donor.y, donorR, 0, Math.PI * 2);
    gctx.fill();

    gctx.globalCompositeOperation = "source-over";
  }

  let last = performance.now();
  let simT = 0;

  function frame(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.05) dt = 0.05;
    simT += dt;

    if (Math.floor(simT * 4) % 2 === 0) {
      for (const s of stars) s.tw += 0.08;
      drawBackground();
    }

    const state = orbitState(simT);
    let donorVel = { x: 0, y: 0 };
    if (prev) { donorVel.x = (state.donor.x - prev.x) / dt; donorVel.y = (state.donor.y - prev.y) / dt; }
    prev = { x: state.donor.x, y: state.donor.y };

    const phi = Math.max(0, Math.min(1, 0.04 + (a - state.r) / (a * Math.max(ecc, 0.001))));
    emit(state, donorVel, phi, dt);
    stepParticles(state, dt);
    renderParticles();
    renderForeground(state, phi);

    requestAnimationFrame(frame);
  }

  function renderStaticFrame() {
    simT = P * 0.02;
    for (let k = 0; k < 240; k++) {
      const st = orbitState(simT);
      const phi = Math.max(0, Math.min(1, 0.04 + (a - st.r) / (a * Math.max(ecc, 0.001))));
      emit(st, { x: 0, y: 0 }, phi, 1 / 60);
      stepParticles(st, 1 / 60);
    }
    renderParticles();
    renderForeground(orbitState(simT), 1);
  }

  if (eccInput) {
    eccInput.addEventListener("input", () => {
      ecc = parseFloat(eccInput.value);
      if (eccVal) eccVal.textContent = ecc.toFixed(2);
      resize();
      particles.length = 0;
      if (reduced) renderStaticFrame();
    });
  }

  let rz;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(() => { resize(); if (reduced) renderStaticFrame(); }, 150);
  });

  resize();
  if (reduced) {
    renderStaticFrame();
  } else {
    last = performance.now();
    requestAnimationFrame(frame);
  }
})();
