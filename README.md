# Smart-Kid

A lightweight static web app for elementary school pupils to practice skills. Optimized for mobile devices and runs entirely in the browser.

## Structure

```
index.html          - Main entry point
styles.css          - Global styles
settings.json       - Grade/subject/script configuration
scripts/
  i18n.js           - Internationalization (EN, CS)
  app.js            - Navigation and page rendering
  math/
    algebra.js      - Addition, subtraction, multiplication, division exercise
```

## How It Works

- **Navigation** is driven by `settings.json`. Grades, subjects, and exercise scripts are configured there.
- **One script serves all grades** — the same `algebra.js` is reused across grades. Difficulty is controlled by the user via digit-range sliders.
- **Language** can be switched between English and Czech via header buttons. Translations live in `scripts/i18n.js`.
- **No build step** — pure HTML/CSS/JS, deployed as-is to GitHub Pages.

## Adding Content

1. Add a new grade/subject/script entry in `settings.json`.
2. Add translation keys in `scripts/i18n.js` for both `en` and `cs`.
3. Create the script file (must export an `init*` function that receives the container element).

## Adding a Language

Add a new object in `I18N` inside `scripts/i18n.js` and add a button in `index.html` `#lang-switcher`.

## Deployment

Automatically deployed to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. Enable GitHub Pages (source: GitHub Actions) in repository settings.

## Design Principles

- Large touch-friendly buttons
- Minimal dependencies (zero external libraries)
- Runs entirely in browser memory
- Mobile-first responsive layout
