# Como contribuir

Obrigado por querer ajudar! Este guia mostra como o projeto é organizado no Git.

## 1. Preparar o ambiente

```bash
git clone https://github.com/arnoldodev/projeto-ong-esperanca-solidaria.git
cd projeto-ong-esperanca-solidaria
npm install
npm run dev
```

## 2. Branches

A `main` é a versão estável, publicada automaticamente no GitHub Pages. **Ninguém trabalha direto nela.**

Crie uma branch a partir da `main` atualizada:

```bash
git switch main
git pull
git switch -c feature/nome-curto-da-mudanca
```

| Prefixo | Quando usar | Exemplo |
| --- | --- | --- |
| `feature/` | funcionalidade nova | `feature/pagina-doacoes` |
| `fix/` | correção de bug | `fix/mascara-telefone` |
| `docs/` | só documentação | `docs/readme-deploy` |
| `ci/` | GitHub Actions, build | `ci/deploy-github-pages` |
| `chore/` | organização, configs | `chore/gitignore` |

## 3. Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/): `tipo(escopo opcional): descrição no imperativo`.

```text
feat: adiciona filtro por categoria nos projetos
fix(form): corrige máscara de telefone fixo
perf: converte imagens para WebP
docs: explica o deploy no README
style: organiza seções do CSS
refactor: separa validação em módulo próprio
```

- Um commit por mudança lógica, com mensagem curta (até ~70 caracteres) no título
- Use o corpo da mensagem para explicar o **porquê** quando não for óbvio

## 4. Antes de abrir o Pull Request

- [ ] `npm run build` roda sem erro
- [ ] Testei no navegador as telas que mudei, inclusive no celular (DevTools)
- [ ] Naveguei só com o teclado (Tab, Shift+Tab, Enter, Esc)
- [ ] Rodei o Lighthouse ou o axe DevTools e não há novos problemas de acessibilidade
- [ ] Console do navegador sem erros

## 5. Pull Request

```bash
git push -u origin feature/nome-curto-da-mudanca
```

Abra o Pull Request para a `main` no GitHub, descreva o que mudou e como testar. Depois da revisão, faça o merge (pode excluir a branch em seguida).

## 6. Versões

Ao fechar uma entrega, atualize o `CHANGELOG.md` e crie uma tag:

```bash
git tag -a v1.1.0 -m "v1.1.0: descrição da entrega"
git push origin v1.1.0
```

- **MAJOR** (2.0.0): mudança que quebra algo
- **MINOR** (1.1.0): funcionalidade nova
- **PATCH** (1.0.1): correção

## Padrões de código

- **HTML:** semântico, todo campo com `<label>`, toda imagem com `alt`
- **CSS:** classes no padrão BEM (`bloco__elemento--modificador`), cores e espaços pelas variáveis do `:root`
- **JS:** módulos ES com uma responsabilidade por arquivo, nomes em português, estado visual por classes (o CSS decide a aparência)
