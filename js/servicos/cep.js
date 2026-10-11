// consulta de CEP na API pública do ViaCEP (https://viacep.com.br)
import { soDigitos } from "../componentes/validacao.js";

const cache = new Map();

/*
 * retorna:
 *   { ok: true, cidade, uf, bairro }  -> achou
 *   { ok: false, motivo: "nao-encontrado" }
 *   { ok: false, motivo: "sem-conexao" } -> API fora do ar / sem internet
 */
export async function buscarCep(cep) {
    const numeros = soDigitos(cep);
    if (cache.has(numeros)) return cache.get(numeros);

    // se a API demorar mais de 5s, desiste
    const controle = new AbortController();
    const timer = setTimeout(() => controle.abort(), 5000);

    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${numeros}/json/`, { signal: controle.signal });
        if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
        const dados = await resposta.json();

        const resultado = dados.erro
            ? { ok: false, motivo: "nao-encontrado" }
            : { ok: true, cidade: dados.localidade, uf: dados.uf, bairro: dados.bairro };

        cache.set(numeros, resultado);
        return resultado;
    } catch {
        return { ok: false, motivo: "sem-conexao" };
    } finally {
        clearTimeout(timer);
    }
}
