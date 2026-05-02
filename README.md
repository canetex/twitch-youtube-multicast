# Multicast Stream Viewer

SPA estática (**Vite + React + TypeScript + Tailwind v4**) para ver várias streams **Twitch** e **YouTube** em mosaico, sem backend.

- **Dark mode**: paleta `slate-950` / `slate-900` / `slate-800`.
- **Persistência**: `localStorage` (`multicast-stream-viewer:v1`).
- **Compartilhamento**: estado comprimido com **LZ-string** no query param **`?s=`** — quem abrir o link vê o mesmo mosaico (sem banco de dados).
- **Embeds**: apenas vídeo (sem chat).

## Rotas (HashRouter)

| Caminho | Descrição |
|--------|-----------|
| `#/` | Grade de cards por time |
| `#/team/:id` | Mosaico em grid (layout conforme quantidade de canais) |
| `#/team/:id/focus/:channelId` | ~80% vídeo principal + miniaturas na barra inferior |
| `#/edit/new` / `#/edit/:id` | Criar ou editar time e URLs |

## Scripts

```bash
npm install
npm run dev      # desenvolvimento
npm run build    # saída em dist/
npm run preview  # testar build local
npm test
```

## Deploy estático

### Netlify / qualquer CDN

Publique a pasta **`dist/`** após `npm run build`.

### GitHub Pages (projeto em `usuario.github.io/repositorio/`)

O Vite precisa do **base path** do repositório:

```bash
set VITE_BASE=/nome-do-repo/
npm run build
```

Envie o conteúdo de `dist/` para a branch `gh-pages` ou use uma Action; o site ficará em  
`https://usuario.github.io/nome-do-repo/` com rotas em hash (`#/…`).

**Twitch**: o player exige `parent` igual ao host onde o site está em produção.

## Estrutura

```
src/
  components/   Header, TeamCard, StreamGrid, StreamPlayer
  views/        Home, TeamMosaic, ChannelFocus, TeamEditor
  utils/        embedUrls.ts, urlHandler.ts (LZ), storage.ts
  context/      AppStateContext.tsx
```

## Licença

MIT
