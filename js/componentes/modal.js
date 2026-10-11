// modal único e reaproveitável, controlado por JavaScript
// (antes abria com :target; numa SPA o # da URL é usado pelas rotas, então o JS assume)
import { $, $$, html, renderizar } from "../utils/dom.js";

let modal, corpo, caixa;
let elementoAntes = null; // quem estava com foco antes de abrir, pra devolver depois
let aoFecharAtual = null;

const SELETOR_FOCAVEL = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

export function iniciarModal() {
    modal = $("#modal");
    corpo = $(".modal__corpo", modal);
    caixa = $(".modal__caixa", modal);

    // fundo escuro ou botão X fecham
    modal.addEventListener("click", (evento) => {
        if (evento.target.closest("[data-fechar-modal]")) fecharModal();
    });

    document.addEventListener("keydown", (evento) => {
        if (!estaAberto()) return;
        if (evento.key === "Escape") fecharModal();
        if (evento.key === "Tab") prenderFoco(evento);
    });
}

export const estaAberto = () => modal?.classList.contains("modal--aberto");

/*
 * abrirModal(template, { aoFechar })
 * o template precisa ter um elemento com id="modal-titulo" (o aria-labelledby aponta pra ele)
 */
export function abrirModal(template, { aoFechar } = {}) {
    if (!estaAberto()) elementoAntes = document.activeElement;
    aoFecharAtual = aoFechar ?? null;

    renderizar(corpo, template);
    modal.classList.add("modal--aberto");
    modal.removeAttribute("aria-hidden");
    document.body.classList.add("sem-rolagem");

    // foco vai pro primeiro botão/link dentro do modal (o X fica por último na ordem)
    const primeiro = $$(SELETOR_FOCAVEL, corpo)[0] ?? caixa;
    primeiro.focus({ preventScroll: true });
}

export function fecharModal() {
    if (!estaAberto()) return;
    modal.classList.remove("modal--aberto");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("sem-rolagem");

    const callback = aoFecharAtual;
    aoFecharAtual = null;
    callback?.();

    // devolve o foco pra onde estava (se o elemento ainda existir na página)
    if (elementoAntes?.isConnected) elementoAntes.focus({ preventScroll: true });
    elementoAntes = null;
}

// Tab não sai de dentro do modal enquanto ele está aberto
function prenderFoco(evento) {
    const focaveis = $$(SELETOR_FOCAVEL, caixa);
    if (!focaveis.length) return;
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
    }
}

// confirmação bonita no lugar do confirm() do navegador; devolve uma Promise<boolean>
export function confirmar({ titulo, texto, botaoConfirmar = "Confirmar", botaoCancelar = "Cancelar" }) {
    return new Promise((resolve) => {
        let resposta = false;

        abrirModal(html`
            <h3 id="modal-titulo" class="modal__titulo">${titulo}</h3>
            <p class="modal__texto">${texto}</p>
            <div class="modal__acoes">
                <button type="button" class="btn btn--perigo" data-resposta="sim">${botaoConfirmar}</button>
                <button type="button" class="btn btn--neutro" data-resposta="nao">${botaoCancelar}</button>
            </div>
        `, { aoFechar: () => resolve(resposta) });

        corpo.querySelectorAll("[data-resposta]").forEach((botao) => {
            botao.addEventListener("click", () => {
                resposta = botao.dataset.resposta === "sim";
                fecharModal();
            });
        });
    });
}
