/* ================================
   Background particles + gradient
   ================================ */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d', { alpha: true });
let W = (canvas.width = innerWidth);
let H = (canvas.height = innerHeight);
const particles = [];
const PARTICLE_COUNT = Math.floor((W * H) / 50000) + 40; // responsive

function rand(min, max) { return Math.random() * (max - min) + min; }
function hexShade() {
  // neon green-blue palette
  const palette = ['#0ff3b0', '#22c55e', '#7ef5d4', '#9ffff0', '#4ade80'];
  return palette[Math.floor(Math.random() * palette.length)];
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = rand(0, W);
    this.y = rand(0, H);
    this.r = rand(0.6, 2.8);
    this.vx = rand(-0.2, 0.2);
    this.vy = rand(-0.05, 0.6);
    this.alpha = rand(0.05, 0.9);
    this.color = hexShade();
    this.life = rand(60, 260);
    this.age = 0;
  }
  update() {
    this.x += this.vx;
    this.y -= this.vy;
    this.age++;
    if (this.age > this.life || this.y < -40 || this.x < -40 || this.x > W + 40) this.reset();
  }
  draw() {
    ctx.beginPath();
    const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 12);
    grad.addColorStop(0, this.color);
    grad.addColorStop(0.25, this.color + '66');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.globalAlpha = Math.min(0.85, this.alpha);
    ctx.arc(this.x, this.y, this.r * 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

function initParticles() {
  particles.length = 0;
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}
function resizeCanvas() {
  W = canvas.width = innerWidth;
  H = canvas.height = innerHeight;
  initParticles();
}
addEventListener('resize', resizeCanvas);
initParticles();

let huePhase = 0;
function animateBg() {
  ctx.clearRect(0, 0, W, H);

  // moving radial-ish gradient background
  huePhase += 0.002;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, `rgba(6,30,20,${0.28 + Math.sin(huePhase) * 0.04})`);
  g.addColorStop(0.5, `rgba(2,60,40,${0.16 + Math.cos(huePhase * 1.2) * 0.03})`);
  g.addColorStop(1, `rgba(2,20,25,${0.24 + Math.sin(huePhase * 0.7) * 0.03})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  for (let p of particles) {
    p.update();
    p.draw();
  }

  // subtle connecting lines for denser screens
  ctx.beginPath();
  for (let i = 0; i < 80; i++) {
    const a = particles[Math.floor(rand(0, particles.length))];
    const b = particles[Math.floor(rand(0, particles.length))];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist < 120) {
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
  }
  ctx.strokeStyle = 'rgba(32,200,120,0.02)';
  ctx.stroke();

  requestAnimationFrame(animateBg);
}
animateBg();

/* ============================
   Typed text effect (intro)
   ============================ */
const typedLine = document.getElementById('typed-line');
const phrases = [
  "React • Node • MongoDB",
  "MERN stack builder",
  "Bootstrap • Tailwind • UI",
  "Problem solver • Learner"
];
let pi = 0, ti = 0, deleting = false;

function typeTick() {
  const full = phrases[pi];
  if (!deleting) {
    typedLine.textContent = full.slice(0, ++ti);
    if (ti === full.length) { deleting = true; setTimeout(typeTick, 800); return; }
  } else {
    typedLine.textContent = full.slice(0, --ti);
    if (ti === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
  }
  setTimeout(typeTick, deleting ? 36 : 80);
}
typeTick();

/* ============================
   Smooth scroll for nav & cube links
   ============================ */
function smoothScrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (ev) => {
    ev.preventDefault();
    const id = a.getAttribute('href').slice(1);
    smoothScrollTo(id);
  });
});

/* ============================
   Reveal on scroll (IntersectionObserver)
   ============================ */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(ent => {
    if (ent.isIntersecting) {
      ent.target.classList.add('visible');
      io.unobserve(ent.target);
    }
  });
}, { threshold: 0.16 });
reveals.forEach(r => io.observe(r));

/* ============================
   Contact form (toast) + footer year
   ============================ */
const toast = document.getElementById('toast');
document.getElementById('year').textContent = new Date().getFullYear();

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Message sent successfully — I will reply soon!');
    form.reset();
  });
}
function showToast(text = '') {
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ============================
   Pause cube spin on hover + manual rotate
   ============================ */
const cube = document.getElementById('nav-cube');
let manualAngleX = 0, manualAngleY = 0;
cube.addEventListener('mouseenter', () => cube.style.animationPlayState = 'paused');
cube.addEventListener('mouseleave', () => cube.style.animationPlayState = 'running');

let dragging = false, startX = 0, startY = 0;
cube.addEventListener('pointerdown', (e) => {
  dragging = true; cube.style.animationPlayState = 'paused';
  startX = e.clientX; startY = e.clientY;
  e.target.setPointerCapture(e.pointerId);
});
addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - startX, dy = e.clientY - startY;
  manualAngleY = dx * 0.15;
  manualAngleX = -dy * 0.12;
  cube.style.transform = `rotateX(${manualAngleX}deg) rotateY(${manualAngleY}deg)`;
});
addEventListener('pointerup', () => { dragging = false; setTimeout(()=>{ cube.style.animationPlayState='running'; cube.style.transform = ''; }, 300); });

/* ============================
   Helpful: ensure canvas covers devicePixelRatio
   ============================ */
(function fixHiDPI() {
  function adjust() {
    const ratio = Math.max(1, Math.floor(devicePixelRatio || 1));
    canvas.width = innerWidth * ratio;
    canvas.height = innerHeight * ratio;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(ratio,0,0,ratio,0,0);
  }
  adjust();
  addEventListener('resize', adjust);
})();
