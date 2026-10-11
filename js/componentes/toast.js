// notificações (toasts) no canto da tela, usando o visual que já existe no CSS
import { html, renderizar } from "../utils/dom.js";

let area = null;

function pegarArea() {
    if (!area) {
        area = document.createElement("div");
        area.className = "toast-area";
        document.body.append(area);
    }
    return area;
}

/*
 * mostrarToast({ tipo: "sucesso" | "erro" | "aviso" | "info", titulo, texto, duracao })
 * duracao em ms; 0 = só fecha no X
 */
export function mostrarToast({ tipo = "info", titulo, texto = "", duracao = 5000 }) {
    const toast = document.createElement("div");
    toast.className = `toast toast--${tipo}`;
    toast.setAttribute("role", tipo === "erro" ? "alert" : "status");

    renderizar(toast, html`
        <span class="toast__icone" aria-hidden="true"></span>
        <div class="toast__conteudo">
            <strong class="toast__titulo">${titulo}</strong>
            ${texto && html`<span class="toast__texto">${texto}</span>`}
        </div>
        <button type="button" class="toast__fechar" aria-label="Fechar notificação">&times;</button>
    `);

    let fechado = false;
    const fechar = () => {
        if (fechado) return;
        fechado = true;
        toast.classList.add("toast--saindo");
        // espera a animação de saída; o timeout é garantia caso a animação esteja desligada
        toast.addEventListener("animationend", () => toast.remove(), { once: true });
        setTimeout(() => toast.remove(), 400);
    };

    toast.querySelector(".toast__fechar").addEventListener("click", fechar);

    // máximo 3 na tela: o mais antigo sai
    const lista = pegarArea();
    if (lista.children.length >= 3) lista.firstElementChild.remove();
    lista.append(toast);

    if (duracao > 0) {
        let timer = setTimeout(fechar, duracao);
        // pausa enquanto o mouse está em cima, pra dar tempo de ler
        toast.addEventListener("mouseenter", () => clearTimeout(timer));
        toast.addEventListener("mouseleave", () => (timer = setTimeout(fechar, 2000)));
    }

    return fechar;
}
