// Navbar scroll effect
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

// Mobile nav toggle
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// Active nav link on scroll
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

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form (demo — no backend)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent! ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      contactForm.reset();
    }, 2500);
  });
}

// ============================================================
// Load editable content from content/site.json (managed by Sveltia CMS)
// ============================================================
async function loadSiteContent() {
  try {
    const res = await fetch('content/site.json?t=' + Date.now()); // cache-bust
    if (!res.ok) throw new Error('Could not load content');
    const data = await res.json();

    // Apply text / HTML content
    document.querySelectorAll('[data-content]').forEach(el => {
      const key = el.getAttribute('data-content');
      if (data[key] !== undefined) {
        // Special case: email link
        if (key === 'contact_email' && el.tagName === 'A') {
          el.textContent = data[key];
          el.href = 'mailto:' + data[key];
        } else {
          el.innerHTML = data[key];
        }
      }
    });
  } catch (err) {
    console.warn('Using fallback content from HTML:', err.message);
  }
}

loadSiteContent();
