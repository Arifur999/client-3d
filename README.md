# Keturah Hamilton: scroll banner

Next.js site with a single scroll-animated hero banner.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

Push this folder to GitHub and import it in Vercel (framework: Next.js, no settings needed),
or run `npx vercel` inside the folder.

## Changing the video frames

All frames live in `public/frames`. Delete the old images and drop in the new ones
(JPG/PNG/WebP, any names such as `ezgif-frame-001.jpg`). They are sorted by name and
counted automatically at build time, so no code change is needed.

## Tweaks

- Animation speed: `.scroll-banner { height: 420vh; }` in `src/app/globals.css`
  (higher = slower).
- When the text appears: the constants at the top of `src/components/ScrollBanner.tsx`.
