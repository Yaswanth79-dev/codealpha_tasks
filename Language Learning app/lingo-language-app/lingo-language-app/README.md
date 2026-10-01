# Lingo - Language Learning App

Dependency-free web app (HTML, CSS, vanilla JavaScript). No build step.

## Features
- Choose a language: Spanish, French or Hindi
- Categories: Vocabulary, Phrases and Grammar
- Flashcards with translation, pronunciation guide and spoken audio (browser text-to-speech)
- Simple spaced repetition: cards you know move up, cards you miss come back first
- Daily lesson: 5 items to study, then a quiz, with XP and a day streak
- Quizzes and practice tests (vocabulary, phrases, grammar, mixed) with answer feedback and review of mistakes
- Progress screen: items learned, quiz average, streak, XP, recent scores
- Progress saved in localStorage, no account needed

## Run
Open `index.html`, or `npx serve .` / `python3 -m http.server`.

## Deploy
Netlify drop (app.netlify.com/drop), GitHub Pages, or `npx vercel`.

## Add content or languages
Edit `data.js`. Vocabulary and phrases are `[word, pronunciation, English]`. Add a language by copying one block and adding an `<option>` in `index.html`.
For cross-device sync, replace `load` / `save` in `app.js` with Firebase Firestore calls.
