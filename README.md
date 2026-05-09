# Smart-Kid

A lightweight static web app for elementary school pupils to practice skills. Optimized for mobile devices and runs entirely in the browser.

## Structure

```
index.html          - Main entry point
styles.css          - Global styles
settings.json       - Grade/subject/script configuration
scripts/
  i18n.js           - Internationalization (EN, CS, SK, UK)
  app.js            - Navigation and page rendering
  math/
    arithmetic.js   - Addition, subtraction, multiplication, division exercise
  czech/
    listed_words/
      B.md          - Sentences for letter B (vyjmenovaná slova)
      L.md          - Sentences for letter L
      M.md          - Sentences for letter M
      P.md          - Sentences for letter P
      S.md          - Sentences for letter S
      V.md          - Sentences for letter V
      Z.md          - Sentences for letter Z
    listed_words.js - i/y selection exercise for Czech listed words
```

## Exercises

### Maths – Addition, Subtraction, Multiplication & Division (grades 1–3)

Configurable digit-range sliders, operator checkboxes, and a max-result cap. A seeded RNG ensures reproducible sessions. Includes a number scratchpad for working out calculations.

### Czech Language – Listed Words / Vyjmenovaná slova (grade 3)

Practices the Czech 3rd-grade grammar exercise of choosing **i** or **y** after the consonants B, L, M, P, S, V, Z. Sentences are loaded from Markdown files in `scripts/czech/listed_words/`.

**Difficulty levels:**
| Level | Gaps hidden |
|-------|-------------|
| Easy | Only i/y directly after the practised letter |
| Medium | As Easy, plus one additional random i/y from anywhere in the sentence |
| Hard | Every i/y occurrence in the sentence |

**How it works:**
- Select which letters to practice (B, L, M, P, S, V, Z checkboxes).
- Set difficulty with the slider (Easy → Medium → Hard).
- Each gap shows two buttons — **i** and **y** — to fill in the blank. Selecting a button highlights it and fills the slot.
- Click **Check** to evaluate: correct slots turn green, incorrect slots turn red and reveal the right character.
- Click **Next** to advance to the next sentence.
- Score and history track performance across the session.
- The seed controls the random sentence sequence; **⟳** regenerates a new seed.

## How It Works

- **Navigation** is driven by `settings.json`. Grades, subjects, and exercise scripts are configured there.
- **Language** can be switched between English, Czech, Slovak, and Ukrainian via header buttons. Translations live in `scripts/i18n.js`.
- **No build step** — pure HTML/CSS/JS, deployed as-is to GitHub Pages.

## Adding a New Exercise

1. Create the script file (must set `window._initScript = yourInitFunction` at the end).
2. Add an entry in `settings.json` under the appropriate grade and subject.
3. Add translation keys in `scripts/i18n.js` for all languages (`en`, `cs`, `sk`, `uk`).

## Adding a Language

Add a new object in `I18N` inside `scripts/i18n.js` and add a button in `index.html` `#lang-switcher`.

## Deployment

Automatically deployed to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`. Enable GitHub Pages (source: GitHub Actions) in repository settings.

## Design Principles

- Large touch-friendly buttons
- Minimal dependencies (zero external libraries)
- Runs entirely in browser memory
- Mobile-first responsive layout

