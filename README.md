# laroiarq

Site da LARÔ.IA Soluções em IA, para escritórios de arquitetura, engenharia de compatibilização e design de interiores. Publicado pela Vercel em https://laroiarq.vercel.app a partir da `main`.

## Páginas

- `index.html`: landing page. Hero com fluxograma de fundo e lanterna que segue o cursor, catálogo de oito agentes com nome de ofício (Fiscal, Compatibilizador, Memorialista, Orçamentista, Recepcionista, Escrivão, Apontador e Tabelião), calculadora do custo da revisão fora do escopo, investimento e dúvidas.
- `diagnostico.html`: formulário do diagnóstico gratuito, que abre o WhatsApp com a mensagem pronta. Aceita `?agente=Nome` para já citar o agente.
- `demonstrativo_obra.html`: simulação clicável do Apontador, o agente de obra que já roda num caso real.

## Como é feito

HTML, CSS e JavaScript puros, sem framework e sem etapa de build. As fontes Sora e Inter vêm do Google Fonts.

- `assets/tokens.css`: design tokens em duas camadas. Os primitivos (`--laro-*`) guardam a paleta e só são lidos ali dentro. Os semânticos (`--color-*`, `--space-*`, `--text-*`) dizem o papel de cada valor.
- `assets/style.css`: componentes. Usa só os tokens semânticos, sem nenhum hex.
- `assets/main.js`: animação de entrada, nav, lanterna do hero, acordeões, filtro de agentes, calculadora e o número do WhatsApp do formulário.
- `assets/favicon.svg`: ícone da aba. A marca usada nas páginas fica num sprite SVG no começo de cada HTML, com a cor vinda dos tokens.

Os arquivos `assets/laroia-*.svg` e `investimento.png` são material de marca e não são usados pelas páginas.

A fonte desta versão fica no vault, em `produtos/laro.ia-arquitetura/lp-solucoes-ia/`, onde estão também o histórico das decisões e as pendências.

## Ver localmente

```
python3 -m http.server 8765
```

Depois abrir http://127.0.0.1:8765/.
