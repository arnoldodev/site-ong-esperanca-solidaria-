# Changelog

Todas as mudanças importantes do projeto ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.0.1] - 2026-10-11

### Corrigido
- Seta do campo de projeto invisível no modo alto contraste (#5)

## [1.0.0] - 2026-10-11 · Experiência Prática IV

### Adicionado
- Barra de acessibilidade com aumento de texto (até 137,5%) e modo alto contraste, salvos no `localStorage`
- Anúncio da troca de página para leitores de tela (`aria-live`)
- Build de produção com esbuild (`npm run build`): JS em 1 arquivo minificado e CSS minificado
- Imagens em WebP com `srcset` e JPG de reserva; favicon e ícone para iOS
- Deploy automático no GitHub Pages com GitHub Actions
- Documentação: README completo, CONTRIBUTING, CHANGELOG, LICENSE e checklist WCAG em `docs/`
- `.gitignore` e `.gitattributes` (fim de linha LF)

### Alterado
- Menu mobile: checkbox substituído por `<button>` com `aria-expanded`
- Contraste do botão Registrar, das mensagens de erro e das legendas do formulário (mínimo 4,5:1)
- Anel de foco com contraste 3:1 em fundos claros e escuros
- Fonte Poppins carregada no `<head>` com `preconnect` em vez de `@import` no CSS
- Toasts pausam com o mouse ou com o foco do teclado

### Removido
- Pasta `Site ONG` commitada por engano como repositório aninhado
- `html/cadastro.html` e `html/projetos.html`, substituídas pelas views da SPA

## [0.3.0] - 2026-10-11 · Experiência Prática III

### Adicionado
- SPA com roteador por hash, rotas com parâmetro e página 404
- Sistema de templates com escape de HTML
- Validação do cadastro em tempo real, máscaras, verificação de CPF e consulta ao ViaCEP
- Persistência de voluntários e rascunho no `localStorage`; página de voluntários
- Modal e toasts controlados por JavaScript; filtro de projetos

## [0.2.0] - 2026-10-02 · Experiência Prática II

### Adicionado
- Design system com variáveis CSS, grid de 12 colunas e 5 breakpoints
- Menu hambúrguer, dropdown, modais com `:target` e feedback visual do formulário
- Páginas de projetos e cadastro; guia de componentes

## [0.1.0] - 2026-09-21 · Experiência Prática I

### Adicionado
- Estrutura inicial em HTML5 semântico
- Formulário de cadastro com validação nativa do navegador

[1.0.0]: https://github.com/arnoldodev/projeto-ong-esperanca-solidaria/releases/tag/v1.0.0
