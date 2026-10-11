# Projeto Acadêmico - Website ONG Esperança Solidária

Este repositório contém o projeto desenvolvido para fins de estudo universitário, focado em **HTML5 semântico**, **CSS3**, **JavaScript**, acessibilidade e validação de formulários.

---

## Contexto Acadêmico
* **Objetivo:** Projeto prático de Desenvolvimento Front-end para a faculdade.
* **Experiência Prática I:** HTML5 semântico e formulários nativos.
* **Experiência Prática II:** CSS3 (variáveis, Flexbox, Grid e responsividade) e acessibilidade (WCAG).
* **Experiência Prática III:** JavaScript — o site virou uma **SPA** (Single Page Application) com rotas, templates, validação e localStorage.

---

## Estrutura do Projeto

```text
Site ONG/
├── assets/                  # Imagens
├── css/style.css            # Estilos (seção 11.1 = estados controlados pelo JS)
├── html/
│   ├── index.html           # Única página: cabeçalho, <main> vazio, modal e rodapé
│   └── componentes.html     # Guia visual dos componentes
└── js/
    ├── main.js              # Ponto de entrada: registra as rotas e liga tudo
    ├── roteador.js          # Lê o # da URL e troca o conteúdo do <main>
    ├── utils/dom.js         # Template tag html`...`, $, $$, debounce
    ├── dados/projetos.js    # Dados dos projetos (cards, modais, submenu e select saem daqui)
    ├── servicos/
    │   ├── armazenamento.js # Tudo que mexe com localStorage
    │   └── cep.js           # Consulta de CEP na API ViaCEP
    ├── componentes/
    │   ├── templates.js     # Pedaços de HTML reaproveitáveis (card, badge, alerta...)
    │   ├── menu.js          # Submenu, link ativo e menu mobile
    │   ├── modal.js         # Modal reutilizável + confirmação
    │   ├── toast.js         # Notificações
    │   ├── validacao.js     # Regras de validação e máscaras (CPF, telefone, CEP)
    │   └── formulario.js    # Comportamento do formulário de cadastro
    └── views/               # Uma "página" por arquivo
        ├── inicio.js
        ├── projetos.js
        ├── cadastro.js
        ├── voluntarios.js
        └── naoEncontrada.js
```

---

## Como abrir

O JavaScript usa **módulos** (`import` / `export`), e o navegador bloqueia módulos abertos direto do arquivo (`file://`).
Por isso, abra com a extensão **Live Server** do VS Code: clique com o botão direito em `html/index.html` → *Open with Live Server*.

---

## Rotas da SPA

| Endereço | Página |
| --- | --- |
| `#/` | Início |
| `#/projetos` | Projetos, com filtro por categoria |
| `#/projetos/verde-urbano` | Projetos com o modal do projeto aberto |
| `#/cadastro` | Formulário de cadastro |
| `#/cadastro?projeto=verde-urbano` | Formulário já com o projeto escolhido |
| `#/voluntarios` | Lista de voluntários salvos no localStorage |
| qualquer outro | Página 404 |

---

## O que foi feito no JavaScript

**SPA e navegação**
* Roteador próprio com `hashchange`: troca só o `<main>`, sem recarregar a página
* Rotas com parâmetro (`/projetos/:id`) e query string (`?projeto=`)
* Link ativo marcado no menu, título da aba atualizado, menu mobile fecha ao navegar
* Botão voltar/avançar do navegador funciona
* Foco vai para o conteúdo novo (acessibilidade)

**Templates**
* Template tag `` html`...` `` que escapa o que vem nas `${}` (evita injeção de HTML)
* Cards, modais, submenu e opções do select gerados a partir de `dados/projetos.js`

**Manipulação do DOM e eventos**
* Modal controlado por JS: Esc fecha, foco preso dentro, foco volta ao fechar
* Toasts que somem sozinhos (pausam com o mouse em cima)
* Filtro de projetos por categoria e busca de voluntários por nome
* Contadores animados na seção de impacto (`IntersectionObserver`)
* Delegação de eventos (um listener no form / na lista serve para todos os itens)

**Validação do formulário**
* Mensagem de erro específica por campo, aparece depois que a pessoa sai do campo
* CPF com cálculo dos dígitos verificadores
* Máscaras de CPF, telefone e CEP enquanto digita
* Consulta do CEP na API ViaCEP (mostra bairro e cidade)
* CPF e e-mail não podem se repetir
* Contador de caracteres na mensagem
* Botão em estado "Enviando..." durante o envio simulado

**localStorage**
* Voluntários cadastrados ficam salvos e aparecem em `#/voluntarios` (com remoção)
* Rascunho automático: se sair da página no meio do cadastro, os dados voltam
* O número de "Voluntários Ativos" na home soma os cadastros feitos

---

## Como testar

1. Navegue pelo menu e use os botões voltar/avançar do navegador
2. Em Projetos, use os filtros e abra um projeto → "Quero participar"
3. Tente enviar o cadastro vazio, depois com CPF errado (ex: `529.982.247-26`) e certo (ex: `529.982.247-25`)
4. Preencha metade do formulário e recarregue a página (rascunho volta)
5. Envie e veja o cadastro em Voluntários; tente cadastrar o mesmo e-mail de novo
6. DevTools → Application → Local Storage para ver os dados salvos
