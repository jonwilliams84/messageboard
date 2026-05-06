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
| CI       | GitHub Actions (typecheck, build, image push to GHCR)       |

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

| Env var          | Default                    | Notes                                       |
| ---------------- | -------------------------- | ------------------------------------------- |
| `PORT`           | `42069` dev / `8080` Docker| API + static port                           |
| `ADMIN_PASSWORD` | _(empty = no auth)_        | Required to call mutating endpoints         |
| `DB_PATH`        | `./data/messageboard.db`   | SQLite file location                        |
| `IMAGE_DIR`      | `./data/images`            | Directory for uploaded images               |
| `STATIC_DIR`     | `../web/dist`              | Where the built SPA lives (Docker overrides)|

## API

| Method | Path                  | Auth | Description                       |
| ------ | --------------------- | ---- | --------------------------------- |
| GET    | `/api/state`          | no   | Current board state               |
| POST   | `/api/state`          | yes  | Replace board state               |
| GET    | `/api/state/events`   | no   | SSE stream of state updates       |
| GET    | `/api/images`         | no   | List uploaded image filenames     |
| GET    | `/api/images/:name`   | no   | Serve one image                   |
| POST   | `/api/images`         | yes  | Multipart upload (field: `file`)  |
| DELETE | `/api/images/:name`   | yes  | Remove an uploaded image          |
| GET    | `/api/auth/config`    | no   | `{ required: boolean }`           |
| POST   | `/api/auth/login`     | no   | Body `{ password }` → `{ token }` |
| GET    | `/api/health`         | no   | Liveness check                    |

## Project layout

```
api/   Hono API + SQLite + image storage + serves built SPA
web/   Vite + React 19 SPA (Display, Admin, Login)
Dockerfile          multi-stage build → single runtime image
docker-compose.yml  one-command local deploy
.github/workflows/  typecheck, build, image push to GHCR on main
```
