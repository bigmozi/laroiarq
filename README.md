# laroiarq

Site da LARÔ.IA para escritórios de arquitetura, engenharia de compatibilização e design de interiores (laroiarq.vercel.app). É a **LP vertical — arquitetura e engenharia**. A **LP geral — por público e dor** mora em `bigmozi/laroia-solucoes-ia` (laroia-solucoes-ia.vercel.app).

## Páginas

- `index.html`: landing page. Hero com o grafo dos agentes no estilo do canvas do Obsidian (tridente, as três áreas e os oito agentes ligados por linhas que se desenham na entrada e acendem no hover), com a headline sobreposta, catálogo de oito agentes com nome de ofício (Fiscal, Compatibilizador, Memorialista, Orçamentista, Recepcionista, Escrivão, Apontador e Tabelião), calculadora do custo da revisão fora do escopo, investimento e dúvidas, na ordem de página de vendas do método LBA.
- `diagnostico.html`: formulário do diagnóstico gratuito, que abre o WhatsApp com a mensagem pronta. Aceita `?agente=Nome` para já citar o agente.
- `demonstrativo_obra.html`: simulação clicável do Apontador, o agente de obra que já roda num caso real.

## Como é feito

HTML, CSS e JavaScript puros, sem framework e sem etapa de build. A fonte de título é a BDO Grotesk variável (licença OFL), servida da própria pasta em `assets/fonts/`; a Inter, do corpo, vem do Google Fonts. Os títulos ficam em caixa alta. Qualquer servidor de arquivos estáticos publica o site como está; na Vercel, basta importar o repositório sem configurar nada.

- `assets/tokens.css`: design tokens em duas camadas. Os primitivos (`--laro-*`) guardam a paleta e só são lidos ali dentro. Os semânticos (`--color-*`, `--space-*`, `--text-*`) dizem o papel de cada valor.
- `assets/style.css`: componentes. Usa só os tokens semânticos: nenhum hex e nenhum número solto de tamanho de fonte, entrelinha ou espaçamento de letra.
- `assets/main.js`: animação de entrada, nav, grafo do hero, acordeões, filtro de agentes, calculadora (ligada à âncora e à régua do investimento) e o número do WhatsApp do formulário.
- `assets/diagnostico.js`: monta a mensagem do formulário do diagnóstico e abre o WhatsApp.
- `assets/demonstrativo.js`: simulação passo a passo do Apontador.
- `assets/favicon.svg`: ícone da aba. A marca usada nas páginas fica num sprite SVG no começo de cada HTML, com a cor vinda dos tokens.
- `assets/fonts/`: BDO Grotesk variável e a licença OFL.

Os HTML não têm `style=""` nem `<script>` inline.

O WhatsApp de contato é +55 (71) 99655-1316 (`5571996551316`).

## De onde vem

A fonte desta versão fica no vault, em `produtos/laro.ia-arquitetura/lp-solucoes-ia/`, junto com o histórico das decisões e as pendências antes de tráfego pago. Até 2026-10-21 ela era publicada em `bigmozi/laroia-solucoes-ia`; nessa data passou para cá, e aquele repositório ficou com a LP geral. O site anterior deste repositório (versão com Tailwind, de julho) segue no histórico do git, no commit `936f886`.

Quando a pasta do vault mudar, copiar de novo as três páginas e a pasta `assets/` inteira (sete arquivos e `fonts/`). O `README.md` do vault não vem para cá.

## Ver localmente

```
python3 -m http.server 8765
```

Depois abrir http://127.0.0.1:8765/.
