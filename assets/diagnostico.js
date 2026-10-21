/* LARÔ.IA — diagnostico.html: monta a mensagem do formulário e abre o WhatsApp.
   Depende de LAROIA_WHATSAPP, definido em main.js (carregado antes). */

const form = document.getElementById('diagnostico-form');
const dorEl = document.getElementById('dor');

// Quem chega por "Incluir no diagnóstico" num card de agente já vem com ele citado
const AGENTES = ['Fiscal', 'Compatibilizador', 'Memorialista', 'Orçamentista', 'Recepcionista', 'Escrivão', 'Apontador', 'Tabelião'];
const agente = new URLSearchParams(window.location.search).get('agente');
if (AGENTES.includes(agente)) dorEl.value = `Quero entender se o ${agente} da LARÔ.IA serve pro meu escritório.`;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const escritorio = document.getElementById('escritorio').value.trim();
  const especialidade = document.getElementById('especialidade').value;
  const dor = dorEl.value.trim();

  let msg = `Olá! Sou ${nome}`;
  if (escritorio) msg += `, do escritório ${escritorio}`;
  msg += `. Área: ${especialidade}.`;
  if (dor) msg += ` O que mais rouba meu tempo hoje: ${dor}`;
  if (dor && !/[.!?]$/.test(dor)) msg += '.';
  msg += ' Quero agendar o diagnóstico gratuito da LARÔ.IA.';

  window.open(`https://wa.me/${LAROIA_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
});
