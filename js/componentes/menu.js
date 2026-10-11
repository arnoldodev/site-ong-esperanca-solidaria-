// cabeçalho: monta o submenu, marca a página atual e fecha o menu mobile
import { $, $$, html, renderizar } from "../utils/dom.js";
import { projetos } from "../dados/projetos.js";

export function iniciarMenu() {
    // submenu gerado a partir dos dados (antes era repetido em cada .html)
    renderizar($(".submenu"), projetos.map((p) => html`
        <li><a href="#/projetos/${p.id}" class="submenu__link">${p.nome}</a></li>
    `));

    // Esc fecha o menu mobile
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") fecharMenuMobile();
    });

    // clicou fora do cabeçalho com o menu aberto -> fecha
    document.addEventListener("click", (evento) => {
        if (!evento.target.closest(".cabecalho")) fecharMenuMobile();
    });
}

export function fecharMenuMobile() {
    const toggle = $("#menu-toggle");
    if (toggle) toggle.checked = false;
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
