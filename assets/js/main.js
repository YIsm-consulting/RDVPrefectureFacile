/* ============================================================
   RDVPrefectureFacile.fr — JavaScript principal
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Menu mobile --- */
  const toggle = document.querySelector('.navbar-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-menu a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* --- Marquer le lien actif dans la nav --- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* --- Accordion FAQ --- */
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.closest('.faq-item');
      const answer = item.querySelector('.faq-answer');
      const isOpen = q.classList.contains('open');

      document.querySelectorAll('.faq-question.open').forEach(o => {
        o.classList.remove('open');
        o.closest('.faq-item').querySelector('.faq-answer').classList.remove('open');
      });

      if (!isOpen) {
        q.classList.add('open');
        answer.classList.add('open');
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  /* --- Filtre catégories FAQ --- */
  const catBtns = document.querySelectorAll('.faq-cat-btn');
  const faqItems = document.querySelectorAll('.faq-item');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      faqItems.forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  /* --- Compteur animé (stats) --- */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const animateCounter = (el) => {
    const target = +el.dataset.target;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = prefix + Math.floor(current).toLocaleString('fr-FR') + suffix;
    }, 16);
  };
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  } else {
    counters.forEach(animateCounter);
  }

  /* --- Formulaire de contact --- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      btn.textContent = 'Message envoyé ✓';
      btn.disabled = true;
      btn.style.background = 'var(--green)';
      setTimeout(() => {
        btn.textContent = 'Envoyer mon message';
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 4000);
    });
  }

  /* --- Formulaire d'inscription --- */
  const inscriptionForm = document.getElementById('inscription-form');
  if (inscriptionForm) {
    inscriptionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'paiement.html';
    });
  }

  /* --- Smooth scroll pour les ancres --- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* --- Navbar scroll shadow --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.style.boxShadow = window.scrollY > 20
        ? '0 2px 20px rgba(0,0,0,0.10)'
        : 'none';
    }, { passive: true });
  }

  /* --- Barre de recherche préfecture --- */
  const searchInput = document.getElementById('prefecture-search');
  if (searchInput) {
    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = searchInput.value.trim();
        if (val) window.location.href = `inscription.html?prefecture=${encodeURIComponent(val)}`;
      }
    });
  }

  /* --- Pré-remplir inscription depuis URL --- */
  const params = new URLSearchParams(window.location.search);
  const prefInput = document.getElementById('field-prefecture');
  if (prefInput && params.get('prefecture')) {
    prefInput.value = params.get('prefecture');
  }

});
