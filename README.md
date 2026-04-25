# Excalidraw Clone Monorepo

A collaborative drawing application built with a Turborepo monorepo.

## Stack

- `apps/web`: Next.js 16, App Router, Tailwind CSS, local shadcn-style UI, Fabric.js
- `apps/http-backend`: Express + Prisma REST API
- `apps/ws-backend`: Socket.IO realtime server
- `packages/dataBase`: Prisma schema and database client

## Features

- Home page with Framer Motion hero
- Sign in and sign up flow
- Authenticated redirect from `/` to `/draw`
- Rooms dashboard
  - create room
  - join room
  - delete owned room
  - owner/shared room labels
- Drawing workspace at `/draw/[roomId]`
- Fabric.js tools
  - select
  - rectangle
  - circle
  - free draw
- Realtime canvas sync with WebSocket
- Canvas persistence with HTTP API
- Light and dark mode

## App Flow

1. User lands on `/`
2. If already authenticated, they are redirected to `/draw`
3. User signs in or signs up
4. User sees the rooms dashboard
5. User creates a room or joins an existing room
6. User draws inside `/draw/[roomId]`

## Monorepo Structure

```text
apps/
  web/
  http-backend/
  ws-backend/

packages/
  ui/
  common/
  backend-common/
  dataBase/
  eslint-config/
  typescript-config/
```

## Routes

### Frontend

- `/` home page
- `/signin`
- `/signup`
- `/draw` rooms dashboard
- `/draw/[roomId]` drawing workspace

### HTTP Backend

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/room`
- `GET /api/room/my`
- `GET /api/room/:roomId/canvas`
- `PUT /api/room/:roomId/canvas`
- `DELETE /api/room/:roomId`

### WebSocket Events

- `joinRoom`
- `chat`
- `leave`

The app currently uses the `chat` event to broadcast canvas snapshot messages.

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Make sure your database and backend environment variables are set.

Common places to check:

- `apps/http-backend/.env`
- Prisma/database config under `packages/dataBase`

### 3. Run development servers

Run everything:

```bash
pnpm dev
```

Or run each service separately:

```bash
pnpm dev:web
pnpm dev:http
pnpm dev:ws
```

## Useful Scripts

```bash
pnpm dev
pnpm build
pnpm lint
pnpm check-types
pnpm format
```

Turbo variants are still available:

```bash
pnpm dev:turbo
pnpm build:turbo
pnpm lint:turbo
pnpm check-types:turbo
```

## Ports

- Web: `http://localhost:3000`
- HTTP backend: `http://localhost:3002`
- WS backend: `http://localhost:8080`

## Notes

- If backend routes change, restart the HTTP backend so `dist` is rebuilt.
- Room deletion removes dependent `ChatHistory` rows before deleting the room.
- The rooms dashboard marks rooms as:
  - `Owner`: created by the current user
  - `Shared`: previously worked in by the current user

## Current Frontend Architecture

### UI

Reusable UI primitives live under:

- `apps/web/src/components/ui`

### Auth

- session storage in localStorage
- route protection for dashboard and drawing pages

### Drawing

- Fabric.js canvas controller isolated from React UI
- Zustand store for drawing session/tool state
- REST and WebSocket logic separated in dedicated client modules

## Verification

Typical checks:

```bash
pnpm check-types
pnpm lint
pnpm build
```
