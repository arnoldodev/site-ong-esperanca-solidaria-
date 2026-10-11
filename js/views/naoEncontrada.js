// rota que não existe
import { html } from "../utils/dom.js";

export const naoEncontrada = {
    titulo: "Página não encontrada",

    render({ caminho }) {
        return html`
            <section class="painel painel--centro">
                <p class="etiqueta etiqueta--inline">Erro 404</p>
                <h2 class="painel__titulo">Página não encontrada</h2>
                <p class="painel__subtitulo">O endereço <code>#${caminho}</code> não existe neste site.</p>
                <a href="#/" class="btn btn--primario">Voltar para o início</a>
            </section>
        `;
    },
};
