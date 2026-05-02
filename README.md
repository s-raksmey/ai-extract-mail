# AI Next Demo

A simple Next.js AI chat interface.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Without API key

The UI still works and returns demo responses.

## With Gemini API

Add your key in `.env.local`:

```env
GEMINI_API_KEY=your_key
```

Then restart:

```bash
npm run dev
```

## Main files

```txt
src/app/page.tsx
src/components/chat-ui.tsx
src/app/api/chat/route.ts
```
# ai-extract-mail
