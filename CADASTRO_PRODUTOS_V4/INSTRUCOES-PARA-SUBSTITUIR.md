# BACK_FASE4 / CADASTRO_PRODUTOS_V4 — pacote limpo para GitHub e Vercel

**Origem:** ZIP fornecido pelo usuario, comparado ao repositorio `juliocezardev1-lab/Vercel`, branch `main`, commit `23b48e4b004e070837a7304a3296362db90963c2` (19/10/2026).

Este pacote e a aplicacao completa (frontend, Express, API, SQL, testes e ativos) sem dependencias instaladas, arquivos Git e SEGREDOS. O ZIP fornecido continha arquivos de configuracao privados; eles foram intencionalmente removidos desta distribuicao. **Nao e necessario enviar chaves para o ChatGPT.**

## O que esta alinhado

- `vercel.json`: rewrites para `/login`, `/login/`, `/`, `/index.html` e `/produtos`; API por funcoes `api/*.js`.
- `FRONTEND`: HTML, JS, CSS, fontes e imagens com caminhos para funcionar no deploy.
- `BACKEND`: autenticação com Cloudflare Turnstile validada no servidor, sessoes e controle de acesso; PostgreSQL/Supabase como banco.
- `BACKEND/migrations/001-authentication.sql`: migracao aditiva. Executar manualmente e somente no banco certo.
- `.gitignore` e `.vercelignore`: protegem credenciais e arquivos locais.
- Novo `npm run check:production`: testes HTTP de leitura para pagina de login, configuracao publica e APIs privadas sem sessao.
- Novo `BACKEND/check-schema.sql`: consulta SOMENTE de leitura para verificar as tabelas.

## Como substituir o projeto local no Windows (PowerShell)

1. Faca um backup da pasta atual. **Preserve o `.git/` e os seus arquivos `BACKEND/.env` e `.env.local` em local seguro.** Nao copie estes arquivos para o GitHub ou para este ZIP.
2. Extraia `CADASTRO_PRODUTOS_V4` do ZIP e copie os arquivos do pacote para a pasta existente do projeto. Sobrescreva arquivos de codigo homonimos, mas mantenha o `.git` original e as configuracoes privadas locais. Nao e necessario copiar `node_modules` nem bancos SQLite antigos.
3. Na pasta raiz:

   ```powershell
   npm ci
   npm test
   npm run check:production
   git status
   ```

4. Revise o diff antes de criar commit. Caso va publicar, faça push para o repositorio correto `juliocezardev1-lab/Vercel` (preferencialmente em branch e PR) e acompanhe o Preview na Vercel. Nao sobrescreva outra branch sem revisar.

## Ambiente Vercel (nao dentro do ZIP)

Projeto: `juliocezardev1-labs-projects/vercel-backend`.
Dominio publico: `https://vercel-backend-sandy-kappa.vercel.app`.

Em **Production**, confirme a presença destas seis variaveis no painel da Vercel:
`DATABASE_URL`, `PORT`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_EXPECTED_HOSTNAME`, `RATE_LIMIT_SECRET`.
A chave publica pode ser enviada pelo endpoint `/api/config`, mas a chave secreta deve ficar restrita ao backend.
**A configuracao Production nao se aplica automaticamente aos ambientes Preview/Development.** Use banco e chaves Turnstile de testes isolados se for habilitar o login em Preview.

Para executar localmente, configure `BACKEND/.env` a partir de `BACKEND/.env.example`. A configuracao de `TURNSTILE_EXPECTED_HOSTNAME` e do widget deve corresponder ao hostname local ou de Preview. Os scripts Node deste projeto leem `BACKEND/.env` e nao dependem de `.env.local`.

## PostgreSQL e administrador

1. No editor SQL do banco correto, execute `BACKEND/check-schema.sql` (somente leitura).
2. Se alguma tabela de autenticacao faltar, faca backup e revise a migracao `BACKEND/migrations/001-authentication.sql` antes de executa-la. A aplicacao **nao** executa migracoes de autenticacao automaticamente.
3. Crie o primeiro administrador SOMENTE quando as tabelas existirem e a conexao estiver correta, configurando `ADMIN_IDENTIFIER` e `ADMIN_PASSWORD` temporariamente e executando `npm run create-admin`. Nao use credenciais em commits nem logs.
4. Acesse `/login` e valide o CAPTCHA e a sessao com uma conta real. O check HTTP nao testa credenciais, o PostgreSQL nem o servico Cloudflare ponta a ponta.

## Verificacoes realizadas no ambiente de preparacao

- Testes `npm test` da base recebida: 6 aprovados, 0 falhas.
- Mudancas do ZIP de origem em arquivos rastreados eram somente finais de linha CRLF; normalizados sem alteracao funcional.
- Novos testes automatizados adicionados ao pacote de entrega; ver resultado de execucao no resumo final da conversa.
- Vercel MCP retornou 403 ao consultar metadados do projeto nesta sessao. O comando `curl` anterior do usuario havia retornado HTTP 200 para `/login` e `/api/config`, mas banco e login reais permanecem sem verificacao.

## Aviso de seguranca

Nao compartilhe nem publique `.env`, `.env.local`, certificados privados, URLs de banco contendo senhas, dumps do banco, ou chaves secretas do Turnstile. Se alguma credencial ja tiver sido publicada num repositorio ou compartilhada em local inadequado, rotacione-a no provedor e atualize a Vercel.
