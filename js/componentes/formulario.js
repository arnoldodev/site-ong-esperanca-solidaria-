// comportamento do formulário de cadastro: máscaras, validação ao vivo,
// rascunho automático, consulta de CEP e envio (salvando no localStorage)
import { $, $$, debounce, esperar } from "../utils/dom.js";
import { regras, mascaras, soDigitos } from "./validacao.js";
import { voluntarios, rascunho } from "../servicos/armazenamento.js";
import { buscarCep } from "../servicos/cep.js";
import { mostrarToast } from "./toast.js";

const LIMITE_MENSAGEM = 500;

/*
 * iniciarFormulario(form, { projetoInicial, aoConcluir })
 * aoConcluir(voluntario) roda depois que o cadastro é salvo
 */
export function iniciarFormulario(form, { projetoInicial, aoConcluir } = {}) {
    const campos = $$("[data-validar]", form);
    const botaoEnviar = $('button[type="submit"]', form);
    const contador = $("#mensagem-contador", form);
    const dicaCep = $("#cep-dica", form);

    // ---------- estado visual de cada campo ----------

    function validarCampo(campo) {
        const erroExtra = campo.dataset.erroExtra || ""; // ex: "CEP não encontrado", "CPF já cadastrado"
        const mensagem = regras[campo.name](campo.value) || erroExtra;
        const caixa = campo.closest(".form__campo");
        const spanErro = $(".form__erro", caixa);
        const temValor = campo.value.trim() !== "";

        campo.classList.toggle("campo--invalido", Boolean(mensagem));
        campo.classList.toggle("campo--valido", !mensagem && (campo.required || temValor));
        campo.setAttribute("aria-invalid", mensagem ? "true" : "false");
        if (spanErro) spanErro.textContent = mensagem;

        return !mensagem;
    }

    function limparEstado(campo) {
        campo.classList.remove("campo--invalido", "campo--valido");
        campo.removeAttribute("aria-invalid");
        delete campo.dataset.tocado;
        delete campo.dataset.erroExtra;
    }

    // mensagem geral embaixo do form (vermelha ou verde)
    function atualizarStatus() {
        const algumErro = campos.some((c) => c.classList.contains("campo--invalido"));
        const tudoOk = campos.every((c) => !regras[c.name](c.value) && !c.dataset.erroExtra);
        $(".form__status--erro", form).classList.toggle("alerta--visivel", algumErro);
        $(".form__status--ok", form).classList.toggle("alerta--visivel", !algumErro && tudoOk);
    }

    function atualizarContador() {
        if (!contador) return;
        const usados = form.mensagem.value.length;
        contador.textContent = `${usados}/${LIMITE_MENSAGEM}`;
        contador.classList.toggle("form__contador--limite", usados >= LIMITE_MENSAGEM * 0.9);
    }

    // ---------- CEP: busca cidade/UF ----------

    async function consultarCep() {
        const campo = form.cep;
        const numeros = soDigitos(campo.value);
        form.cidade.value = "";
        if (regras.cep(campo.value)) {
            dicaCep.textContent = "";
            return;
        }

        dicaCep.textContent = "Buscando endereço...";
        const resultado = await buscarCep(numeros);
        if (soDigitos(campo.value) !== numeros) return; // a pessoa mudou o CEP enquanto buscava

        if (resultado.ok) {
            form.cidade.value = `${resultado.cidade}/${resultado.uf}`;
            dicaCep.textContent = `${resultado.bairro ? `${resultado.bairro}, ` : ""}${resultado.cidade}/${resultado.uf}`;
            delete campo.dataset.erroExtra;
        } else if (resultado.motivo === "nao-encontrado") {
            dicaCep.textContent = "";
            campo.dataset.erroExtra = "CEP não encontrado. Confira os números.";
        } else {
            // sem internet não trava o cadastro, só avisa
            dicaCep.textContent = "Não deu pra confirmar o CEP agora, mas pode seguir.";
        }
        validarCampo(campo);
        atualizarStatus();
    }

    // ---------- rascunho no localStorage ----------

    const salvarRascunho = debounce(() => {
        const dados = Object.fromEntries(new FormData(form));
        const temAlgo = Object.values(dados).some((v) => String(v).trim());
        if (temAlgo) rascunho.salvar(dados);
        else rascunho.limpar();
    }, 400);

    function restaurarRascunho() {
        const salvo = rascunho.ler();
        if (!salvo) return false;
        campos.forEach((campo) => {
            if (salvo[campo.name]) campo.value = salvo[campo.name];
        });
        if (salvo.cidade) form.cidade.value = salvo.cidade;
        return true;
    }

    // ---------- eventos ----------

    // um listener só no form pega todos os campos (delegação de eventos)
    form.addEventListener("input", (evento) => {
        const campo = evento.target;
        if (!campo.matches("[data-validar]")) return;

        if (mascaras[campo.name]) campo.value = mascaras[campo.name](campo.value);
        if (campo.name === "cep") {
            delete campo.dataset.erroExtra;
            dicaCep.textContent = "";
            if (soDigitos(campo.value).length === 8) consultarCep();
        }
        if (campo.name === "cpf" || campo.name === "email") delete campo.dataset.erroExtra;

        // só fica vermelho enquanto digita se a pessoa já saiu do campo uma vez
        if (campo.dataset.tocado) validarCampo(campo);
        if (campo.name === "mensagem") atualizarContador();

        atualizarStatus();
        salvarRascunho();
    });

    form.addEventListener("focusout", (evento) => {
        const campo = evento.target;
        if (!campo.matches("[data-validar]")) return;
        // campo opcional vazio não precisa ficar marcado
        if (!campo.required && !campo.value) return;
        campo.dataset.tocado = "sim";
        validarCampo(campo);
        atualizarStatus();
    });

    form.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        // valida tudo de uma vez
        campos.forEach((campo) => (campo.dataset.tocado = "sim"));
        verificarDuplicados();
        const invalidos = campos.filter((campo) => !validarCampo(campo));
        atualizarStatus();

        if (invalidos.length) {
            invalidos[0].focus();
            mostrarToast({
                tipo: "erro",
                titulo: "Confira o formulário",
                texto: invalidos.length === 1 ? "1 campo precisa de atenção." : `${invalidos.length} campos precisam de atenção.`,
            });
            return;
        }

        // "envia": trava o botão e simula a espera de um servidor
        botaoEnviar.disabled = true;
        botaoEnviar.classList.add("btn--carregando");
        const textoOriginal = botaoEnviar.textContent;
        botaoEnviar.textContent = "Enviando...";

        try {
            await esperar(800);
            const dados = Object.fromEntries(new FormData(form));
            const novo = voluntarios.adicionar({
                nome: dados.nome.trim().replace(/\s+/g, " "),
                email: dados.email.trim().toLowerCase(),
                cpf: soDigitos(dados.cpf),
                telefone: soDigitos(dados.telefone),
                cep: soDigitos(dados.cep),
                cidade: dados.cidade,
                projeto: dados.projeto,
                mensagem: dados.mensagem.trim(),
            });
            rascunho.limpar();
            mostrarToast({ tipo: "sucesso", titulo: "Cadastro realizado", texto: "Bem-vindo(a) à equipe de voluntários!" });
            aoConcluir?.(novo);
        } catch (erro) {
            mostrarToast({ tipo: "erro", titulo: "Não foi possível enviar", texto: erro.message });
            botaoEnviar.disabled = false;
            botaoEnviar.classList.remove("btn--carregando");
            botaoEnviar.textContent = textoOriginal;
        }
    });

    // botão "Limpar Campos": o reset nativo limpa os valores, o JS limpa as cores e o rascunho
    form.addEventListener("reset", () => {
        setTimeout(() => {
            campos.forEach(limparEstado);
            dicaCep.textContent = "";
            rascunho.limpar();
            atualizarContador();
            atualizarStatus();
            campos[0].focus();
        });
    });

    // CPF e e-mail não podem repetir (simula a regra de um banco de dados)
    function verificarDuplicados() {
        if (!regras.cpf(form.cpf.value) && voluntarios.existe("cpf", soDigitos(form.cpf.value))) {
            form.cpf.dataset.erroExtra = "Este CPF já está cadastrado.";
        }
        const email = form.email.value.trim().toLowerCase();
        if (!regras.email(email) && voluntarios.existe("email", email)) {
            form.email.dataset.erroExtra = "Este e-mail já está cadastrado.";
        }
    }

    // ---------- estado inicial ----------

    const recuperou = restaurarRascunho();
    if (projetoInicial && $(`option[value="${CSS.escape(projetoInicial)}"]`, form.projeto)) {
        form.projeto.value = projetoInicial;
    }
    // valida o que veio preenchido (rascunho ou projeto escolhido no modal)
    campos.forEach((campo) => {
        if (campo.value) {
            campo.dataset.tocado = "sim";
            validarCampo(campo);
        }
    });
    if (recuperou) {
        if (soDigitos(form.cep.value).length === 8) consultarCep();
        mostrarToast({ tipo: "info", titulo: "Rascunho recuperado", texto: "Continuamos de onde você parou." });
    }
    atualizarContador();
    atualizarStatus();
}
