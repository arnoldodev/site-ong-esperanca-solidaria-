// página de projetos, com filtro por categoria e modal de detalhes
import { html, $, $$ } from "../utils/dom.js";
import { projetos as listaProjetos, categorias, buscarProjeto } from "../dados/projetos.js";
import { cardProjeto, conteudoModalProjeto } from "../componentes/templates.js";
import { abrirModal, fecharModal } from "../componentes/modal.js";
import { mostrarToast } from "../componentes/toast.js";

export const projetos = {
    titulo: "Projetos",

    render() {
        return html`
            <section class="projetos projetos--pagina">
                <div class="projetos__conteudo">
                    <p class="etiqueta etiqueta--inline">Projetos</p>
                    <h2 class="projetos__titulo">Nossas Iniciativas</h2>
                    <p class="projetos__subtitulo">Conheça os projetos que você pode apoiar como voluntário.</p>

                    <div class="filtros" role="group" aria-label="Filtrar projetos por categoria">
                        <button type="button" class="filtro" data-filtro="todos" aria-pressed="true">Todos</button>
                        ${categorias.map((c) => html`
                            <button type="button" class="filtro filtro--${c.id}" data-filtro="${c.id}" aria-pressed="false">${c.rotulo}</button>
                        `)}
                    </div>
                    <p class="filtros__resultado" aria-live="polite">${listaProjetos.length} projetos</p>

                    <div class="projetos__grade">
                        ${listaProjetos.map(cardProjeto)}
                    </div>
                </div>
            </section>

            <section class="chamada">
                <div>
                    <h2 class="chamada__titulo">Quer fazer parte?</h2>
                    <p class="chamada__texto">Escolha um projeto e cadastre-se como voluntário.</p>
                </div>
                <a href="#/cadastro" class="btn btn--registrar">Seja Voluntário</a>
            </section>
        `;
    },

    montar(raiz, contexto) {
        const botoes = $$("[data-filtro]", raiz);
        const cards = $$(".card", raiz);
        const resultado = $(".filtros__resultado", raiz);

        botoes.forEach((botao) => {
            botao.addEventListener("click", () => {
                const filtro = botao.dataset.filtro;
                botoes.forEach((b) => b.setAttribute("aria-pressed", String(b === botao)));

                let visiveis = 0;
                cards.forEach((card) => {
                    const mostrar = filtro === "todos" || card.dataset.categoria === filtro;
                    card.hidden = !mostrar;
                    if (mostrar) visiveis++;
                });
                resultado.textContent = `${visiveis} ${visiveis === 1 ? "projeto" : "projetos"}`;
            });
        });

        this.atualizar(contexto);
    },

    // #/projetos/:id abre o modal; #/projetos fecha
    atualizar({ params }) {
        if (!params.id) {
            fecharModal();
            return;
        }

        const projeto = buscarProjeto(params.id);
        if (!projeto) {
            mostrarToast({ tipo: "aviso", titulo: "Projeto não encontrado", texto: "Mostrando todos os projetos." });
            history.replaceState(null, "", "#/projetos");
            return;
        }

        abrirModal(conteudoModalProjeto(projeto), {
            // fechou pelo X/Esc/fundo: tira o id da URL sem criar outra entrada no histórico
            aoFechar: () => {
                if (location.hash === `#/projetos/${projeto.id}`) history.replaceState(null, "", "#/projetos");
            },
        });
    },
};
