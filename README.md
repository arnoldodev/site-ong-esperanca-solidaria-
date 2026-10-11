# ONG Esperança Solidária

Site da ONG Esperança Solidária: apresenta a organização e seus projetos e permite que pessoas se cadastrem como voluntárias. É uma **Single Page Application** feita com HTML, CSS e JavaScript puro, acessível (**WCAG 2.1 nível AA**) e publicada no **GitHub Pages**.

**Site no ar:** https://arnoldodev.github.io/projeto-ong-esperanca-solidaria/

> Projeto acadêmico da disciplina de Desenvolvimento Front-end, construído em quatro Experiências Práticas.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Como rodar](#como-rodar)
- [Como testar](#como-testar)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Arquitetura do JavaScript](#arquitetura-do-javascript)
- [Acessibilidade](#acessibilidade)
- [Performance e build](#performance-e-build)
- [Deploy](#deploy)
- [Fluxo de trabalho com Git](#fluxo-de-trabalho-com-git)
- [Histórico do projeto](#histórico-do-projeto)
- [Autor e licença](#autor-e-licença)

---

## Funcionalidades

- **Navegação SPA:** as páginas trocam sem recarregar (`#/`, `#/projetos`, `#/cadastro`, `#/voluntarios`), com botão voltar funcionando e página 404
- **Projetos:** filtro por categoria e modal de detalhes com link direto (`#/projetos/verde-urbano`)
- **Cadastro de voluntário:** validação em tempo real, máscaras (CPF, telefone, CEP), cálculo dos dígitos do CPF, busca de cidade pelo CEP (API ViaCEP), bloqueio de CPF/e-mail repetido e rascunho automático
- **Voluntários:** lista dos cadastros salvos no navegador, com busca, filtro e remoção
- **Acessibilidade:** barra com aumento de texto e modo alto contraste, navegação completa pelo teclado e suporte a leitor de tela

## Tecnologias

| Área | Tecnologia |
| --- | --- |
| Estrutura | HTML5 semântico |
| Estilo | CSS3 (variáveis, Grid, Flexbox, 5 breakpoints, BEM) |
| Comportamento | JavaScript ES2020 com módulos nativos (`import`/`export`), sem framework |
| Dados | `localStorage` + API pública [ViaCEP](https://viacep.com.br) |
| Build | [esbuild](https://esbuild.github.io) (bundle e minificação) |
| Deploy | GitHub Actions + GitHub Pages |
| Qualidade | axe-core (acessibilidade) e Lighthouse (performance) |

## Como rodar

**Pré-requisito:** [Node.js](https://nodejs.org) 18 ou superior (só para o build; para editar, basta o VS Code).

```bash
git clone https://github.com/arnoldodev/projeto-ong-esperanca-solidaria.git
cd projeto-ong-esperanca-solidaria
npm install
```

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Abre a versão de desenvolvimento (arquivos originais) em um servidor local |
| `npm run build` | Gera a versão de produção minificada na pasta `dist/` |
| `npm run preview` | Abre a versão de produção (`dist/`) para conferir antes de publicar |

Sem Node.js: abra `html/index.html` com a extensão **Live Server** do VS Code.

> Abrir o arquivo com dois cliques (`file://`) não funciona: o navegador bloqueia módulos JavaScript fora de um servidor.

## Como testar

O projeto não tem testes automatizados por script. A validação é feita no navegador, com as ferramentas abaixo.

| Teste | Como fazer | Resultado esperado |
| --- | --- | --- |
| Funcional | Navegar por todas as rotas, enviar o cadastro vazio, com CPF inválido (`529.982.247-26`) e válido (`529.982.247-25`), recarregar no meio do cadastro e remover um voluntário | Mensagens de erro em cada campo, rascunho recuperado e cadastro salvo em `#/voluntarios` |
| Acessibilidade | Extensão **axe DevTools** (Chrome) → Scan em cada página | 0 violações |
| Lighthouse | DevTools (F12) → aba **Lighthouse** → Analyze, rodando sobre `npm run preview` | Acessibilidade 100, Desempenho acima de 90 |
| Teclado | Percorrer o site só com Tab, Shift+Tab, Enter e Esc | Todo elemento alcançável e com foco visível |
| Responsividade | DevTools → modo dispositivo em 320 px, 768 px e 1280 px | Sem rolagem horizontal |
| Dados | DevTools → Application → Local Storage | Chaves `ong:voluntarios`, `ong:rascunho-cadastro` e `ong:preferencias` |
| Rede | DevTools → Network → bloquear `viacep.com.br` e digitar um CEP | Aviso amigável, cadastro continua funcionando |

## Estrutura de pastas

```text
├── .github/workflows/deploy.yml   # build + publicação automática no GitHub Pages
├── assets/                        # imagens (JPG original + WebP otimizado) e ícones
├── css/style.css                  # todos os estilos, organizados em seções numeradas
├── docs/ACESSIBILIDADE.md         # checklist WCAG 2.1 AA do projeto
├── html/
│   ├── index.html                 # "esqueleto" da SPA: cabeçalho, <main>, modal e rodapé
│   └── componentes.html           # guia visual dos componentes
├── js/
│   ├── main.js                    # ponto de entrada: registra rotas e inicia os componentes
│   ├── roteador.js                # troca as telas pelo # da URL
│   ├── utils/dom.js               # sistema de templates html`...` e helpers
│   ├── dados/projetos.js          # dados dos projetos
│   ├── servicos/                  # localStorage e API de CEP
│   ├── componentes/               # menu, modal, toast, formulário, validação, acessibilidade
│   └── views/                     # uma tela por arquivo
├── scripts/build.mjs              # build de produção
├── CHANGELOG.md · CONTRIBUTING.md · LICENSE
└── package.json
```

## Arquitetura do JavaScript

```text
main.js ──> roteador.js ──> views/*.js ──> componentes/*.js ──> servicos/*.js
                                   │                                  │
                                   └──────> dados/projetos.js         └──> localStorage / ViaCEP
```

- **Roteador:** escuta `hashchange`, encontra a view da rota e desenha no `<main>`. Rotas aceitam parâmetros (`/projetos/:id`) e query string (`?projeto=`).
- **Views:** cada tela exporta `{ titulo, render(), montar(), atualizar() }`. `render` devolve o HTML; `montar` liga os eventos.
- **Templates:** a tag `` html`...` `` escapa tudo que vem nas `${}`, evitando injeção de HTML com dados digitados pelo usuário.
- **Serviços:** só `servicos/armazenamento.js` acessa o `localStorage` e só `servicos/cep.js` acessa a rede. Trocar por um back-end real mexe só nesses arquivos.

Chaves usadas no `localStorage`: `ong:voluntarios`, `ong:rascunho-cadastro` e `ong:preferencias`.

## Acessibilidade

Meta: **WCAG 2.1 nível AA**. Resultado da auditoria com axe-core em todas as rotas e estados (modal aberto, formulário com erro, menu mobile, alto contraste): **0 violações**. Lighthouse Acessibilidade: **100**.

Principais recursos:

- Navegação 100% pelo teclado, com link "Pular para o conteúdo" e foco visível em todo elemento
- Contraste mínimo de 4,5:1 em textos e 3:1 em bordas e ícones
- Modo **alto contraste** e **aumento de texto** até 137,5%, salvos entre visitas
- Menu mobile com `aria-expanded`, modal com foco preso e resto da página `inert`
- Erros do formulário ligados aos campos por `aria-describedby` e `aria-invalid`
- Troca de página anunciada para leitores de tela (`aria-live`)
- Respeita `prefers-reduced-motion` e `prefers-contrast`

Detalhes de cada critério em [docs/ACESSIBILIDADE.md](docs/ACESSIBILIDADE.md).

## Performance e build

O `npm run build` gera a pasta `dist/` pronta para produção:

| Item | Desenvolvimento | Produção |
| --- | --- | --- |
| JavaScript | 18 arquivos, 59,5 KB | 1 arquivo, 32,4 KB (11 KB com gzip) |
| CSS | 46,2 KB | 32,8 KB (7 KB com gzip) |
| Requisições na página inicial | 25 | 8 |
| Lighthouse Desempenho (mobile, medido localmente) | 94 | 98 |

Outras otimizações:

- Imagens em **WebP** com dois tamanhos (`srcset`) e JPG de reserva, `width`/`height` definidos (CLS = 0) e `loading="lazy"` fora da primeira tela
- Fonte carregada com `preconnect` e `display=swap`
- Arquivos com `?v=hash` no HTML, para o navegador baixar de novo só quando mudam
- Favicon de 3 KB no lugar do logo de 75 KB

## Deploy

O site é publicado automaticamente pelo workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

1. Um push na branch `main` dispara o GitHub Actions
2. O workflow roda `npm ci` e `npm run build`
3. A pasta `dist/` é publicada no GitHub Pages

**Configuração (uma vez só):** no repositório, abra **Settings → Pages** e, em **Source**, escolha **GitHub Actions**. O andamento de cada publicação aparece na aba **Actions**.

## Fluxo de trabalho com Git

O projeto segue o **GitFlow**:

- `main`: versões estáveis, publicadas automaticamente no GitHub Pages
- `develop`: integração das novas funcionalidades antes de virarem versão
- `feature/`, `docs/`, `ci/`, `chore/`: uma branch por mudança, integrada por merge `--no-ff`
- `hotfix/`: correção urgente que sai da `main`, entra por **pull request** e volta também para a `develop` (exemplo: PR #6, que fechou a issue #5 e gerou a v1.0.1)
- Tarefas acompanhadas por **issues** agrupadas em **milestones**
- Mensagens no padrão **Conventional Commits** (`feat:`, `fix:`, `perf:`, `docs:`, `ci:`, `chore:`)
- Versões marcadas com tags seguindo **Versionamento Semântico** (`v0.1.0` a `v1.0.1`)

Regras completas em [CONTRIBUTING.md](CONTRIBUTING.md).

## Histórico do projeto

| Versão | Experiência Prática | Entrega |
| --- | --- | --- |
| 0.1.0 | I | HTML5 semântico e formulário com validação nativa |
| 0.2.0 | II | CSS3: design system, grid de 12 colunas e responsividade |
| 0.3.0 | III | JavaScript: SPA, templates, validação e localStorage |
| 1.0.0 | IV | Git profissional, WCAG 2.1 AA, build de produção e deploy |
| 1.0.1 | IV | Correção: seta do select visível no modo alto contraste |

Mudanças detalhadas em [CHANGELOG.md](CHANGELOG.md).

## Autor e licença

Desenvolvido por **Yuri Arnoldo Vieira** ([@arnoldodev](https://github.com/arnoldodev)).

Código sob a licença [MIT](LICENSE). As fotos são usadas apenas para fins acadêmicos.
