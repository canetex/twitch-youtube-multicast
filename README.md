# Twitch e Youtube Multicast

Aplicação web para cadastrar **times**, associar **streams** (Twitch ou YouTube) a cada jogador e visualizar um **mosaico** agrupado por time — com foco em tela cheia e link público para espectadores.

## Funcionalidades

- **Cadastro**: criar times e adicionar URLs de Twitch / YouTube por jogador (`/cadastro`).
- **Link público**: slug único em `/compartilhar/[slug]` com o mesmo mosaico da página inicial (botão “Copiar link público” no cabeçalho).
- **Início** (`/`): todos os times em seções; cada seção é um mosaico de players.
- **Time** (`/equipe/[id]`): apenas as streams daquele time.
- **Foco** (`/ver/[teamId]/[streamId]`): stream principal em destaque; na barra inferior, as outras streams do mesmo time em mosaico horizontal.
- **Voltar aos times**: botão no cabeçalho nas páginas de time e de foco.

## Requisitos

- Node.js 20+
- npm

## Desenvolvimento

```bash
cp .env.example .env
npx prisma migrate dev
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Testes

```bash
npm test
```

## Build

```bash
npm run build
npm start
```

## Banco de dados

SQLite (`DATABASE_URL=file:./dev.db` relativo ao diretório `prisma/`). O arquivo gerado não deve ser commitado.

Em hospedagem serverless (ex.: Vercel), o sistema de arquivos efêmero não persiste SQLite entre deploys — use um fluxo de migração para Postgres/MySQL ou um volume persistente.

## Publicar no GitHub (repositório público)

1. Crie um repositório vazio em GitHub (visibilidade **Public**), sem README inicial se já tiver um localmente.
2. Na pasta do projeto:

```bash
git init
git add .
git commit -m "[Feature] : Twitch e Youtube Multicast — mosaico por time e link público"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git push -u origin main
```

Substitua `SEU_USUARIO` e `NOME_DO_REPO`.

### Twitch embed

O player do Twitch exige o domínio (`parent`) igual ao host onde o site roda. Em produção, use um domínio estável; em desenvolvimento, `localhost` funciona para testes locais.

## Licença

MIT
