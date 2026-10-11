// página inicial
import { html, $$, prefereMenosMovimento } from "../utils/dom.js";
import { projetos, impacto } from "../dados/projetos.js";
import { cardProjeto } from "../componentes/templates.js";
import { voluntarios } from "../servicos/armazenamento.js";

const formatar = (numero) => numero.toLocaleString("pt-BR");

export const inicio = {
    titulo: "Início",

    render() {
        const cadastrados = voluntarios.contar();

        return html`
            <section id="sobre" class="sobre">
                <h2 class="etiqueta">Sobre nós</h2>
                <div class="sobre__texto">
                    <p class="sobre__descricao">A ONG Esperança Solidária é uma organização sem fins lucrativos dedicada a promover a inclusão social e garantir direitos fundamentais para comunidades em situação de vulnerabilidade.</p>
                    <a href="#/cadastro" class="btn btn--contorno">Seja Voluntário</a>
                </div>
                <figure class="sobre__figura">
                    <img src="../assets/voluntarios-acao.jpg" alt="Voluntária da ONG sorrindo abraçada a três jovens de bonés azuis em frente à placa de um parque.">
                </figure>
            </section>

            <section id="missao-visao" class="pilares">
                <h2 class="visualmente-oculto">Nossa Missão, Visão e Valores</h2>
                <article class="pilar">
                    <h3 class="pilar__titulo">Missão</h3>
                    <p class="pilar__texto">Transformar vidas por meio da educação, assistência social e oportunidades de desenvolvimento comunitário.</p>
                </article>
                <article class="pilar">
                    <h3 class="pilar__titulo">Visão</h3>
                    <p class="pilar__texto">Ser referência na construção de uma sociedade justa, onde todas as famílias tenham acesso a oportunidades dignas.</p>
                </article>
                <article class="pilar">
                    <h3 class="pilar__titulo">Valores</h3>
                    <ul class="pilar__valores">
                        <li>Empatia</li>
                        <li>Solidariedade</li>
                        <li>Transparência</li>
                        <li>Compromisso Social</li>
                    </ul>
                </article>
            </section>

            <section id="impacto" class="impacto">
                <h2 class="visualmente-oculto">Impacto em Números</h2>
                <ul class="impacto__lista">
                    ${impacto.map((item) => {
                        const valor = item.valor + (item.somaCadastros ? cadastrados : 0);
                        return html`
                            <li class="impacto__item">
                                <strong class="impacto__numero" data-valor="${valor}" data-prefixo="${item.prefixo}" data-sufixo="${item.sufixo}">${item.prefixo}${formatar(valor)}${item.sufixo}</strong>
                                <span class="impacto__rotulo">${item.rotulo}</span>
                            </li>
                        `;
                    })}
                </ul>
            </section>

            <section id="projetos" class="projetos">
                <img class="projetos__imagem" src="../assets/voluntarios2.jpg" alt="Equipe de voluntários com coletes azuis e máscaras reunida em uma sala.">
                <div class="projetos__conteudo">
                    <h2 class="projetos__titulo">Nossas Iniciativas</h2>
                    <p class="projetos__subtitulo">Confira abaixo os nossos projetos</p>
                    <div class="projetos__grade">
                        ${projetos.map(cardProjeto)}
                    </div>
                </div>
            </section>
        `;
    },

    montar(raiz) {
        return animarContadores(raiz);
    },
};

// números contam de 0 até o valor quando a seção aparece na tela
function animarContadores(raiz) {
    const numeros = $$(".impacto__numero", raiz);
    if (prefereMenosMovimento() || !("IntersectionObserver" in window)) return null;

    const animar = (el) => {
        const { valor, prefixo, sufixo } = el.dataset;
        const final = Number(valor);
        const duracao = 1200;
        const inicioTempo = performance.now();

        const passo = (agora) => {
            const progresso = Math.min((agora - inicioTempo) / duracao, 1);
            const suavizado = 1 - (1 - progresso) ** 3; // começa rápido, termina devagar
            el.textContent = `${prefixo}${formatar(Math.round(final * suavizado))}${sufixo}`;
            if (progresso < 1) requestAnimationFrame(passo);
        };
        requestAnimationFrame(passo);
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            if (!entrada.isIntersecting) return;
            animar(entrada.target);
            observador.unobserve(entrada.target);
        });
    }, { threshold: 0.6 });

    numeros.forEach((el) => {
        el.textContent = `${el.dataset.prefixo}0${el.dataset.sufixo}`;
        observador.observe(el);
    });

    // quando sair da página, para de observar
    return () => observador.disconnect();
}
