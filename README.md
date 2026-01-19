<div align="center">
  <img src="./public/logo.svg" alt="Doro logo" width="120" height="120" />
  <h1>Doro</h1>
</div>

An AI product prototyping platform inspired by Lovable. Turn natural-language prompts into runnable Next.js fragments, with iterative chat, code snapshots, live previews, and multi-project management.

## Features

- Conversation-driven build flow; user messages trigger generation
- Inngest + Agent Kit orchestration; results are persisted and revisitable
- E2B Sandbox runs code fragments with embedded iframe preview
- Fragment cards for preview switching, refresh, copy link, and open in new tab
- Full-stack stack: Next.js App Router + tRPC + TanStack Query
- Prisma + Postgres for projects, messages, and fragment persistence
- Resizable split workspace optimized for chat + preview

## Core Flow

1. User creates a project or sends a message
2. tRPC writes the message and triggers an Inngest event
3. The agent generates code and a summary in E2B Sandbox
4. The result is stored as a Fragment and is previewable
5. The UI polls for updates; selecting a Fragment shows it live

## Tech Stack

- Frontend: Next.js 16 (App Router), React 19, Tailwind CSS, Shadcn UI
- Data: Prisma, PostgreSQL
- Orchestration: tRPC, TanStack Query
- AI Runtime: Inngest Agent Kit, Anthropic models, E2B Sandbox

## Quick Start

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file with:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB_NAME"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ANTHROPIC_API_KEY="your-anthropic-api-key"
ANTHROPIC_API_BASE_URL="https://api.anthropic.com" # Optional: proxy or private gateway
E2B_API_KEY="your-e2b-api-key"
```

If you use Inngest Cloud, also add the required signature/event keys.

### 3) Initialize the database

```bash
npx prisma migrate dev
```

### 4) Start the dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

### 5) (Optional) Start Inngest Dev Server

```bash
npx inngest-cli dev -u http://localhost:3000/api/inngest
```

## Project Structure

```
src/
  app/                     # Next.js App Router
  inngest/                 # Inngest client & functions
  modules/
    messages/              # Message tRPC + UI
    projects/              # Project tRPC + UI
  trpc/                    # tRPC setup and client
prisma/                    # Prisma schema & migrations
public/                    # Static assets
```

## Scripts

```bash
npm run dev      # Local development
npm run build    # Production build
npm run start    # Production server
npm run lint     # Lint checks
```

## Contributing

Issues and PRs are welcome. Let’s make Doro a truly usable Lovable alternative.
