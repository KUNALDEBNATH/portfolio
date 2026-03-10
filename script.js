/* ── Typed.js ── */
var typed = new Typed("#element", {
  strings: ["I like to code optimized solutions", "Build LLM models", "and fine-tune models to make them trustworthy"],
  typeSpeed: 75,
  backSpeed: 40,
  backDelay: 1800,
  loop: true,
  cursorChar: '|',
});

/* ── Page Loader ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 600);
  }
});

/* ── Custom Cursor ── */
const dot  = document.createElement('div'); dot.className  = 'cursor-dot';
const ring = document.createElement('div'); ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx = window.innerWidth/2, my = window.innerHeight/2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

;(function animateCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .skill-card, .project-card, .social-btn, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

/* ── Particle Canvas ── */
const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLE_COUNT = 70;
const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: Math.random() * 1.8 + 0.4,
  dx: (Math.random() - 0.5) * 0.35,
  dy: (Math.random() - 0.5) * 0.35,
  a: Math.random(),
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(167,139,250,${p.a * 0.6})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  // Draw connecting lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 110) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(167,139,250,${0.12 * (1 - dist/110)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── Intersection Observer: scroll reveals ── */
const revealEls = document.querySelectorAll(
  '.content-section, .section-header, .about-text, .highlight-box, ' +
  '.interests-grid, .skills-category, .project-card, .contact-card, ' +
  '.portfolio-footer, .divider-animated'
);

revealEls.forEach((el, i) => {
  if (el.classList.contains('project-card') || el.classList.contains('contact-card')) {
    el.classList.add('scale-up');
  } else if (el.classList.contains('skills-category')) {
    el.classList.add('from-left');
  }
  el.classList.add('reveal');
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

/* ── Section headers underline ── */
document.querySelectorAll('.section-header').forEach(h => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { h.classList.add('line-visible'); obs.unobserve(h); } });
  }, { threshold: 0.5 });
  obs.observe(h);
});

/* ── Stagger skills grid ── */
document.querySelectorAll('.skills-grid').forEach(grid => {
  grid.classList.add('reveal-stagger');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { grid.classList.add('visible'); obs.unobserve(grid); } });
  }, { threshold: 0.1 });
  obs.observe(grid);
});

/* ── Skill bar animation ── */
document.querySelectorAll('.skill-progress').forEach(bar => {
  const target = bar.style.width;
  bar.style.setProperty('--target-width', target);
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { bar.classList.add('animate'); obs.unobserve(bar); } });
  }, { threshold: 0.5 });
  obs.observe(bar);
});

/* ── Timeline items ── */
document.querySelectorAll('.timeline-item').forEach((item, i) => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { item.classList.add('visible'); obs.unobserve(item); } });
  }, { threshold: 0.2 });
  obs.observe(item);
});

/* ── 3D Tilt on cards ── */
function addTilt(selector, intensity = 12) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * intensity;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * intensity;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-6px)`;
      card.style.boxShadow = `${-x}px ${y}px 30px rgba(167,139,250,0.25)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}
addTilt('.project-card', 10);
addTilt('.skill-card', 14);
addTilt('.contact-card', 8);
addTilt('.timeline-content', 6);

/* ── Magnetic buttons ── */
document.querySelectorAll('.btn-primary, .btn-secondary, .social-btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width)  * 100;
    const py = ((e.clientY - r.top)  / r.height) * 100;
    btn.style.setProperty('--mx', px + '%');
    btn.style.setProperty('--my', py + '%');
    const dx = (e.clientX - r.left - r.width  / 2) * 0.18;
    const dy = (e.clientY - r.top  - r.height / 2) * 0.18;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ── Active nav on scroll ── */
const sections = document.querySelectorAll('section[id], .intro-section');
const navLinks = document.querySelectorAll('.nav-link');
const scrollContainer = document.querySelector('.LeftSection') || window;

function updateActiveNav() {
  const scrollTop = scrollContainer === window
    ? window.scrollY
    : scrollContainer.scrollTop;

  let current = '';
  document.querySelectorAll('section[id]').forEach(sec => {
    const offset = sec.offsetTop - 160;
    if (scrollTop >= offset) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
}

(scrollContainer === window ? window : scrollContainer)
  .addEventListener('scroll', updateActiveNav);
updateActiveNav();

/* ── Smooth scroll for nav links ── */
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    const container = document.querySelector('.LeftSection');
    if (container) {
      container.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── Glitch: inject data-text ── */
const gradientText = document.querySelector('.gradient-text');
if (gradientText) gradientText.setAttribute('data-text', gradientText.textContent);

/* ── Add scroll hint below CTA ── */
const ctaBtns = document.querySelector('.cta-buttons');
if (ctaBtns) {
  const hint = document.createElement('div');
  hint.className = 'scroll-hint';
  hint.innerHTML = `<small>scroll to explore</small><span>↓</span>`;
  ctaBtns.after(hint);
}

/* ── Page Loader injection ── */
const loader = document.createElement('div');
loader.id = 'page-loader';
loader.innerHTML = `<div class="loader-ring"></div><div class="loader-text">Loading...</div>`;
document.body.prepend(loader);

