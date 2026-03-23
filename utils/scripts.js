/* ═══════════════════════════════════════════════════════════
   CORTE E REDE, LDA — scripts.js
   Versão: 2.0
   Descrição: Navegação, scroll reveal, tabs de produtos
              e menu hamburger de preços por produto
═══════════════════════════════════════════════════════════ */

/* ════════════════════════════════
   1. NAVEGAÇÃO — Scroll + Burger
════════════════════════════════ */
(function() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const mob    = document.getElementById('mobMenu');

  /* — Mudar aparência da nav ao fazer scroll — */
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* Estado inicial (caso a página seja recarregada a meio) */
  nav.classList.toggle('scrolled', window.scrollY > 50);

  /* — Burger toggle (menu mobile) — */
  if (burger && mob) {
    function toggleMenu(open) {
      burger.classList.toggle('open', open);
      mob.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', () => {
      toggleMenu(!mob.classList.contains('open'));
    });

    /* Fechar ao clicar num link do menu */
    mob.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => toggleMenu(false));
    });

    /* Fechar com a tecla Escape */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }

  /* — Smooth scroll para âncoras — */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const off = nav.offsetHeight;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - off,
        behavior: 'smooth'
      });
    });
  });
})();


/* ════════════════════════════════
   2. SCROLL REVEAL (Intersection Observer)
   Activa animação .fade-up quando o elemento
   entra no viewport
════════════════════════════════ */
(function() {
  const els = document.querySelectorAll('.fade-up');
  if (!els.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target); /* anima apenas uma vez */
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));

  /* Activar elementos já visíveis no carregamento */
  setTimeout(() => {
    els.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('in');
      }
    });
  }, 80);
})();


/* ════════════════════════════════
   3. TABS DE PRODUTOS
   Alterna entre o painel Carnes e Peixes
════════════════════════════════ */
(function() {
  const tabs   = document.querySelectorAll('.prod-tab');
  const panels = document.querySelectorAll('.prod-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.target;

      /* — Actualiza tabs — */
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      /* — Fecha TODOS os menus de preços abertos antes de mudar de tab — */
      document.querySelectorAll('.prod-menu.open').forEach(m => {
        m.classList.remove('open');
        m.setAttribute('aria-hidden', 'true');
      });
      document.querySelectorAll('.prod-toggle.open').forEach(t => {
        t.classList.remove('open');
        t.setAttribute('aria-expanded', 'false');
      });

      /* — Actualiza painéis — */
      panels.forEach(p => {
        const isActive = p.dataset.cat === cat;
        p.classList.toggle('active', isActive);

        /* Re-anima os itens ao mudar de tab */
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


/* ════════════════════════════════════════════════════
   4. MENU HAMBURGER DE PREÇOS (prod-toggle)
   
   Cada card de produto tem um botão com 3 linhas (☰).
   Ao clicar:
     • As 3 linhas transformam-se num X
     • O menu de cortes/preços desliza para baixo
     • Comportamento de acordeão: fecha os outros cards
   
   Acessibilidade:
     • aria-expanded no botão
     • aria-hidden no menu
     • Suporte a teclado (Enter / Space)
════════════════════════════════════════════════════ */
(function() {

  /**
   * Fecha um menu de preços específico
   * @param {HTMLElement} toggle  — O botão hamburger do card
   * @param {HTMLElement} menu    — O div do menu de preços
   */
  function fecharMenu(toggle, menu) {
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
  }

  /**
   * Abre um menu de preços específico
   * @param {HTMLElement} toggle  — O botão hamburger do card
   * @param {HTMLElement} menu    — O div do menu de preços
   */
  function abrirMenu(toggle, menu) {
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
  }

  /**
   * Fecha TODOS os menus abertos (acordeão)
   * Usado antes de abrir um novo
   */
  function fecharTodos() {
    document.querySelectorAll('.prod-toggle.open').forEach(t => {
      const item = t.closest('.prod-item');
      const m    = item ? item.querySelector('.prod-menu') : null;
      if (m) fecharMenu(t, m);
    });
  }

  /* — Inicializar todos os botões hamburger — */
  const toggles = document.querySelectorAll('.prod-toggle');

  toggles.forEach(toggle => {

    toggle.addEventListener('click', function(e) {
      e.stopPropagation(); /* evita que o click propague para o prod-item */

      const item   = toggle.closest('.prod-item');
      const menu   = item ? item.querySelector('.prod-menu') : null;

      if (!menu) return; /* segurança */

      const estaAberto = menu.classList.contains('open');

      /* Fechar todos em acordeão */
      fecharTodos();

      /* Se estava fechado, abrir este */
      if (!estaAberto) {
        abrirMenu(toggle, menu);

        /* Scroll suave para o card se estiver fora do viewport */
        setTimeout(() => {
          const rect = item.getBoundingClientRect();
          const navH = document.getElementById('nav')?.offsetHeight || 64;
          if (rect.bottom > window.innerHeight) {
            window.scrollTo({
              top: window.scrollY + rect.top - navH - 16,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
      /* Se estava aberto, já foi fechado pelo fecharTodos() */
    });

  });

  /* — Fechar menus ao clicar fora — */
  document.addEventListener('click', function(e) {
    /* Se o clique não foi dentro de um prod-item, fechar tudo */
    if (!e.target.closest('.prod-item')) {
      fecharTodos();
    }
  });

  /* — Fechar menus com a tecla Escape — */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      fecharTodos();
    }
  });

})();