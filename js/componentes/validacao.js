// regras de validação e máscaras do formulário
// funções "puras": recebem texto, devolvem texto. Não mexem no DOM.

export const soDigitos = (valor = "") => String(valor).replace(/\D/g, "");

// confere os 2 dígitos verificadores do CPF
export function cpfValido(cpf) {
    const d = soDigitos(cpf);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false; // 111.111.111-11 passa no cálculo, mas é inválido

    const digito = (quantidade) => {
        let soma = 0;
        for (let i = 0; i < quantidade; i++) {
            soma += Number(d[i]) * (quantidade + 1 - i);
        }
        const resto = (soma * 10) % 11;
        return resto === 10 ? 0 : resto;
    };

    return digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
}

/*
 * cada regra recebe o valor do campo e devolve:
 *   ""          -> campo ok
 *   "mensagem"  -> o erro que aparece embaixo do campo
 */
export const regras = {
    nome(valor) {
        const nome = valor.trim();
        if (!nome) return "Informe seu nome completo.";
        if (nome.length < 3) return "O nome precisa ter pelo menos 3 letras.";
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ' ]+$/.test(nome)) return "Use apenas letras no nome.";
        if (nome.split(/\s+/).length < 2) return "Digite nome e sobrenome.";
        return "";
    },

    email(valor) {
        const email = valor.trim();
        if (!email) return "Informe seu e-mail.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return "Digite um e-mail válido, ex: maria@exemplo.com";
        return "";
    },

    cpf(valor) {
        const d = soDigitos(valor);
        if (!d) return "Informe seu CPF.";
        if (d.length !== 11) return "O CPF precisa ter 11 números.";
        if (!cpfValido(d)) return "CPF inválido. Confira os números.";
        return "";
    },

    telefone(valor) {
        const d = soDigitos(valor);
        if (!d) return "Informe seu telefone.";
        if (d.length < 10) return "Digite DDD + número, ex: (47) 99101-8870";
        if (d.length === 11 && d[2] !== "9") return "Celular com 11 números começa com 9 depois do DDD.";
        return "";
    },

    cep(valor) {
        const d = soDigitos(valor);
        if (!d) return "Informe seu CEP.";
        if (d.length !== 8) return "O CEP precisa ter 8 números.";
        return "";
    },

    projeto(valor) {
        return valor ? "" : "Escolha um projeto.";
    },

    mensagem(valor) {
        return valor.length > 500 ? "Use no máximo 500 caracteres." : "";
    },
};

// máscaras: formatam enquanto a pessoa digita
export const mascaras = {
    // 12345678909 -> 123.456.789-09
    cpf(valor) {
        return soDigitos(valor)
            .slice(0, 11)
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    },

    // 47991018870 -> (47) 99101-8870  |  4733334444 -> (47) 3333-4444
    telefone(valor) {
        const d = soDigitos(valor).slice(0, 11);
        if (!d) return "";
        if (d.length <= 2) return `(${d}`;
        const tamanhoMeio = d.length === 11 ? 5 : 4;
        const meio = d.slice(2, 2 + tamanhoMeio);
        const fim = d.slice(2 + tamanhoMeio);
        return `(${d.slice(0, 2)}) ${meio}${fim ? `-${fim}` : ""}`;
    },

    // 88330000 -> 88330-000
    cep(valor) {
        return soDigitos(valor).slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
    },
};

// esconde o meio do CPF na listagem: ***.456.789-**
export function cpfParcial(cpf) {
    const d = soDigitos(cpf);
    return d.length === 11 ? `***.${d.slice(3, 6)}.${d.slice(6, 9)}-**` : "***";
}
