// dados dos projetos: cards, modais, submenu e select do formulário saem daqui
// mudou aqui, muda no site todo (mesma ideia das variáveis do CSS)

export const projetos = [
    {
        id: "educa-para-todos",
        nome: "Educa para Todos",
        categoria: "educacao",
        rotuloCategoria: "Educação",
        resumo: "Aulas de reforço escolar e informática básica para crianças do ensino público.",
        descricao: "Aulas de reforço escolar e informática básica para crianças do ensino público, de segunda a sexta, no contraturno escolar. Voluntários atuam como monitores de português, matemática e informática.",
    },
    {
        id: "marmita-do-bem",
        nome: "Marmita do Bem",
        categoria: "alimentacao",
        rotuloCategoria: "Alimentação",
        resumo: "Distribuição diária de refeições nutritivas para pessoas em situação de rua.",
        descricao: "Distribuição diária de refeições nutritivas para pessoas em situação de rua. Voluntários ajudam no preparo, embalagem e entrega das marmitas.",
    },
    {
        id: "verde-urbano",
        nome: "Verde Urbano",
        categoria: "ambiente",
        rotuloCategoria: "Meio ambiente",
        resumo: "Criação de hortas comunitárias para segurança alimentar local.",
        descricao: "Criação de hortas comunitárias para segurança alimentar local. Voluntários participam do plantio, manutenção e oficinas de cultivo com os moradores.",
    },
    {
        id: "saude-solidaria",
        nome: "Saúde Solidária",
        categoria: "saude",
        rotuloCategoria: "Saúde",
        resumo: "Consultas médicas básicas e apoio psicológico gratuito para famílias em vulnerabilidade.",
        descricao: "Consultas médicas básicas e apoio psicológico gratuito para famílias em vulnerabilidade. Voluntários da área da saúde atendem em mutirões, e outros voluntários ajudam na recepção e no agendamento.",
    },
];

// opções do select do cadastro = projetos + uma área extra
export const areasDeInteresse = [
    ...projetos.map(({ id, nome }) => ({ id, nome })),
    { id: "apoio-administrativo", nome: "Apoio Administrativo / Logística" },
];

export const buscarProjeto = (id) => projetos.find((p) => p.id === id);

export const nomeDaArea = (id) => areasDeInteresse.find((a) => a.id === id)?.nome ?? "Não informado";

// categorias sem repetir, pros botões de filtro
export const categorias = [...new Map(projetos.map((p) => [p.categoria, p.rotuloCategoria]))]
    .map(([id, rotulo]) => ({ id, rotulo }));

// números da seção de impacto (o de voluntários soma os cadastros do localStorage)
export const impacto = [
    { prefixo: "+", valor: 1000, sufixo: "", rotulo: "Famílias atendidas" },
    { prefixo: "+", valor: 7000, sufixo: "", rotulo: "Refeições distribuídas" },
    { prefixo: "", valor: 120, sufixo: "", rotulo: "Voluntários Ativos", somaCadastros: true },
    { prefixo: "+R$", valor: 50, sufixo: "K", rotulo: "Doações Arrecadadas" },
];
