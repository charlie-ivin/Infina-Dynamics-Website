const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

const sections = document.querySelectorAll('section[id], header[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

const ICONS = {
  layers: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>',
  'arrow-up': '<path d="M12 19V5M5 12l7-7 7 7"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  sparkles: '<path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14zM5 14l.75 2.25L8 17l-2.25.75L5 20l-.75-2.25L2 17l2.25-.75L5 14z"/>',
  palette: '<circle cx="13.5" cy="6.5" r="2"/><circle cx="17.5" cy="10.5" r="2"/><circle cx="8.5" cy="7.5" r="2"/><circle cx="6.5" cy="12.5" r="2"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.7-.1 2.5-.3"/>',
  pen: '<path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.6 7.6"/>'
};

function iconSvg(name) {
  const path = ICONS[name] || ICONS.layers;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">${path}</svg>`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderServices(list) {
  const grid = document.getElementById('servicesGrid');
  if (!grid || !Array.isArray(list)) return;
  grid.innerHTML = list.map(item => `
    <article class="service-card">
      <div class="service-icon">${iconSvg(item.icon)}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.desc)}</p>
    </article>
  `).join('');
}

function renderProjects(list) {
  const grid = document.getElementById('portfolioGrid');
  if (!grid || !Array.isArray(list)) return;
  grid.innerHTML = list.map(item => {
    const hasImg = item.image && item.image.trim() !== '';
    return `
    <article class="portfolio-item${hasImg ? ' has-image' : ''}">
      <div class="portfolio-image">
        <img src="${hasImg ? escapeHtml(item.image) : 'images/uploads/placeholder.svg'}" alt="${escapeHtml(item.title)}">
      </div>
      <div class="portfolio-meta">
        <span>${escapeHtml(item.tag)}</span>
        <p>${escapeHtml(item.title)}</p>
      </div>
    </article>`;
  }).join('');
}

function renderContact(list) {
  const cards = document.getElementById('contactCards');
  if (!cards || !Array.isArray(list)) return;
  cards.innerHTML = list.map(item => {
    const label = escapeHtml(item.label);
    const value = escapeHtml(item.value);
    const type = item.type || 'text';
    if (type === 'email') {
      return `<a href="mailto:${escapeHtml(item.value)}" class="contact-card"><strong>${label}</strong><span>${value}</span></a>`;
    }
    if (type === 'phone') {
      return `<a href="tel:${escapeHtml(item.value)}" class="contact-card"><strong>${label}</strong><span>${value}</span></a>`;
    }
    if (type === 'link') {
      return `<a href="${escapeHtml(item.value)}" class="contact-card" target="_blank" rel="noopener noreferrer"><strong>${label}</strong><span>${value}</span></a>`;
    }
    return `<div class="contact-card"><strong>${label}</strong><span>${value}</span></div>`;
  }).join('');
}

async function loadSiteContent() {
  try {
    const res = await fetch('content/site.json?t=' + Date.now());
    if (!res.ok) throw new Error('Could not load content');
    const data = await res.json();

    document.querySelectorAll('[data-content]').forEach(el => {
      const key = el.getAttribute('data-content');
      if (data[key] !== undefined && data[key] !== '' && typeof data[key] === 'string') {
        if (key === 'footer_email' && el.tagName === 'A') {
          el.textContent = data[key];
          el.href = 'mailto:' + data[key];
        } else {
          el.innerHTML = data[key];
        }
      }
    });

    renderServices(data.services);
    renderProjects(data.projects);
    renderContact(data.contact_items);
  } catch (err) {
    console.warn('Using fallback content from HTML:', err.message);
  }
}

loadSiteContent();
