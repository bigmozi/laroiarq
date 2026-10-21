/* LARÔ.IA — comportamento compartilhado entre as páginas.
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

// Hero da home: grafo dos agentes no estilo do canvas do Obsidian.
const heroHome = document.querySelector('.hero--home');
if (heroHome) {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Grafo: lê os nós e as ligações do HTML (data-parent e data-links) e desenha as linhas no <svg>
  const graph = heroHome.querySelector('.graph');
  if (graph) {
    const svg = graph.querySelector('.graph__edges');
    const nodes = new Map();
    graph.querySelectorAll('.graph__node').forEach((el, i) => {
      nodes.set(el.dataset.id, { el, id: el.dataset.id, x: 0, y: 0, dx: 0, dy: 0, phase: i * 1.7, links: new Set(), on: false });
    });

    const edges = [];
    const addEdge = (a, b, kind) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.classList.add('graph__edge');
      if (kind === 'link') line.classList.add('graph__edge--link');
      svg.appendChild(line);
      const edge = { a: nodes.get(a), b: nodes.get(b), line, start: 0, dur: 0 };
      edge.a.links.add(edge.b);
      edge.b.links.add(edge.a);
      edges.push(edge);
      return edge;
    };
    nodes.forEach((n) => {
      const { parent, links } = n.el.dataset;
      if (parent) n.parentEdge = addEdge(parent, n.id, 'main');
      if (links) links.split(' ').forEach((l) => addEdge(n.id, l, 'link'));
    });

    // Linha do tempo da entrada (ms): palavra → tridente → áreas → agentes, um atrás do outro.
    // O nó abre quando a linha dele está quase chegando.
    const depth = (n) => (n.parentEdge ? depth(n.parentEdge.a) + 1 : 0);
    let agentIndex = 0;
    nodes.forEach((n) => {
      const e = n.parentEdge;
      if (!e) { n.popAt = 0; return; }
      const d = depth(n);
      if (d === 1) { e.start = 0; e.dur = 320; }
      else if (d === 2) { e.start = 320; e.dur = 420; }
      else { e.start = 740 + agentIndex++ * 70; e.dur = 420; }
      n.popAt = e.start + e.dur * 0.8;
    });

    // Centro e raio de cada nó em px dentro do .graph (a margem negativa do CSS já centraliza a bolinha)
    const measure = () => {
      nodes.forEach((n) => {
        n.r = n.el.offsetWidth / 2;
        n.x = n.el.offsetLeft + n.r;
        n.y = n.el.offsetTop + n.el.offsetHeight / 2;
      });
    };

    const pointer = { x: 0, y: 0, inside: false };
    let active = null;
    const setActive = (n) => {
      if (n === active) return;
      if (active) {
        active.el.classList.remove('is-active');
        active.links.forEach((m) => m.el.classList.remove('is-linked'));
      }
      active = n;
      graph.classList.toggle('is-focus', Boolean(n));
      edges.forEach((e) => e.line.classList.toggle('is-active', Boolean(n) && (e.a === n || e.b === n)));
      if (n) {
        n.el.classList.add('is-active');
        n.links.forEach((m) => m.el.classList.add('is-linked'));
      }
    };

    let introStart = reduce ? 0 : null;
    const ease = (p) => 1 - (1 - p) ** 3;
    const PULL = 0.12;
    const PULL_MAX = 14;

    // Um quadro: respiro de cada nó, puxão do nó aceso em direção ao cursor, linhas atrás
    const frame = (now) => {
      const t = now / 1000;
      const elapsed = introStart === null ? 0 : now - introStart;
      nodes.forEach((n) => {
        let dx = 0;
        let dy = 0;
        if (!reduce && n.id !== 'palavra') {
          dx = Math.sin(t * 0.6 + n.phase) * 3;
          dy = Math.cos(t * 0.5 + n.phase * 1.3) * 4;
          if (n === active && pointer.inside) {
            const px = (pointer.x - n.x) * PULL;
            const py = (pointer.y - n.y) * PULL;
            const len = Math.hypot(px, py) || 1;
            const k = Math.min(1, PULL_MAX / len);
            dx += px * k;
            dy += py * k;
          }
        }
        n.dx = dx;
        n.dy = dy;
        n.el.style.translate = `${dx.toFixed(2)}px ${dy.toFixed(2)}px`;
        if (introStart !== null && !n.on && elapsed >= n.popAt) {
          n.on = true;
          n.el.classList.add('is-on');
        }
      });
      // A linha começa e termina na borda de cada bolinha, não no centro
      edges.forEach((e) => {
        const cx = e.b.x + e.b.dx - (e.a.x + e.a.dx);
        const cy = e.b.y + e.b.dy - (e.a.y + e.a.dy);
        const len = Math.hypot(cx, cy) || 1;
        const ux = cx / len;
        const uy = cy / len;
        const ax = e.a.x + e.a.dx + ux * e.a.r;
        const ay = e.a.y + e.a.dy + uy * e.a.r;
        const bx = e.b.x + e.b.dx - ux * e.b.r;
        const by = e.b.y + e.b.dy - uy * e.b.r;
        const p = e.dur ? ease(Math.min(1, Math.max(0, (elapsed - e.start) / e.dur))) : 1;
        e.line.setAttribute('x1', ax.toFixed(1));
        e.line.setAttribute('y1', ay.toFixed(1));
        e.line.setAttribute('x2', (ax + (bx - ax) * p).toFixed(1));
        e.line.setAttribute('y2', (ay + (by - ay) * p).toFixed(1));
      });
    };

    let raf = 0;
    let running = false;
    const loop = (now) => { frame(now); raf = requestAnimationFrame(loop); };
    const start = () => { if (!running && !reduce) { running = true; raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const redraw = () => { measure(); frame(performance.now()); };

    if (!reduce) graph.classList.add('is-armed');
    redraw();
    window.addEventListener('resize', () => requestAnimationFrame(redraw));

    // Sem mouse: acende um agente por vez, devagar, enquanto o grafo está na tela
    const agents = [...nodes.values()].filter((n) => n.el.classList.contains('graph__node--agent'));
    let cycle = 0;
    let cycleIndex = 0;
    const startCycle = () => {
      if (finePointer || reduce || cycle) return;
      cycle = setInterval(() => setActive(agents[cycleIndex++ % agents.length]), 2200);
    };
    const stopCycle = () => { clearInterval(cycle); cycle = 0; if (!finePointer) setActive(null); };

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          if (introStart === null) introStart = performance.now();
          start();
          startCycle();
        } else {
          stop();
          stopCycle();
        }
      }, { threshold: 0.25 }).observe(graph);
    } else {
      introStart = 0;
      start();
    }

    // Com mouse: o nó mais perto do cursor (até 90px) acende junto com os vizinhos.
    // O ponteiro é escutado no hero inteiro, não no .graph, porque o texto fica sobreposto:
    // escutando só no grafo, o foco apagaria sempre que o cursor passasse por cima da headline.
    if (finePointer) {
      heroHome.addEventListener('pointermove', (e) => {
        const box = graph.getBoundingClientRect();
        pointer.x = e.clientX - box.left;
        pointer.y = e.clientY - box.top;
        pointer.inside = true;
        let best = null;
        let bestDist = 90;
        nodes.forEach((n) => {
          if (n.id === 'palavra' || (!reduce && !n.on)) return;
          const d = Math.hypot(n.x - pointer.x, n.y - pointer.y);
          if (d < bestDist) { best = n; bestDist = d; }
        });
        setActive(best);
        if (reduce) frame(performance.now());
      });
      heroHome.addEventListener('pointerleave', () => {
        pointer.inside = false;
        setActive(null);
      });
    }
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
  const mes = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
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

    // A mesma conta sustenta a seção de investimento: a faixa que a rotina típica devolve
    // (de 70% a 80% do que hoje não vira cobrança) e quanto tempo desse valor paga o
    // desenvolvimento sob medida, cujo preço fica no data-price do próprio box.
    const recMin = out('anchor-recovered-min');
    const recMax = out('anchor-recovered-max');
    if (recMin) recMin.textContent = brl.format(mensal * 0.7);
    if (recMax) recMax.textContent = brl.format(mensal * 0.8);

    const devRef = out('price-dev-ref');
    const devBox = devRef && devRef.closest('[data-price]');
    if (devRef && devBox) {
      const preco = Number(devBox.dataset.price);
      if (!mensal) {
        devRef.textContent = 'Mexa na calculadora acima pra ver esse valor na régua do seu escritório.';
      } else {
        const meses = preco / mensal;
        devRef.textContent = meses < 1
          ? 'Menos de um mês do que você deixa de cobrar hoje.'
          : `${mes.format(meses)} meses do que você deixa de cobrar hoje.`;
      }
    }

    Object.values(fields).forEach(paintRange);
  };

  Object.values(fields).forEach((el) => el.addEventListener('input', update));
  update();
}

// Ano no rodapé
const yearEl = document.getElementById('ano');
if (yearEl) yearEl.textContent = new Date().getFullYear();
