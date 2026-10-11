// roteador da SPA: lê o # da URL e troca o conteúdo do <main> sem recarregar a página
// ex: index.html#/projetos  |  #/projetos/verde-urbano  |  #/cadastro?projeto=verde-urbano

import { renderizar } from "./utils/dom.js";

const rotas = [];
let alvo = null;
let viewAtual = null;
let limparViewAtual = null;
let paginaNaoEncontrada = null;
let aoMudarRota = null;
let primeiraCarga = true;

// rota("/projetos/:id", view)  ->  params.id fica disponível na view
export function rota(padrao, view) {
    const regex = new RegExp(`^${padrao.replace(/:(\w+)/g, "(?<$1>[^/]+)")}/?$`);
    rotas.push({ regex, view });
}

function lerUrl() {
    const hash = decodeURIComponent(location.hash.slice(1)) || "/";
    const [caminho, busca = ""] = hash.split("?");
    return { caminho, query: Object.fromEntries(new URLSearchParams(busca)) };
}

function encontrarRota(caminho) {
    for (const { regex, view } of rotas) {
        const achou = caminho.match(regex);
        if (achou) return { view, params: { ...achou.groups } };
    }
    return { view: paginaNaoEncontrada, params: {} };
}

function trocarPagina() {
    const { caminho, query } = lerUrl();

    // hash antigo tipo "#sobre" (sem barra): manda pra home
    if (!caminho.startsWith("/")) {
        history.replaceState(null, "", "#/");
        return trocarPagina();
    }

    const { view, params } = encontrarRota(caminho);
    const contexto = { caminho, params, query };

    aoMudarRota?.(contexto);

    // mesma página, só mudou o parâmetro (ex: abriu o modal de um projeto) -> não redesenha tudo
    if (view === viewAtual && view.atualizar) {
        view.atualizar(contexto);
        return;
    }

    limparViewAtual?.();
    viewAtual = view;

    renderizar(alvo, view.render(contexto));
    document.title = `${view.titulo} - ONG Esperança Solidária`;

    // animação de entrada
    alvo.classList.remove("app--entrando");
    void alvo.offsetWidth; // força o navegador a "esquecer" a animação anterior
    alvo.classList.add("app--entrando");

    if (!primeiraCarga) {
        window.scrollTo({ top: 0 });
        // foco vai pro conteúdo novo (leitor de tela anuncia a página)
        alvo.focus({ preventScroll: true });
    }
    primeiraCarga = false;

    // eventos da página entram depois do foco (se a view abrir um modal, o foco fica nele)
    limparViewAtual = view.montar?.(alvo, contexto) ?? null;
}

export function navegar(caminho) {
    location.hash = caminho;
}

export function iniciarRoteador({ elemento, naoEncontrada, aoMudar }) {
    alvo = elemento;
    paginaNaoEncontrada = naoEncontrada;
    aoMudarRota = aoMudar;

    window.addEventListener("hashchange", trocarPagina);

    // links de âncora comuns (ex: "Pular para o conteúdo") não podem virar rota
    document.addEventListener("click", (evento) => {
        const link = evento.target.closest('a[href^="#"]');
        if (!link) return;
        const href = link.getAttribute("href");
        if (href.startsWith("#/")) return; // é rota, o hashchange cuida

        evento.preventDefault();
        const destino = document.getElementById(href.slice(1));
        if (destino) {
            destino.scrollIntoView({ behavior: "smooth", block: "start" });
            if (!destino.hasAttribute("tabindex")) destino.setAttribute("tabindex", "-1");
            destino.focus({ preventScroll: true });
        }
    });

    trocarPagina();
}
