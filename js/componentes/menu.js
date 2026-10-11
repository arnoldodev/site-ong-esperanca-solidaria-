// cabeçalho: monta o submenu, marca a página atual e fecha o menu mobile
import { $, $$, html, renderizar } from "../utils/dom.js";
import { projetos } from "../dados/projetos.js";

export function iniciarMenu() {
    // submenu gerado a partir dos dados (antes era repetido em cada .html)
    renderizar($(".submenu"), projetos.map((p) => html`
        <li><a href="#/projetos/${p.id}" class="submenu__link">${p.nome}</a></li>
    `));

    // botão hambúrguer abre/fecha e avisa o estado pelo aria-expanded
    const botao = $(".cabecalho__hamburguer");
    botao.addEventListener("click", () => {
        const abrir = botao.getAttribute("aria-expanded") !== "true";
        definirMenuAberto(abrir);
        if (abrir) $(".menu__link").focus();
    });

    // Esc fecha o menu mobile e devolve o foco pro botão
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape" && menuAberto()) {
            fecharMenuMobile();
            botao.focus();
        }
    });

    // clicou fora do cabeçalho com o menu aberto -> fecha
    document.addEventListener("click", (evento) => {
        if (!evento.target.closest(".cabecalho")) fecharMenuMobile();
    });
}

const menuAberto = () => $(".cabecalho__hamburguer")?.getAttribute("aria-expanded") === "true";

function definirMenuAberto(aberto) {
    const botao = $(".cabecalho__hamburguer");
    if (!botao) return;
    botao.setAttribute("aria-expanded", String(aberto));
    botao.setAttribute("aria-label", aberto ? "Fechar menu de navegação" : "Abrir menu de navegação");
}

export function fecharMenuMobile() {
    definirMenuAberto(false);
}

// aria-current="page" no link da rota atual (o CSS já pinta esse estado)
export function marcarLinkAtivo(caminho) {
    $$(".menu__link[data-rota]").forEach((link) => {
        const rota = link.dataset.rota;
        const ativo = rota === "/" ? caminho === "/" : caminho === rota || caminho.startsWith(`${rota}/`);
        if (ativo) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
    });
}
