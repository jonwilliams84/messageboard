# messageboard

A self-hosted, browser-based message board / signage display.

- `/` — full-screen display: stacked colored text rows, or a full-screen photo.
- `/admin` — edit lines, colors, photos. Live preview. Saves push to the display in real time.

## Stack

| Layer    | Tech                                                        |
| -------- | ----------------------------------------------------------- |
| Frontend | Vite + React 19 + TypeScript + styled-components            |
| Backend  | Hono on Node 22, better-sqlite3, file-system image storage  |
| Updates  | Server-Sent Events (with polling fallback)                  |
| Build    | Multi-stage Docker, ~150 MB final image, single port (8080) |
| CI       | GitLab CI + GitHub Actions (typecheck, build, image push)   |

## Run with Docker

```bash
docker compose up --build
# open http://localhost:8080         (display)
# open http://localhost:8080/admin   (admin)
```

Set an admin password (omit it to leave admin open in dev):

```bash
ADMIN_PASSWORD=hunter2 docker compose up --build
```

State (SQLite) and uploaded images persist in the `messageboard-data` volume.

## Run locally without Docker

```bash
# in one terminal
cd api && npm install && npm run dev

# in another
cd web && npm install && npm run dev
# open http://localhost:5173
```

The web dev server proxies `/api/*` to `http://localhost:42069`.

## Configuration

| Env var          | Default                    | Notes                                                        |
| ---------------- | -------------------------- | ------------------------------------------------------------ |
| `PORT`           | `42069` dev / `8080` Docker| API + static port                                            |
| `ADMIN_PASSWORD` | _(empty = no auth)_        | Password for the admin UI's login form                       |
| `API_KEY`        | _(empty = disabled)_       | Static bearer token for scripts. Skips the login dance.      |
| `DB_PATH`        | `./data/messageboard.db`   | SQLite file location                                         |
| `IMAGE_DIR`      | `./data/images`            | Directory for uploaded images                                |
| `STATIC_DIR`     | `../web/dist`              | Where the built SPA lives (Docker overrides)                 |

If neither `ADMIN_PASSWORD` nor `API_KEY` is set, all mutating endpoints
are open — fine for dev, never do that on a public host. Setting either
one (or both) requires every write to carry a bearer token. They're
independent: `ADMIN_PASSWORD` gates the UI login flow; `API_KEY` is
accepted directly as a bearer token for non-interactive callers.

## API

| Method | Path                  | Auth | Description                                              |
| ------ | --------------------- | ---- | -------------------------------------------------------- |
| GET    | `/api/state`          | no   | Current board state                                      |
| POST   | `/api/state`          | yes  | Update board state (strict line shape, partial merge)    |
| GET    | `/api/state/events`   | no   | SSE stream of state updates                              |
| POST   | `/api/messages`       | yes  | Update via shorthand line shape (string or partial obj)  |
| GET    | `/api/images`         | no   | List uploaded image filenames                            |
| GET    | `/api/images/:name`   | no   | Serve one image                                          |
| POST   | `/api/images`         | yes  | Multipart upload (field: `file`)                         |
| DELETE | `/api/images/:name`   | yes  | Remove an uploaded image                                 |
| GET    | `/api/auth/config`    | no   | `{ required: boolean }`                                  |
| POST   | `/api/auth/login`     | no   | Body `{ password }` → `{ token }`                        |
| GET    | `/api/health`         | no   | Liveness check                                           |

### Scripting

Set an `API_KEY` and pass it as a bearer token. No login round-trip needed.

```bash
# minimal: two lines of plain text
curl -s http://board.local:8080/api/messages \
  -H "authorization: Bearer $API_KEY" \
  -H 'content-type: application/json' \
  -d '{"lines":["BUILD #4231","PASSED"]}'
```

```bash
# everything: per-line styling, gradient, texture, animation
curl -s http://board.local:8080/api/messages \
  -H "authorization: Bearer $API_KEY" \
  -H 'content-type: application/json' \
  -d '{
    "lines":[
      {"text":"DEPLOY","color":"#22ff88","textEffect":"glow"},
      {"text":"v1.4.2","font":"Anton"}
    ],
    "background":{"type":"linear","from":"#001a2c","to":"#000","angle":180},
    "texture":"clouds",
    "animation":"shimmer",
    "defaultFont":"Bebas Neue",
    "defaultTextEffect":"shadow"
  }'
```

The shorthand line shape on `/api/messages`:

```ts
type ShorthandLine =
  | string                                // plain text, all defaults
  | {
      text: string;                       // required
      color?: string | null;              // hex, e.g. "#ff0000"
      font?: string | null;               // "Bebas Neue" | "Anton" | "Oswald"
                                          // | "Bungee" | "Permanent Marker" | "Lobster"
      textEffect?: "none" | "shadow"      // null = inherit board default
                  | "emboss" | "engrave"
                  | "outline" | "glow" | null;
    };
```

Other top-level fields on both `/api/state` and `/api/messages`:

```ts
{
  background?: { type: "solid",  color: string }
             | { type: "linear", from: string, to: string, angle: number }
             | { type: "radial", from: string, to: string };
  texture?: "none" | "dots" | "stripes" | "grid" | "noise"
          | "paper" | "fabric" | "clouds" | "tarmac";
  animation?: "none" | "pan" | "pulse" | "shimmer";
  defaultFont?: string;
  defaultTextEffect?: TextEffect;
  photoMode?: boolean;
  imageName?: string | null;
}
```

`/api/state` requires the strict line shape (with `id`); `/api/messages`
accepts the shorthand and generates IDs for you. Both merge a partial
body onto the current state — fields you don't include are left as-is.

To watch updates from a script, `curl -N` the SSE stream:

```bash
curl -N http://board.local:8080/api/state/events
# event: state
# data: {"lines":[...],"background":{...}, ...}
```

If you only have `ADMIN_PASSWORD` set (no `API_KEY`), exchange it for a
session token first:

```bash
TOKEN=$(curl -s http://board.local:8080/api/auth/login \
  -H 'content-type: application/json' \
  -d "{\"password\":\"$ADMIN_PASSWORD\"}" | jq -r .token)
# then use $TOKEN as the bearer
```

## Project layout

```
api/   Hono API + SQLite + image storage + serves built SPA
web/   Vite + React 19 SPA (Display, Admin, Login)
Dockerfile          multi-stage build → single runtime image
docker-compose.yml  one-command local deploy
.gitlab-ci.yml      typecheck + build for both packages; kaniko image
                    push to $CI_REGISTRY_IMAGE on the default branch
.github/workflows/  same jobs on GitHub Actions; pushes image to GHCR
                    on main (kept in case the repo goes public there)
```
