/* LARÔ.IA Soluções em IA — comportamento compartilhado entre as páginas.
   Cada bloco só roda se o elemento existir na página. */

// Número único de WhatsApp do site. Formato wa.me: 55 + DDD + 9 dígitos.
const LAROIA_WHATSAPP = '5571996551316';

// Entrada suave ao rolar
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  revealEls.forEach((el) => revealObs.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Borda da nav depois de rolar
const navEl = document.getElementById('nav');
if (navEl) {
  const onScroll = () => navEl.classList.toggle('is-scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// Hero da home: fluxograma de fundo com lanterna no cursor.
// Clona o desenho numa camada acesa; o CSS só mostra essa camada dentro do círculo em --mx/--my.
const heroHome = document.querySelector('.hero--home');
const blueprint = heroHome && heroHome.querySelector('.blueprint');
if (blueprint) {
  const lit = blueprint.cloneNode(true);
  lit.classList.add('blueprint--lit');
  blueprint.after(lit);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Centro da lanterna, em px relativos à camada acesa
  const spot = (x, y) => {
    const box = lit.getBoundingClientRect();
    heroHome.style.setProperty('--mx', `${Math.round(x - box.left)}px`);
    heroHome.style.setProperty('--my', `${Math.round(y - box.top)}px`);
  };
  // Parallax leve: -1 a 1 em cada eixo, a partir do centro do hero
  const tilt = (x, y) => {
    const box = heroHome.getBoundingClientRect();
    heroHome.style.setProperty('--px', (((x - box.left) / box.width) * 2 - 1).toFixed(3));
    heroHome.style.setProperty('--py', (((y - box.top) / box.height) * 2 - 1).toFixed(3));
  };

  if (finePointer) {
    let frame = 0;
    heroHome.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        spot(e.clientX, e.clientY);
        if (!reduce) tilt(e.clientX, e.clientY);
      });
      heroHome.classList.add('is-lit');
    });
    heroHome.addEventListener('pointerleave', () => {
      heroHome.classList.remove('is-lit');
      heroHome.style.setProperty('--px', '0');
      heroHome.style.setProperty('--py', '0');
    });
  } else if (!reduce && 'IntersectionObserver' in window) {
    // Sem mouse: a lanterna passeia devagar pelo desenho enquanto o hero está na tela
    let frame = 0;
    const drift = (time) => {
      const box = heroHome.getBoundingClientRect();
      const s = time / 1000;
      spot(
        box.left + box.width * (0.5 + 0.4 * Math.sin(s * 0.45)),
        box.top + box.height * (0.5 + 0.42 * Math.sin(s * 0.7 + 1.2)),
      );
      frame = requestAnimationFrame(drift);
    };
    new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame);
      heroHome.classList.toggle('is-lit', entry.isIntersecting);
      if (entry.isIntersecting) frame = requestAnimationFrame(drift);
    }).observe(heroHome);
  }
}

// Cards de problema: abre no hover (desktop) e no toque/clique (mobile)
document.querySelectorAll('.problem').forEach((item) => {
  const btn = item.querySelector('.toggle');
  item.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

// FAQ
document.querySelectorAll('.faq__item').forEach((item) => {
  const btn = item.querySelector('.faq__q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
});

// Filtro de agentes por especialidade
const agentGrid = document.querySelector('.agent-grid');
const chips = document.querySelectorAll('.chip[data-filter]');
if (agentGrid && chips.length) {
  const agents = agentGrid.querySelectorAll('.agent');
  const status = document.getElementById('agent-count');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const f = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
      let shown = 0;
      agents.forEach((a) => {
        const match = f === 'todos' || a.dataset.seg.split(' ').includes(f);
        a.hidden = !match;
        if (match) shown++;
      });
      agentGrid.classList.toggle('is-filtered', f !== 'todos');
      if (status) status.textContent = `${shown} agentes para ${chip.textContent.trim().toLowerCase()}`;
    });
  });
}

// Calculadora: custo da revisão fora do escopo que não vira cobrança
const calc = document.getElementById('calculadora-form');
if (calc) {
  calc.addEventListener('submit', (e) => e.preventDefault());
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  const fields = {
    projetos: calc.querySelector('#calc-projetos'),
    revisoes: calc.querySelector('#calc-revisoes'),
    horas: calc.querySelector('#calc-horas'),
    valor: calc.querySelector('#calc-valor'),
  };
  const out = (id) => document.getElementById(id);

  const paintRange = (el) => {
    const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
    el.style.setProperty('--fill', `${pct}%`);
  };

  const update = () => {
    const p = Number(fields.projetos.value);
    const r = Number(fields.revisoes.value);
    const h = Number(fields.horas.value);
    const v = Number(fields.valor.value);

    out('calc-projetos-out').textContent = p;
    out('calc-revisoes-out').textContent = r;
    out('calc-horas-out').textContent = `${h}h`;
    out('calc-valor-out').textContent = brl.format(v);

    const revisoesMes = p * r;
    const horasMes = revisoesMes * h;
    const mensal = horasMes * v;

    out('calc-mensal').textContent = brl.format(mensal);
    out('calc-anual').textContent = brl.format(mensal * 12);
    out('calc-horas-mes').textContent = `${num.format(horasMes)}h`;
    out('calc-revisoes-mes').textContent = num.format(revisoesMes);

    const anchor = out('anchor-value');
    if (anchor) anchor.textContent = brl.format(mensal);

    Object.values(fields).forEach(paintRange);
  };

  Object.values(fields).forEach((el) => el.addEventListener('input', update));
  update();
}

// Ano no rodapé
const yearEl = document.getElementById('ano');
if (yearEl) yearEl.textContent = new Date().getFullYear();
