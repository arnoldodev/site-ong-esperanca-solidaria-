// helpers de DOM + o mini sistema de templates do site

// guarda um pedaço de HTML que já é seguro (não precisa escapar de novo)
class HtmlSeguro {
    constructor(texto) {
        this.texto = texto;
    }

    toString() {
        return this.texto;
    }
}

// troca < > & " ' por entidades, assim o que o usuário digita nunca vira HTML
export function escapar(valor) {
    const trocas = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
    return String(valor ?? "").replace(/[&<>"']/g, (c) => trocas[c]);
}

function converter(valor) {
    if (valor instanceof HtmlSeguro) return valor.texto;           // template dentro de template
    if (Array.isArray(valor)) return valor.map(converter).join(""); // listas (map)
    if (valor === false || valor === null || valor === undefined) return ""; // ${condicao && html`...`}
    return escapar(valor);                                          // texto comum
}

/*
 * template tag: html`<p>${nome}</p>`
 * - escapa tudo que vem nas ${...}
 * - aceita arrays (ex: lista.map(item => html`<li>${item}</li>`))
 * - aceita outros templates aninhados
 */
export function html(partes, ...valores) {
    let resultado = "";
    partes.forEach((parte, i) => {
        resultado += parte;
        if (i < valores.length) resultado += converter(valores[i]);
    });
    return new HtmlSeguro(resultado);
}

// joga o template (ou uma lista de templates) dentro de um elemento
export function renderizar(alvo, template) {
    alvo.innerHTML = converter(template);
}

export const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
export const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];

// espera X ms (usado pra simular o envio pro servidor)
export const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// evita rodar uma função a cada tecla (ex: salvar rascunho)
export function debounce(funcao, ms = 400) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => funcao(...args), ms);
    };
}

export const prefereMenosMovimento = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
