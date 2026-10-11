// ponto de entrada: registra as rotas e liga os componentes globais
import { $ } from "./utils/dom.js";
import { rota, iniciarRoteador } from "./roteador.js";
import { iniciarMenu, fecharMenuMobile, marcarLinkAtivo } from "./componentes/menu.js";
import { iniciarModal, fecharModal } from "./componentes/modal.js";
import { iniciarAcessibilidade } from "./componentes/acessibilidade.js";

import { inicio } from "./views/inicio.js";
import { projetos } from "./views/projetos.js";
import { cadastro } from "./views/cadastro.js";
import { voluntarios } from "./views/voluntarios.js";
import { naoEncontrada } from "./views/naoEncontrada.js";

rota("/", inicio);
rota("/projetos", projetos);
rota("/projetos/:id", projetos);
rota("/cadastro", cadastro);
rota("/voluntarios", voluntarios);

iniciarMenu();
iniciarModal();
iniciarAcessibilidade();

iniciarRoteador({
    elemento: $("#conteudo"),
    naoEncontrada,
    // roda a cada troca de rota, antes de desenhar a página
    aoMudar: ({ caminho }) => {
        fecharModal();
        fecharMenuMobile();
        marcarLinkAtivo(caminho);
    },
});
