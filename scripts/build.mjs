// build de produção: gera a pasta dist/ pronta para publicar
//   - JS: junta os 18 módulos em 1 arquivo e minifica (menos requisições)
//   - CSS: minifica
//   - HTML: troca os caminhos para os arquivos minificados (com hash para cache) e tira comentários
//   - imagens: copia a pasta assets
// uso: npm run build
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, stat, writeFile, readdir } from "node:fs/promises";

const DIST = "dist";
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

async function tamanhoPasta(pasta, filtro = () => true) {
    let total = 0;
    for (const item of await readdir(pasta, { recursive: true, withFileTypes: true })) {
        if (item.isFile() && filtro(item.name)) total += (await stat(`${item.parentPath ?? item.path}/${item.name}`)).size;
    }
    return total;
}

const hash = (conteudo) => createHash("md5").update(conteudo).digest("hex").slice(0, 8);

await rm(DIST, { recursive: true, force: true });
await mkdir(`${DIST}/html`, { recursive: true });

// 1. JavaScript: bundle + minificação
const js = await build({
    entryPoints: ["js/main.js"],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["es2020"],
    sourcemap: true,
    outfile: `${DIST}/js/main.min.js`,
    write: true,
    metafile: true,
});

// 2. CSS: minificação
await build({
    entryPoints: ["css/style.css"],
    minify: true,
    outfile: `${DIST}/css/style.min.css`,
    target: ["chrome100", "firefox100", "safari15"],
});

// 3. imagens (o logo.png original fica de fora, o site usa os ícones menores)
await cp("assets", `${DIST}/assets`, { recursive: true, filter: (origem) => !origem.endsWith("logo.png") });

// 4. HTML: caminhos novos com hash (?v=) para o navegador baixar de novo quando o arquivo mudar
const versaoJs = hash(await readFile(`${DIST}/js/main.min.js`));
const versaoCss = hash(await readFile(`${DIST}/css/style.min.css`));

for (const pagina of ["index.html", "componentes.html"]) {
    let html = await readFile(`html/${pagina}`, "utf8");
    html = html
        .replace('href="../css/style.css"', `href="../css/style.min.css?v=${versaoCss}"`)
        .replace('src="../js/main.js"', `src="../js/main.min.js?v=${versaoJs}"`)
        .replace(/<!--[\s\S]*?-->/g, "")   // tira comentários
        .replace(/\n\s*\n/g, "\n");         // tira linhas em branco
    await writeFile(`${DIST}/html/${pagina}`, html);
}

// raiz do site: manda para html/index.html (o GitHub Pages abre o index.html da raiz)
await writeFile(`${DIST}/index.html`, `<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="UTF-8"><title>ONG Esperança Solidária</title>
<meta http-equiv="refresh" content="0; url=html/index.html">
<script>location.replace("html/index.html" + location.hash)</script></head>
<body><a href="html/index.html">Abrir o site da ONG Esperança Solidária</a></body></html>
`);

// 5. relatório antes x depois
const antesJs = await tamanhoPasta("js", (n) => n.endsWith(".js"));
const depoisJs = (await stat(`${DIST}/js/main.min.js`)).size;
const antesCss = (await stat("css/style.css")).size;
const depoisCss = (await stat(`${DIST}/css/style.min.css`)).size;
const modulos = Object.keys(js.metafile.inputs).length;

console.log("\nBuild de produção pronto em dist/\n");
console.log(`JavaScript: ${modulos} arquivos, ${kb(antesJs)} -> 1 arquivo, ${kb(depoisJs)} (-${Math.round((1 - depoisJs / antesJs) * 100)}%)`);
console.log(`CSS:        ${kb(antesCss)} -> ${kb(depoisCss)} (-${Math.round((1 - depoisCss / antesCss) * 100)}%)`);
console.log(`Imagens:    ${kb(await tamanhoPasta(`${DIST}/assets`))} em dist/assets\n`);
