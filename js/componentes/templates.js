// pedaços de HTML reaproveitados em várias páginas
import { html } from "../utils/dom.js";
import { voluntarios } from "../servicos/armazenamento.js";

export const badge = (projeto) => html`
    <span class="badge badge--${projeto.categoria}">${projeto.rotuloCategoria}</span>
`;

export const cardProjeto = (projeto) => html`
    <article class="card" data-categoria="${projeto.categoria}">
        ${badge(projeto)}
        <h3 class="card__titulo">${projeto.nome}</h3>
        <p class="card__texto">${projeto.resumo}</p>
        <a href="#/projetos/${projeto.id}" class="card__link">Saiba mais<span class="visualmente-oculto"> sobre ${projeto.nome}</span></a>
    </article>
`;

export function conteudoModalProjeto(projeto) {
    const inscritos = voluntarios.contar(projeto.id);
    return html`
        ${badge(projeto)}
        <h3 id="modal-titulo" class="modal__titulo">${projeto.nome}</h3>
        <p class="modal__texto">${projeto.descricao}</p>
        ${inscritos > 0 && html`
            <p class="modal__info">${inscritos} ${inscritos === 1 ? "pessoa já se inscreveu" : "pessoas já se inscreveram"} por este site.</p>
        `}
        <a href="#/cadastro?projeto=${projeto.id}" class="btn btn--primario">Quero participar</a>
    `;
}

export const alerta = ({ tipo = "info", titulo, texto }) => html`
    <p class="alerta alerta--${tipo}">
        <span>${titulo && html`<strong class="alerta__titulo">${titulo}</strong>`}${texto}</span>
    </p>
`;
