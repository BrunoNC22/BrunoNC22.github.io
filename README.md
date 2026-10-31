# brunonc22.github.io

Portfólio de Bruno Nascimento Campos, publicado em **https://brunonc22.github.io**.

Feito com React, TypeScript e Vite, sem biblioteca de UI. A animação do topo é um motor próprio em Canvas 2D que simula uma instalação hidráulica predial: uma releitura da biblioteca que desenvolvi no Polo de Inovação do IFFluminense para exibir instalações hídricas como grafos.

## Estrutura

```
src/
  canvas/       motor da simulação: topologia (network), leituras (simulation, readings),
                geometria e renderer, independentes do React e cobertos por testes
  components/   Nav, WaterNetwork (canvas + leituras acessíveis), diagram/ (diagramas SVG
                com roteamento ortogonal das setas) e ui/ (realce de código, moldura de navegador…)
  sections/     Hero, Trajetória, Estudos de caso, Projetos, Profissional, Formação
  data/         todo o conteúdo do site, separado dos componentes
  lib/          tokenizador de TypeScript para os trechos de código e tema claro/escuro
scripts/
  screenshots.ts  captura as telas dos projetos publicados (puppeteer-core + Edge/Chrome local)
public/legacy/    arquivos da versão antiga do site
```

## Comandos

```bash
npm install
npm run dev          # servidor de desenvolvimento
npm test             # testes (Vitest + Testing Library)
npm run build        # checagem de tipos + build de produção em dist/
npm run screenshots  # atualiza as capturas em src/assets/screenshots
```

## Deploy

O workflow `.github/workflows/deploy.yml` roda os testes e o build em todo push e pull request. Em push na `main`, ele publica `dist/` no GitHub Pages.
