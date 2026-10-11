// lista de voluntários salvos no localStorage, com busca, filtro e remoção
import { html, $, renderizar } from "../utils/dom.js";
import { areasDeInteresse, nomeDaArea, buscarProjeto } from "../dados/projetos.js";
import { voluntarios as banco } from "../servicos/armazenamento.js";
import { mascaras, cpfParcial } from "../componentes/validacao.js";
import { confirmar } from "../componentes/modal.js";
import { mostrarToast } from "../componentes/toast.js";

const dataBR = (iso) => new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

// tira acentos e deixa minúsculo, pra busca achar "joao" em "João"
const normalizar = (texto) => texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function etiquetaProjeto(id) {
    const projeto = buscarProjeto(id);
    return projeto
        ? html`<span class="badge badge--${projeto.categoria}">${projeto.nome}</span>`
        : html`<span class="badge badge--neutro">${nomeDaArea(id)}</span>`;
}

const itemVoluntario = (v) => html`
    <li class="voluntario">
        <div class="voluntario__topo">
            <h3 class="voluntario__nome">${v.nome}</h3>
            ${etiquetaProjeto(v.projeto)}
        </div>
        <dl class="voluntario__dados">
            <div><dt>E-mail</dt><dd>${v.email}</dd></div>
            <div><dt>Telefone</dt><dd>${mascaras.telefone(v.telefone)}</dd></div>
            <div><dt>CPF</dt><dd>${cpfParcial(v.cpf)}</dd></div>
            <div><dt>Cidade</dt><dd>${v.cidade || mascaras.cep(v.cep)}</dd></div>
        </dl>
        ${v.mensagem && html`<p class="voluntario__mensagem">“${v.mensagem}”</p>`}
        <div class="voluntario__rodape">
            <span>Cadastrado em ${dataBR(v.criadoEm)}</span>
            <button type="button" class="voluntario__remover" data-remover="${v.id}" aria-label="Remover ${v.nome}">Remover</button>
        </div>
    </li>
`;

const listaVazia = (temCadastros) => html`
    <div class="vazio">
        ${temCadastros
            ? html`<p>Nenhum voluntário encontrado com esse filtro.</p>`
            : html`
                <p>Ainda não há voluntários cadastrados neste navegador.</p>
                <a href="#/cadastro" class="btn btn--primario">Fazer o primeiro cadastro</a>
            `}
    </div>
`;

export const voluntarios = {
    titulo: "Voluntários",

    render() {
        return html`
            <section class="painel">
                <p class="etiqueta etiqueta--inline">Equipe</p>
                <h2 class="painel__titulo">Voluntários cadastrados</h2>
                <p class="painel__subtitulo">Cadastros feitos neste navegador, guardados no localStorage.</p>

                <div class="painel__filtros">
                    <label class="painel__campo">
                        <span>Buscar por nome</span>
                        <input type="search" id="busca" placeholder="Ex: Maria" autocomplete="off">
                    </label>
                    <label class="painel__campo">
                        <span>Projeto</span>
                        <select id="filtro-projeto">
                            <option value="">Todos os projetos</option>
                            ${areasDeInteresse.map((a) => html`<option value="${a.id}">${a.nome}</option>`)}
                        </select>
                    </label>
                </div>

                <p class="painel__total" aria-live="polite"></p>
                <ul class="painel__lista"></ul>
            </section>
        `;
    },

    montar(raiz) {
        const busca = $("#busca", raiz);
        const filtro = $("#filtro-projeto", raiz);
        const lista = $(".painel__lista", raiz);
        const total = $(".painel__total", raiz);

        // redesenha só a lista (o resto da página fica igual)
        const atualizarLista = () => {
            const todos = banco.listar();
            const termo = normalizar(busca.value.trim());
            const filtrados = todos
                .filter((v) => !filtro.value || v.projeto === filtro.value)
                .filter((v) => normalizar(v.nome).includes(termo))
                .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)); // mais recentes primeiro

            total.textContent = todos.length
                ? `Mostrando ${filtrados.length} de ${todos.length} ${todos.length === 1 ? "voluntário" : "voluntários"}`
                : "";
            renderizar(lista, filtrados.length ? filtrados.map(itemVoluntario) : listaVazia(todos.length > 0));
        };

        busca.addEventListener("input", atualizarLista);
        filtro.addEventListener("change", atualizarLista);

        // delegação: um listener na lista serve pra todos os botões "Remover"
        lista.addEventListener("click", async (evento) => {
            const botao = evento.target.closest("[data-remover]");
            if (!botao) return;

            const voluntario = banco.listar().find((v) => v.id === botao.dataset.remover);
            if (!voluntario) return;

            const ok = await confirmar({
                titulo: "Remover voluntário?",
                texto: `O cadastro de ${voluntario.nome} será apagado deste navegador.`,
                botaoConfirmar: "Remover",
            });
            if (!ok) return;

            banco.remover(voluntario.id);
            atualizarLista();
            mostrarToast({ tipo: "info", titulo: "Cadastro removido", texto: voluntario.nome });
        });

        // se outra aba mexer no localStorage, atualiza aqui também
        window.addEventListener("storage", atualizarLista);

        atualizarLista();
        return () => window.removeEventListener("storage", atualizarLista);
    },
};
