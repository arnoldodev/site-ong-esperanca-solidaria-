// tudo que mexe com localStorage fica aqui
// o resto do código não sabe que é localStorage, só chama voluntarios.listar() etc.

const CHAVES = {
    voluntarios: "ong:voluntarios",
    rascunho: "ong:rascunho-cadastro",
};

// try/catch porque o localStorage pode estar bloqueado (aba anônima, cota cheia...)
function ler(chave, padrao) {
    try {
        const texto = localStorage.getItem(chave);
        return texto ? JSON.parse(texto) : padrao;
    } catch {
        return padrao;
    }
}

function gravar(chave, valor) {
    try {
        localStorage.setItem(chave, JSON.stringify(valor));
        return true;
    } catch {
        return false;
    }
}

function apagar(chave) {
    try {
        localStorage.removeItem(chave);
    } catch {
        /* sem localStorage, nada pra apagar */
    }
}

function gerarId() {
    return window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const voluntarios = {
    listar() {
        return ler(CHAVES.voluntarios, []);
    },

    adicionar(dados) {
        const novo = { ...dados, id: gerarId(), criadoEm: new Date().toISOString() };
        const ok = gravar(CHAVES.voluntarios, [...this.listar(), novo]);
        if (!ok) throw new Error("Não foi possível salvar no navegador.");
        return novo;
    },

    remover(id) {
        gravar(CHAVES.voluntarios, this.listar().filter((v) => v.id !== id));
    },

    // ex: existe("cpf", "12345678909") -> true/false
    existe(campo, valor) {
        return this.listar().some((v) => v[campo] === valor);
    },

    contar(projeto) {
        const lista = this.listar();
        return projeto ? lista.filter((v) => v.projeto === projeto).length : lista.length;
    },
};

// o que a pessoa já digitou no formulário, pra não perder se sair da página
export const rascunho = {
    ler: () => ler(CHAVES.rascunho, null),
    salvar: (dados) => gravar(CHAVES.rascunho, dados),
    limpar: () => apagar(CHAVES.rascunho),
};
