const projects = [
  {
    number: '01', category: 'AI · AGRITECH', filter: 'ai', title: 'Kisan Saathi',
    description: 'A team-built hackathon project: AI-powered decision support for FPO income growth, impact measurement, prediction and recommendations.',
    tech: ['React', 'FastAPI', 'XGBoost', 'PostgreSQL', 'Causal AI'],
    github: 'https://github.com/122-mananchauhan/saathi-app-3.0', live: 'https://saathi-app-3-0.vercel.app/'
  },
  {
    number: '02', category: 'AI · COMPUTER VISION', filter: 'ai', title: 'Smart Face Detection Attendance',
    description: 'A team-built hackathon project for smart attendance management, combining face recognition, student registration, attendance records and analytics.',
    tech: ['Python', 'Computer Vision', 'AI', 'Web'], github: 'https://github.com/122-mananchauhan'
  },
  {
    number: '03', category: 'TOOL', filter: 'tools', title: 'CLI Expense Tracker',
    description: 'A lightweight expense-tracking project focused on simple data entry and everyday personal finance workflow.',
    tech: ['Python', 'CLI', 'Utility'], github: 'https://github.com/122-mananchauhan/CLI-expense-tracker'
  },
  {
    number: '04', category: 'TOOL', filter: 'tools', title: 'File Organizer',
    description: 'A productivity utility designed to make file organization simpler by grouping files into a cleaner structure.',
    tech: ['Python', 'Utility'], github: 'https://github.com/122-mananchauhan/file-organizer'
  },
  {
    number: '05', category: 'WEB', filter: 'web', title: 'TODO List',
    description: 'A simple task-management web application focused on a clean and focused workflow for creating and managing tasks.',
    tech: ['HTML', 'CSS', 'JavaScript'], github: 'https://github.com/122-mananchauhan/TODO-list'
  },
  {
    number: '06', category: 'AI · HACKATHON', filter: 'ai', title: 'AI Complaint Management System',
    description: 'A multilingual AI voice assistant concept designed to handle Gujarati, Hindi and English civic-service calls and register complaints.',
    tech: ['AI', 'Voice Recognition', 'NLP', 'CivicTech'], github: 'https://github.com/122-mananchauhan'
  }
];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const projectsGrid = document.querySelector('#projects-grid');
const modalBackdrop = document.querySelector('#project-modal');
const modal = modalBackdrop.querySelector('.project-modal');
const modalClose = modalBackdrop.querySelector('.modal-close');
const status = document.querySelector('.filter-status');
let activeFilter = 'all';
let lastTrigger = null;

