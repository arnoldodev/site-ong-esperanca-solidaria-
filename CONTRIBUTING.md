Como contribuir

Obrigado por querer ajudar! Este guia mostra como o projeto é organizado no Git.

1. Preparar o ambiente
bash
git clone https://github.com/arnoldodev/projeto-ong-esperanca-solidaria.git
cd projeto-ong-esperanca-solidaria
npm install
npm run dev
2. Branches (GitFlow)
Branch	Para que serve	Sai de	Volta para
main	versões estáveis, publicadas no GitHub Pages	-	-
develop	integração das mudanças da próxima versão	main	main (no lançamento)
feature/	funcionalidade nova, ex.: feature/pagina-doacoes	develop	develop
fix/	correção que pode esperar a próxima versão, ex.: fix/mascara-telefone	develop	develop
docs/, ci/, chore/	documentação, GitHub Actions/build, organização	develop	develop
hotfix/	correção urgente no que já está no ar, ex.: hotfix/seta-select-alto-contraste	main	main e develop

Ninguém trabalha direto na main nem na develop.

Nova funcionalidade
bash
git switch develop
git pull
git switch -c feature/nome-curto-da-mudanca
# ... commits ...
git push -u origin feature/nome-curto-da-mudanca

Abra o Pull Request com base: develop.

Correção urgente (hotfix)
bash
git switch main
git pull
git switch -c hotfix/descricao-do-problema
# ... commit da correção ...
git push -u origin hotfix/descricao-do-problema

Abra o Pull Request com base: main. Depois do merge, crie a tag de patch e leve a correção para a develop:

bash
git switch main
git pull
git tag -a v1.0.2 -m "v1.0.2: descrição da correção"
git push origin v1.0.2
git switch develop
git merge main
git push
3. Issues e milestones
Toda tarefa ou bug começa como issue, com título claro e, no caso de bug, como reproduzir e o resultado esperado
Use os labels bug, enhancement ou documentation
Coloque a issue no milestone da versão em que ela será entregue
Feche a issue pelo PR, escrevendo Closes #número na descrição
4. Commits

Usamos Conventional Commits: tipo(escopo opcional): descrição no imperativo.

text
feat: adiciona filtro por categoria nos projetos
fix(a11y): deixa a seta do select visível no alto contraste
perf: converte imagens para WebP
docs: explica o deploy no README
ci: publica no GitHub Pages com GitHub Actions
chore: adiciona .gitignore
refactor: separa validação em módulo próprio
Um commit por mudança lógica, com título curto (até ~70 caracteres)
Use o corpo da mensagem para explicar o porquê quando não for óbvio
5. Antes de abrir o Pull Request
 npm run build roda sem erro
 Testei no navegador as telas que mudei, inclusive no celular (DevTools)
 Naveguei só com o teclado (Tab, Shift+Tab, Enter, Esc)
 Rodei o Lighthouse ou o axe DevTools e não há novos problemas de acessibilidade
 Console do navegador sem erros
6. Pull Request

Preencha o template: o que mudou, como testar e o checklist. Escolha a base certa (develop para features, main para hotfix), coloque o milestone e o label, e faça o merge depois da revisão. A branch pode ser excluída em seguida.

7. Lançar uma versão

Quando a develop estiver estável:

Atualize o CHANGELOG.md com a nova versão
Abra um Pull Request de develop para main
Depois do merge, crie a tag:
bash
git switch main
git pull
git tag -a v1.1.0 -m "v1.1.0: descrição da entrega"
git push origin v1.1.0

Versionamento Semântico:

MAJOR (2.0.0): mudança que quebra algo
MINOR (1.1.0): funcionalidade nova
PATCH (1.0.1): correção
Padrões de código
HTML: semântico, todo campo com <label>, toda imagem com alt
CSS: classes no padrão BEM (bloco__elemento--modificador), cores e espaços pelas variáveis do :root
JS: módulos ES com uma responsabilidade por arquivo, nomes em português, estado visual por classes (o CSS decide a aparência)