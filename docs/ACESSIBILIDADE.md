# Acessibilidade · WCAG 2.1 nível AA

Checklist dos critérios da WCAG 2.1 (níveis A e AA) e de como o site atende a cada um.

**Como foi verificado**
- **axe-core** em todas as rotas e estados (modal aberto, formulário com erro e com sucesso, menu mobile, modo alto contraste): 0 violações
- **Lighthouse** (Acessibilidade): 100
- Testes de teclado, zoom de 200% e tela de 320 px de largura (sem rolagem horizontal)

## 1. Perceptível

| Critério | Como o site atende |
| --- | --- |
| 1.1.1 Conteúdo não textual | Fotos com `alt` descritivo; ícones decorativos com `aria-hidden="true"` |
| 1.3.1 Informações e relações | `header`, `nav`, `main`, `footer`, títulos em ordem (h1 → h2 → h3), `fieldset`/`legend` no formulário, listas reais |
| 1.3.2 Sequência com significado | Ordem do HTML igual à ordem visual |
| 1.3.4 Orientação | Funciona em retrato e paisagem |
| 1.3.5 Identificar o propósito | `autocomplete` em nome, e-mail, telefone e CEP |
| 1.4.1 Uso de cor | Erros têm ícone e mensagem em texto, não só a borda vermelha; filtro ativo usa `aria-pressed` e preenchimento |
| 1.4.3 Contraste (mínimo) | Textos com 4,5:1 ou mais (ex.: botão Registrar 6,5:1, erros 4,9:1, legendas 5,3:1) |
| 1.4.4 Redimensionar texto | Zoom de 200% sem perder conteúdo; barra de acessibilidade aumenta o texto até 137,5% |
| 1.4.10 Refluxo | Sem rolagem horizontal em 320 px de largura |
| 1.4.11 Contraste não textual | Anel de foco, bordas de campos e botões e ícones de estado com 3:1 ou mais |
| 1.4.12 Espaçamento de texto | Layout flexível, sem alturas fixas em blocos de texto |
| 1.4.13 Conteúdo em hover/foco | Submenu abre no hover e no foco e não cobre o item que o abriu |

## 2. Operável

| Critério | Como o site atende |
| --- | --- |
| 2.1.1 Teclado | Tudo funciona com Tab, Shift+Tab, Enter, Espaço e Esc |
| 2.1.2 Sem armadilha de teclado | O modal prende o foco enquanto está aberto, mas fecha com Esc e devolve o foco |
| 2.2.1 Tempo ajustável | Notificações pausam com mouse ou foco; erros também ficam escritos no formulário |
| 2.3.1 Três flashes | Nenhum conteúdo pisca |
| 2.4.1 Ignorar blocos | Link "Pular para o conteúdo" é o primeiro item do Tab |
| 2.4.2 Título da página | `<title>` muda a cada rota (ex.: "Projetos - ONG Esperança Solidária") |
| 2.4.3 Ordem do foco | Ao trocar de página o foco vai para o `<main>`; no modal, para o primeiro botão |
| 2.4.4 Finalidade do link | "Saiba mais" inclui o nome do projeto para leitores de tela |
| 2.4.5 Várias formas | Menu, submenu de projetos, links nos cards e endereços diretos (`#/projetos/verde-urbano`) |
| 2.4.6 Cabeçalhos e rótulos | Cada tela tem um h2 descritivo; todo campo tem `<label>` |
| 2.4.7 Foco visível | Anel de 3 px em todos os elementos focáveis, azul no fundo claro e claro no fundo escuro |
| 2.5.3 Rótulo no nome | Botões "A-" e "A+" têm o texto visível no nome acessível |

## 3. Compreensível

| Critério | Como o site atende |
| --- | --- |
| 3.1.1 Idioma da página | `<html lang="pt-BR">` |
| 3.2.1 / 3.2.2 Em foco / Em entrada | Nada muda de contexto ao focar ou digitar; a página só muda por clique |
| 3.2.3 Navegação consistente | Mesmo cabeçalho e rodapé em todas as telas |
| 3.3.1 Identificação do erro | Mensagem específica abaixo do campo, `aria-invalid="true"` e alerta geral |
| 3.3.2 Rótulos ou instruções | Campos obrigatórios com * e aviso no topo; exemplos de formato nas mensagens |
| 3.3.3 Sugestão de erro | Mensagens dizem como corrigir (ex.: "Digite DDD + número, ex: (47) 99101-8870") |
| 3.3.4 Prevenção de erros | Validação antes de enviar, bloqueio de duplicados e confirmação antes de remover voluntário |

## 4. Robusto

| Critério | Como o site atende |
| --- | --- |
| 4.1.1 Análise | Estrutura HTML bem formada e ids únicos (conferidos pelo axe) |
| 4.1.2 Nome, função, valor | Menu com `aria-expanded`/`aria-controls`, filtros e alto contraste com `aria-pressed`, modal com `role="dialog"` e `aria-modal` |
| 4.1.3 Mensagens de status | Troca de página, status do formulário e notificações em regiões `aria-live` / `role="status"` / `role="alert"` |

## Recursos extras

- **Modo alto contraste:** fundo preto, texto branco e links/foco em amarelo. Liga sozinho na primeira visita se o sistema pedir mais contraste (`prefers-contrast: more`)
- **Movimento reduzido:** com `prefers-reduced-motion`, animações e rolagem suave são desligadas
- **Preferências salvas:** fonte e contraste ficam no `localStorage` e são aplicados antes de desenhar a página

## Como testar

1. **Teclado:** desconecte o mouse e percorra o site com Tab, Enter e Esc
2. **Lighthouse:** DevTools (F12) → aba Lighthouse → marque Accessibility → Analyze
3. **axe DevTools:** extensão gratuita do Chrome → aba axe DevTools → Scan
4. **Zoom:** Ctrl + + até 200% e confira se nada some
5. **Leitor de tela:** NVDA (Windows, gratuito) ou VoiceOver (Mac/iPhone)
