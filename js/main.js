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

async function loadSiteContent() {
  try {
    const res = await fetch('content/site.json?t=' + Date.now());
    if (!res.ok) throw new Error('Could not load content');
    const data = await res.json();

    document.querySelectorAll('[data-content]').forEach(el => {
      const key = el.getAttribute('data-content');
      if (data[key] !== undefined && data[key] !== '') {
        if ((key === 'contact_email' || key === 'footer_email') && el.tagName === 'A') {
          el.textContent = data[key];
          el.href = 'mailto:' + data[key];
        } else {
          el.innerHTML = data[key];
        }
      }
    });

    document.querySelectorAll('[data-content-src]').forEach(el => {
      const key = el.getAttribute('data-content-src');
      if (data[key]) {
        el.src = data[key];
        const titleKey = key.replace('_image', '_title');
        el.alt = data[titleKey] || '';
        el.closest('.portfolio-item')?.classList.add('has-image');
      }
    });

    document.querySelectorAll('[data-content-href]').forEach(el => {
      const key = el.getAttribute('data-content-href');
      if (data[key]) {
        el.href = 'mailto:' + data[key];
      }
    });
  } catch (err) {
    console.warn('Using fallback content from HTML:', err.message);
  }
}

loadSiteContent();
