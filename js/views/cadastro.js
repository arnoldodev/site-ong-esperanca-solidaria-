// página de cadastro de voluntário
import { html, $, renderizar } from "../utils/dom.js";
import { areasDeInteresse, nomeDaArea } from "../dados/projetos.js";
import { iniciarFormulario } from "../componentes/formulario.js";
import { alerta } from "../componentes/templates.js";

// um campo de texto com label flutuante (input antes do label por causa do CSS)
const campoTexto = ({ id, rotulo, tipo = "text", max, modo, autocomplete }) => html`
    <div class="form__campo">
        <input class="form__input" type="${tipo}" id="${id}" name="${id}" required data-validar
            placeholder=" " aria-describedby="${id}-erro"
            ${max ? html`maxlength="${max}"` : ""}
            ${modo ? html`inputmode="${modo}"` : ""}
            ${autocomplete ? html`autocomplete="${autocomplete}"` : ""}>
        <label class="form__rotulo" for="${id}">${rotulo}:*</label>
        <span class="form__erro" id="${id}-erro" aria-live="polite"></span>
    </div>
`;

const formulario = () => html`
    <form class="form" novalidate>
        ${alerta({ tipo: "info", texto: "Seus dados ficam salvos só neste navegador (localStorage) e servem apenas para contato sobre o voluntariado." })}

        <fieldset class="form__grupo">
            <legend class="form__legenda">Dados Pessoais</legend>
            ${campoTexto({ id: "nome", rotulo: "Nome Completo", autocomplete: "name" })}
            ${campoTexto({ id: "email", rotulo: "E-mail", tipo: "email", autocomplete: "email" })}
            ${campoTexto({ id: "cpf", rotulo: "CPF", max: 14, modo: "numeric" })}
            ${campoTexto({ id: "telefone", rotulo: "Telefone / WhatsApp", tipo: "tel", max: 15, modo: "tel", autocomplete: "tel" })}
            <div class="form__campo">
                <input class="form__input" type="text" id="cep" name="cep" required data-validar placeholder=" "
                    maxlength="9" inputmode="numeric" autocomplete="postal-code" aria-describedby="cep-erro cep-dica">
                <label class="form__rotulo" for="cep">CEP:*</label>
                <span class="form__erro" id="cep-erro" aria-live="polite"></span>
                <span class="form__dica" id="cep-dica" aria-live="polite"></span>
                <input type="hidden" name="cidade">
            </div>
        </fieldset>

        <fieldset class="form__grupo">
            <legend class="form__legenda">Interesse de Atuação</legend>

            <div class="form__campo form__campo--select">
                <select class="form__input" id="projeto" name="projeto" required data-validar aria-describedby="projeto-erro">
                    <option value="">Selecione um projeto</option>
                    ${areasDeInteresse.map((a) => html`<option value="${a.id}">${a.nome}</option>`)}
                </select>
                <label class="form__rotulo" for="projeto">Projeto de Interesse:*</label>
                <span class="form__erro" id="projeto-erro" aria-live="polite"></span>
            </div>

            <div class="form__campo form__campo--texto">
                <textarea class="form__input" id="mensagem" name="mensagem" rows="5" maxlength="500" data-validar
                    placeholder=" " aria-describedby="mensagem-contador mensagem-erro"></textarea>
                <label class="form__rotulo" for="mensagem">Por que gostaria de ser voluntário?</label>
                <span class="form__erro" id="mensagem-erro"></span>
                <span class="form__contador" id="mensagem-contador">0/500</span>
            </div>
        </fieldset>

        <div class="form__status" aria-live="polite">
            <p class="alerta alerta--erro form__status--erro">Corrija os campos destacados em vermelho.</p>
            <p class="alerta alerta--sucesso form__status--ok">Tudo certo! Clique em enviar.</p>
        </div>

        <div class="form__acoes">
            <button type="submit" class="btn btn--registrar">Enviar Cadastro</button>
            <button type="reset" class="btn btn--limpar">Limpar Campos</button>
        </div>
    </form>
`;

const telaSucesso = (voluntario) => html`
    <div class="cadastro__sucesso" tabindex="-1">
        ${alerta({
            tipo: "sucesso",
            titulo: "Cadastro enviado!",
            texto: `Obrigado, ${voluntario.nome.split(" ")[0]}! Você se inscreveu em "${nomeDaArea(voluntario.projeto)}". Vamos entrar em contato pelo WhatsApp em breve.`,
        })}
        <div class="form__acoes">
            <a href="#/voluntarios" class="btn btn--registrar">Ver voluntários</a>
            <button type="button" class="btn btn--limpar" data-acao="novo-cadastro">Novo cadastro</button>
        </div>
    </div>
`;

export const cadastro = {
    titulo: "Seja Voluntário",

    render() {
        return html`
            <div class="pagina-cadastro">
                <section class="cadastro">
                    <h2 class="cadastro__titulo">Junte-se a Nós: Seja um Colaborador</h2>
                    <p class="cadastro__intro">Preencha os campos abaixo para registrar seu interesse em fazer parte das nossas ações.</p>
                    <div class="cadastro__area">${formulario()}</div>
                </section>
            </div>
        `;
    },

    montar(raiz, { query }) {
        const area = $(".cadastro__area", raiz);

        const mostrarFormulario = (projetoInicial) => {
            renderizar(area, formulario());
            iniciarFormulario($("form", area), { projetoInicial, aoConcluir: mostrarSucesso });
        };

        const mostrarSucesso = (voluntario) => {
            renderizar(area, telaSucesso(voluntario));
            $(".cadastro__sucesso", area).focus();
            $('[data-acao="novo-cadastro"]', area).addEventListener("click", () => {
                mostrarFormulario();
                $("#nome", area).focus();
            });
        };

        iniciarFormulario($("form", area), { projetoInicial: query.projeto, aoConcluir: mostrarSucesso });
    },

    // mudou só o ?projeto= na URL (ex: clicou "Quero participar" de outro projeto)
    atualizar({ query }) {
        const select = document.getElementById("projeto");
        if (select && query.projeto) {
            select.value = query.projeto;
            select.dispatchEvent(new Event("input", { bubbles: true }));
        }
    },
};
