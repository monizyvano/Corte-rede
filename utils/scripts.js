/* ════════════════════════════════
   NAVEGAÇÃO — Scroll + Burger
════════════════════════════════ */
(function() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mob    = document.getElementById('mobMenu');

  // Nav scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
  nav.classList.toggle('scrolled', window.scrollY > 50);

  // Burger toggle
  if (burger && mob) {
    function toggleMenu(open) {
      burger.classList.toggle('open', open);
      mob.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', () => toggleMenu(!mob.classList.contains('open')));
    mob.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });
  }

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const off = nav.offsetHeight;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - off, behavior: 'smooth' });
    });
  });
})();

/* ════════════════════════════════
   SCROLL REVEAL (Intersection Observer)
════════════════════════════════ */
(function() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));

  // Activar os visíveis no carregamento
  setTimeout(() => {
    els.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9)
        el.classList.add('in');
    });
  }, 80);
})();

/* ════════════════════════════════
   TABS DE PRODUTOS
════════════════════════════════ */
(function() {
  const tabs   = document.querySelectorAll('.prod-tab');
  const panels = document.querySelectorAll('.prod-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.target;

      // Actualiza tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Actualiza painéis
      panels.forEach(p => {
        const isActive = p.dataset.cat === cat;
        p.classList.toggle('active', isActive);
        // Re-anima os itens ao mudar de tab
        if (isActive) {
          p.querySelectorAll('.fade-up').forEach(el => {
            el.classList.remove('in');
            setTimeout(() => el.classList.add('in'), 50);
          });
        }
      });
    });
  });
})();