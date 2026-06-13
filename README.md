# THEEE BURGER

Flame-grilled burger website for San Jose, CA. Built with [Astro](https://astro.build), deployed on Cloudflare Pages, with a free git-based CMS for editing text and images.

**Slogan:** Burger? Right here.

---

## 1. Run it locally

You need [Node.js](https://nodejs.org) 18+ installed.

```bash
npm install      # install dependencies (first time only)
npm run dev      # start the site at http://localhost:4321
```

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit — THEEE BURGER"
git branch -M main
git remote add origin https://github.com/<your-username>/theee-burger.git
git push -u origin main
```

> If you downloaded this as a zip, just unzip it first, then run the commands above inside the folder.

## 3. Deploy on Cloudflare Pages

1. Go to the Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick your `theee-burger` repo.
3. Build settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Save & Deploy. Every `git push` now redeploys automatically.

---

## 4. Editing content (the CMS)

All page text and images live in `src/data/*.json`. You can edit them two ways:

### Option A — Local editing (easiest, no login)

```bash
npm run cms      # terminal 1: starts the local CMS backend
npm run dev      # terminal 2: starts the site
```

Open **http://localhost:4321/admin** — edit text, swap images, hit publish. Changes save straight to the files. Then `git commit` + `git push` to put them live.

### Option B — Edit from the web (after deploy)

To edit at `https://your-site.pages.dev/admin` from anywhere, Decap CMS needs to log in to GitHub. Quickest free route:

1. Edit `public/admin/config.yml` and set `repo:` to `your-username/theee-burger`.
2. Set up a GitHub OAuth app + a tiny auth worker (Cloudflare Workers). Follow Decap's guide: <https://decapcms.org/docs/github-backend/>. There's a one-click Cloudflare Worker for this here: <https://github.com/sterlingv/decap-proxy> (or search "decap cms cloudflare oauth worker").
3. Once connected, visit `/admin`, log in with GitHub, and edits commit to your repo (which auto-deploys).

Until you do step 2, the web `/admin` won't log in — but **Option A works right now** with zero setup.

---

## Project structure

```
public/
  images/          all photos (this is the CMS media library)
  admin/           the CMS (index.html + config.yml)
  favicon.svg
src/
  data/            ← editable content (home, menu, about, locations, order, site)
  components/      Header, Footer, ScrollBurger (hero), MenuCard
  layouts/Base.astro
  pages/           index, menu, about, locations, order
  styles/global.css
```

## What's where

- **Logo animation** (stretching red E's): `src/components/Header.astro`
- **Scroll-open burger hero:** `src/components/ScrollBurger.astro`
- **Order-to-your-table page:** `src/pages/order.astro` (no payments — check is brought to the table)
- **Prices, menu items:** `src/data/menu.json` and `src/data/order.json`
- **Address & hours:** `src/data/locations.json`

## Notes

- Images were exported transparent (burger layers + drinks). If you replace one via the CMS, upload a PNG with a real transparent background for those.
- The map on the Locations page uses a free Google Maps embed — change the address in `src/data/locations.json`.
