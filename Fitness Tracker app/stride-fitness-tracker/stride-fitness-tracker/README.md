# Stride - Fitness Tracker

A dependency-free fitness tracker web app (HTML, CSS, vanilla JavaScript). No build step.

## Features
- Log workouts manually: exercise type, minutes, steps, calories (auto-estimated if blank)
- Daily dashboard: progress rings for steps, active minutes and calories vs. your goals
- Weekly bar chart (switch between steps / minutes / calories) with goal line, streak, daily average, best day
- Browse any past day, delete entries, edit daily goals, export CSV, load sample data
- Data saved in the browser with localStorage, so it survives refreshes (no server or account)
- Responsive layout, keyboard accessible

## Run locally
Open `index.html` in a browser, or run `npx serve .` / `python3 -m http.server`.

## Deploy (free, static hosting)
- **Netlify:** drag-and-drop this folder at app.netlify.com/drop
- **GitHub Pages:** push to a repo, then Settings > Pages > deploy from `main` / root
- **Vercel:** `npx vercel` in this folder

## Files
- `index.html` structure, `style.css` styling, `app.js` logic and storage

## Extending
To sync across devices, replace `load()` / `save()` in `app.js` with Firebase Firestore reads and writes.
