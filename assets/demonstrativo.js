/* LARÔ.IA — demonstrativo_obra.html: simulação passo a passo do Apontador
   (checklist da obra, status de prazo, memorial de acabamento e log do agente). */

const checklistItems = [
  { label: 'Fundação e estrutura', done: false },
  { label: 'Alvenaria e instalações', done: false },
  { label: 'Pintura da sala', done: false },
  { label: 'Piso da sala', done: false },
  { label: 'Pintura do quarto 2', done: false },
];

const steps = [
  {
    check: 0,
    dias: '18 dias corridos / 90 dias contratados',
    status: { text: 'no prazo', mod: 'ok' },
    log: 'Agente registrou o início da obra e o prazo contratado. Nenhum atraso até aqui.',
  },
  {
    check: 1,
    dias: '52 dias corridos / 90 dias contratados',
    status: { text: 'atenção', mod: 'warn' },
    log: 'Ritmo de execução ficou abaixo do esperado pra essa fase. Agente sinaliza atenção: não decide se é atraso real, só aponta o desvio de ritmo pra responsável confirmar.',
  },
  {
    check: 2,
    dias: '61 dias corridos / 90 dias contratados',
    status: { text: 'atenção', mod: 'warn' },
    memorial: { ambiente: 'Pintura da sala', spec: 'Tinta acrílica fosca, cor Cinza Concreto, sem padrão geométrico.', origem: 'repetido de obra anterior, mesmo cliente' },
    log: 'Item "Pintura da sala" marcado no checklist. Agente já preenche o memorial de acabamento puxando a última decisão de tinta usada com esse cliente, pra responsável só confirmar.',
  },
  {
    check: 3,
    memorial: { ambiente: 'Piso da sala', spec: 'Porcelanato acetinado, tom Cimento Queimado, sem geométrico.', origem: 'repetido de obra anterior, mesmo cliente' },
    log: 'Item "Piso da sala" marcado. Mesmo raciocínio: memorial preenchido a partir do padrão já usado, revisão da responsável ainda é obrigatória antes de virar documento oficial.',
  },
  {
    check: 4,
    dias: '74 dias corridos / 90 dias contratados',
    status: { text: 'atrasado', mod: 'risk' },
    memorial: { ambiente: 'Pintura do quarto 2', spec: 'Tinta acrílica acetinada, cor Areia Clara.', origem: 'nova combinação, sem repetição anterior' },
    log: 'Ritmo confirma atraso frente ao prazo contratado. Agente sinaliza "atrasado" com o dado por trás (dias corridos x contratado), pra decisão de cobrar ou negociar prazo sair com número na mão.',
  },
];

let stepIndex = 0;
const badge = document.getElementById('status-badge');
const diasEl = document.getElementById('dias-info');
const memorialEl = document.getElementById('memorial');
const logEl = document.getElementById('agent-log');

function setBadge(text, mod) {
  badge.textContent = text;
  badge.className = `badge badge--${mod}`;
}

function renderChecklist() {
  const ul = document.getElementById('checklist');
  ul.innerHTML = checklistItems.map((item) => `
    <li>
      <input type="checkbox" disabled ${item.done ? 'checked' : ''} aria-label="${item.label}">
      <span class="${item.done ? 'is-done' : ''}">${item.label}</span>
    </li>`).join('');
}

function nextStep() {
  if (stepIndex >= steps.length) return;
  const s = steps[stepIndex];

  checklistItems[s.check].done = true;
  renderChecklist();

  if (s.dias) diasEl.textContent = s.dias;
  if (s.status) setBadge(s.status.text, s.status.mod);

  if (s.memorial) {
    const empty = memorialEl.querySelector('.sim__empty');
    if (empty) empty.remove();
    memorialEl.insertAdjacentHTML('beforeend', `
      <div class="sim__memorial-item">
        <strong>${s.memorial.ambiente}</strong>
        <p>${s.memorial.spec}</p>
        <small>${s.memorial.origem}</small>
      </div>`);
  }

  logEl.insertAdjacentHTML('afterbegin', `<p><b>Agente:</b> ${s.log}</p>`);
  stepIndex++;
}

function resetSim() {
  stepIndex = 0;
  checklistItems.forEach((i) => { i.done = false; });
  renderChecklist();
  diasEl.textContent = '— dias corridos / — dias contratados';
  setBadge('aguardando dado', 'idle');
  memorialEl.innerHTML = '<p class="sim__empty">Nenhum ambiente lançado ainda.</p>';
  logEl.innerHTML = '';
}

document.getElementById('sim-next').addEventListener('click', nextStep);
document.getElementById('sim-reset').addEventListener('click', resetSim);
renderChecklist();
