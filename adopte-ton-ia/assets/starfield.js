// Fond étoilé fixe derrière tout le site (même technique que le graphe 3D de
// l'app "Adopte ton IA" : trois couches d'étoiles avec dérive lente et
// scintillement indépendant). Fond transparent ici (clearRect, pas de fillRect
// opaque) car le canvas est en position fixed derrière la page : c'est le
// fond navy du body et des sections qui reste visible autour des étoiles.

(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const LAYERS = [
    { densityDivisor: 7000, size: [0.35, 0.8], drift: 1.2, alpha: [0.1, 0.28], twinkleSpeed: [0.15, 0.4] },
    { densityDivisor: 14000, size: [0.7, 1.3], drift: 2.4, alpha: [0.18, 0.4], twinkleSpeed: [0.3, 0.7] },
    { densityDivisor: 32000, size: [1.1, 1.7], drift: 4, alpha: [0.28, 0.55], twinkleSpeed: [0.4, 1] },
  ];
  const STAR_TINTS = ['#EAF6FF', '#EAF6FF', '#EAF6FF', '#C9E8FF', '#FFEBCB'];

  let stars = [];
  let width = 0;
  let height = 0;
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let rafId = null;
  let lastTime = performance.now();
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function makeStar(layer) {
    return {
      x: rand(0, width),
      y: rand(0, height),
      size: rand(layer.size[0], layer.size[1]),
      color: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
      driftAngle: rand(0, Math.PI * 2),
      driftSpeed: rand(layer.drift * 0.4, layer.drift),
      baseAlpha: rand(layer.alpha[0], layer.alpha[1]),
      twinkleSpeed: rand(layer.twinkleSpeed[0], layer.twinkleSpeed[1]),
      twinklePhase: rand(0, Math.PI * 2),
    };
  }

  function resize() {
    width = window.innerWidth;
    // Hauteur de l'écran visible, pas de toute la page (document.documentElement.scrollHeight
    // avant ça) : le canvas est en position fixed, donc n'a jamais besoin d'être plus grand que
    // le viewport. Sur une page longue, dimensionner sur la hauteur totale forçait le mobile à
    // composer un calque fixed de plusieurs milliers de pixels à chaque frame, d'où le lag au
    // scroll remonté par Youness (surtout visible au téléphone : devicePixelRatio plus élevé +
    // GPU plus faible qu'un desktop).
    height = window.innerHeight;
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = [];
    for (const layer of LAYERS) {
      const count = Math.min(320, Math.max(60, Math.floor((width * height) / layer.densityDivisor)));
      for (let i = 0; i < count; i++) stars.push(makeStar(layer));
    }
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      ctx.globalAlpha = s.baseAlpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function tick(now) {
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    for (const s of stars) {
      s.x += Math.cos(s.driftAngle) * s.driftSpeed * dt;
      s.y += Math.sin(s.driftAngle) * s.driftSpeed * dt;
      if (s.x < -2) s.x = width + 2;
      if (s.x > width + 2) s.x = -2;
      if (s.y < -2) s.y = height + 2;
      if (s.y > height + 2) s.y = -2;

      const twinkle = 0.6 + 0.4 * Math.sin(now * 0.001 * s.twinkleSpeed + s.twinklePhase);
      ctx.globalAlpha = s.baseAlpha * twinkle;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (rafId || reduceMotion) return;
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (reduceMotion) drawStatic();
    }, 150);
  });

  resize();
  if (reduceMotion) drawStatic();
  else start();
})();