function projectCard(project) {
  const live = project.live ? `<a href="${project.live}" target="_blank" rel="noopener noreferrer">Live demo <span aria-hidden="true">↗</span></a>` : '';
  return `<article class="project-card tilt-card reveal" data-tilt data-filter="${project.filter}">
    <div class="project-head"><span class="mono project-number">/${project.number}</span><span class="project-category">${project.category}</span></div>
    <h3>${project.title}</h3>
    <p>${project.description}</p>
    <ul class="project-tags" aria-label="Technologies: ${project.tech.join(', ')}">${project.tech.map(tag => `<li>${tag}</li>`).join('')}</ul>
    <div class="project-actions">
      <button type="button" class="details-button" data-project="${project.number}" aria-label="View details for ${project.title}">Project details <span aria-hidden="true">↗</span></button>
      ${live}<a href="${project.github}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

function renderProjects() {
  const visible = projects.filter(project => activeFilter === 'all' || project.filter === activeFilter);
  projectsGrid.innerHTML = visible.map(projectCard).join('');
  status.textContent = `Showing ${visible.length} ${activeFilter === 'all' ? 'projects' : `${activeFilter} projects`}.`;
  observeReveals();
  setupTilt();
}

function openModal(number, trigger) {
  const project = projects.find(item => item.number === number);
  if (!project) return;
  lastTrigger = trigger;
  modalBackdrop.querySelector('.modal-category').textContent = `${project.number} / ${project.category}`;
  modalBackdrop.querySelector('#modal-title').textContent = project.title;
  modalBackdrop.querySelector('#modal-description').textContent = project.description;
  modalBackdrop.querySelector('.modal-tech').innerHTML = project.tech.map(tag => `<span>${tag}</span>`).join('');
  modalBackdrop.querySelector('.modal-actions').innerHTML = `${project.live ? `<a class="button button-primary" href="${project.live}" target="_blank" rel="noopener noreferrer">Live demo ↗</a>` : ''}<a class="button button-secondary" href="${project.github}" target="_blank" rel="noopener noreferrer">View GitHub ↗</a>`;
  modalBackdrop.hidden = false;
  document.body.classList.add('modal-open');
  requestAnimationFrame(() => modalBackdrop.classList.add('is-open'));
  modal.focus();
}

function closeModal() {
  if (modalBackdrop.hidden) return;
  modalBackdrop.classList.remove('is-open');
  document.body.classList.remove('modal-open');
  setTimeout(() => { modalBackdrop.hidden = true; lastTrigger?.focus(); }, 180);
}

projectsGrid.addEventListener('click', event => {
  const button = event.target.closest('.details-button');
  if (button) openModal(button.dataset.project, button);
});

document.querySelectorAll('.filter').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach(item => {
    const selected = item === button;
    item.classList.toggle('active', selected);
    item.setAttribute('aria-pressed', String(selected));
  });
  renderProjects();
}));

modalClose.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
  if (event.key !== 'Tab' || modalBackdrop.hidden) return;
  const focusables = [...modal.querySelectorAll('button, a[href]')].filter(element => !element.hasAttribute('disabled'));
  const first = focusables[0]; const last = focusables.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

// Theme uses a saved user choice; without one it follows the operating system.
const themeToggle = document.querySelector('.theme-toggle');
const savedTheme = localStorage.getItem('theme');
const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
document.documentElement.dataset.theme = savedTheme || (systemPrefersLight ? 'light' : 'dark');
function isLight() { return document.documentElement.dataset.theme === 'light'; }
function updateThemeLabel() {
  const light = isLight();
  themeToggle.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  themeToggle.setAttribute('aria-pressed', String(light));
}
themeToggle.addEventListener('click', () => {
  document.documentElement.dataset.theme = isLight() ? 'dark' : 'light';
  localStorage.setItem('theme', document.documentElement.dataset.theme);
  updateThemeLabel();
});
updateThemeLabel();

// Mobile navigation
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
function closeMenu() { menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Open navigation menu'); navLinks.classList.remove('open'); }
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? 'Open navigation menu' : 'Close navigation menu');
  navLinks.classList.toggle('open', !open);
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

// Scroll state + active navigation
const header = document.querySelector('.site-header');
const sections = [...document.querySelectorAll('main section[id]')];
const navMap = new Map([...navLinks.querySelectorAll('a')].map(link => [link.getAttribute('href').slice(1), link]));
function updateActiveNavigation() {
  const marker = scrollY + innerHeight * .36;
  const current = sections.reduce((active, section) => section.offsetTop <= marker ? section : active, null);
  navMap.forEach(link => { link.removeAttribute('aria-current'); link.classList.remove('active'); });
  const link = current && navMap.get(current.id);
  if (link) { link.setAttribute('aria-current', 'location'); link.classList.add('active'); }
}
let scrollTicking = false;
addEventListener('scroll', () => {
  header.classList.toggle('scrolled', scrollY > 18);
  if (!scrollTicking) requestAnimationFrame(() => { updateActiveNavigation(); scrollTicking = false; });
  scrollTicking = true;
}, { passive: true });

let revealObserver;
function observeReveals() {
  if (prefersReducedMotion.matches) { document.querySelectorAll('.reveal').forEach(item => item.classList.add('visible')); return; }
  revealObserver ??= new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: .12 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(item => revealObserver.observe(item));
}

// Subtle pointer tilt + card spotlight; all content is still independently actionable.
function setupTilt() {
  if (prefersReducedMotion.matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('[data-tilt]').forEach(card => {
    if (card.dataset.tiltReady) return;
    card.dataset.tiltReady = 'true';
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width; const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--pointer-x', `${x * 100}%`); card.style.setProperty('--pointer-y', `${y * 100}%`);
      card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 4}deg) translateY(-5px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// Magnetic movement is decorative: keyboard and touch behavior are unaffected.
if (!prefersReducedMotion.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach(element => {
    element.addEventListener('pointermove', event => { const rect = element.getBoundingClientRect(); element.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .11}px, ${(event.clientY - rect.top - rect.height / 2) * .11}px)`; });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}

