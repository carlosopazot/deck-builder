# MTG Deck Builder

A full-stack Magic: The Gathering deck builder built with Next.js 16 App Router, TypeScript, and Ant Design.

## Features

- **Authentication** – Register/login with bcrypt-hashed passwords and httpOnly cookie sessions
- **Deck Management** – Create, view, edit, and delete decks stored in local JSON files
- **Card Search** – Live search powered by the [Scryfall API](https://scryfall.com/docs/api) with debouncing
- **Card Grouping** – Cards organized by type: Commander, Creatures, Instants, Sorceries, Lands, etc.
- **Format Validation** – Enforces deck size rules (Standard/Modern 60+, Commander exactly 100, etc.)
- **Cover Images** – Upload a cover image for each deck
- **Dark Theme** – Ant Design v6 dark theme with purple accent

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Ant Design v6** with `@ant-design/nextjs-registry` for SSR support
- **bcryptjs** for password hashing
- **uuid** for generating IDs
- **Scryfall API** for card data

## Project Structure

```
app/               # Next.js App Router pages and API routes
components/        # Shared UI components (NavBar, DeckCard, CardSearchInput, etc.)
features/          # Feature-scoped components (auth forms, deck form)
hooks/             # Custom React hooks
lib/               # Server-side utilities (JSON file storage)
services/          # External API clients (Scryfall)
types/             # Shared TypeScript types
data/              # Runtime JSON data files (gitignored)
```
