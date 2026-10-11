// barra de acessibilidade: tamanho do texto e alto contraste (salvos no localStorage)
import { $, $$ } from "../utils/dom.js";
import { preferencias } from "../servicos/armazenamento.js";
import { mostrarToast } from "./toast.js";

const FONTE_MAXIMA = 3; // 0 = 100%, 1 = 112,5%, 2 = 125%, 3 = 137,5% (ver CSS)

export function iniciarAcessibilidade() {
    const raiz = document.documentElement;
    const botaoContraste = $("[data-contraste]");
    let pref = preferencias.ler();

    function aplicar() {
        raiz.classList.toggle("alto-contraste", pref.contraste);
        if (pref.fonte > 0) raiz.dataset.fonte = pref.fonte;
        else delete raiz.dataset.fonte;

        botaoContraste.setAttribute("aria-pressed", String(pref.contraste));
        $('[data-fonte="diminuir"]').disabled = pref.fonte === 0;
        $('[data-fonte="aumentar"]').disabled = pref.fonte === FONTE_MAXIMA;
        preferencias.salvar(pref);
    }

    $$("[data-fonte]").forEach((botao) => {
        botao.addEventListener("click", () => {
            const acao = botao.dataset.fonte;
            if (acao === "aumentar") pref.fonte = Math.min(pref.fonte + 1, FONTE_MAXIMA);
            if (acao === "diminuir") pref.fonte = Math.max(pref.fonte - 1, 0);
            if (acao === "padrao") pref.fonte = 0;
            aplicar();
        });
    });

    botaoContraste.addEventListener("click", () => {
        pref.contraste = !pref.contraste;
        aplicar();
        mostrarToast({ tipo: "info", titulo: pref.contraste ? "Alto contraste ativado" : "Alto contraste desativado" });
    });

    // primeira visita: se o sistema pede mais contraste, já começa ligado
    if (!localStorage.getItem("ong:preferencias") && window.matchMedia("(prefers-contrast: more)").matches) {
        pref.contraste = true;
    }
    aplicar();
}