// Cursor enhancement remains cosmetic and only runs on a fine pointer.
if (!prefersReducedMotion.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const dot = document.querySelector('.cursor-dot'); const ring = document.querySelector('.cursor-ring'); let targetX = -100; let targetY = -100; let ringX = -100; let ringY = -100;
  addEventListener('pointermove', event => { targetX = event.clientX; targetY = event.clientY; dot.style.transform = `translate(${targetX}px, ${targetY}px)`; });
  const drawCursor = () => { ringX += (targetX - ringX) * .18; ringY += (targetY - ringY) * .18; ring.style.transform = `translate(${ringX}px, ${ringY}px)`; requestAnimationFrame(drawCursor); }; drawCursor();
  document.querySelectorAll('a, button').forEach(element => { element.addEventListener('pointerenter', () => document.body.classList.add('cursor-hover')); element.addEventListener('pointerleave', () => document.body.classList.remove('cursor-hover')); });
}

// Typing effect has a stable accessible parent label above.
const words = ['Generative AI', 'Full Stack Development', 'DSA in Java', 'Cloud & AWS', 'AI-powered products'];
const typingWord = document.querySelector('.typing-word');
if (!prefersReducedMotion.matches) {
  let wordIndex = 0, charIndex = words[0].length, deleting = false;
  const type = () => { const word = words[wordIndex]; typingWord.textContent = word.slice(0, charIndex); if (!deleting && charIndex === word.length) { deleting = true; setTimeout(type, 1600); return; } if (deleting && charIndex === 0) { deleting = false; wordIndex = (wordIndex + 1) % words.length; } charIndex += deleting ? -1 : 1; setTimeout(type, deleting ? 34 : 65); }; setTimeout(type, 1200);
}

function setupParticles() {
  if (prefersReducedMotion.matches) return;
  const canvas = document.querySelector('#particle-canvas'); const context = canvas.getContext('2d'); const compact = innerWidth < 720; const count = compact ? 14 : 28; let particles = []; let mouse = { x: -1000, y: -1000 };
  const resize = () => { const ratio = Math.min(devicePixelRatio, 2); canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; context.setTransform(ratio, 0, 0, ratio, 0, 0); particles = Array.from({ length: count }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.2 + .3 })); };
  const frame = () => { context.clearRect(0, 0, innerWidth, innerHeight); for (let i = 0; i < particles.length; i++) { const p = particles[i]; p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > innerWidth) p.vx *= -1; if (p.y < 0 || p.y > innerHeight) p.vy *= -1; const mouseDistance = Math.hypot(p.x - mouse.x, p.y - mouse.y); if (mouseDistance < 120) { p.x += (p.x - mouse.x) * .007; p.y += (p.y - mouse.y) * .007; } context.beginPath(); context.fillStyle = 'rgba(116, 234, 205, .42)'; context.arc(p.x, p.y, p.r, 0, Math.PI * 2); context.fill(); for (let j = i + 1; j < particles.length; j++) { const q = particles[j]; const distance = Math.hypot(p.x - q.x, p.y - q.y); if (distance < 105) { context.beginPath(); context.strokeStyle = `rgba(97, 217, 255, ${.09 * (1 - distance / 105)})`; context.lineWidth = .65; context.moveTo(p.x, p.y); context.lineTo(q.x, q.y); context.stroke(); } } } requestAnimationFrame(frame); };
  addEventListener('resize', resize, { passive: true }); addEventListener('pointermove', event => { mouse.x = event.clientX; mouse.y = event.clientY; }, { passive: true }); resize(); frame();
}

renderProjects(); observeReveals(); updateActiveNavigation(); setupParticles();
