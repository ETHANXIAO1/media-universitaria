# 🎓 Media Universitaria

A tiny, dependency-free web app that helps Italian university students calculate
their **weighted average** (media ponderata), their **arithmetic average**
(media aritmetica), and an estimate of their **graduation mark** (voto di laurea)
on the Italian 110 scale.

No build step, no frameworks, no tracking — just plain HTML, CSS and JavaScript.
Your data stays in your browser.

> 🇮🇹 La interfaccia è in italiano perché pensata per gli studenti universitari
> italiani. Questo README è in inglese (convenzione comune per i progetti open source).

## ✨ Features

- **Weighted average** over CFU credits: `Σ(grade × CFU) / Σ(CFU)`
- **Arithmetic average** of all exam grades
- **Graduation-mark estimate** in base 110: `average × 110 / 30`
- **"30 e lode"** support (counted as 30, with a separate lode counter)
- Add / remove exams, results update live
- Data is saved locally in your browser (`localStorage`)
- Works offline, opens by simply double-clicking `index.html`

## 🚀 Use it

### Option A — just open the file

Download the project and double-click `index.html`. That's it.

### Option B — run a tiny local server (recommended for development)

If you use **VS Code**, install the *Live Server* extension and click
**"Go Live"**. Or, from a terminal in the project folder:

```bash
# Python 3
python -m http.server 8000
# then open http://localhost:8000
```

### Option C — publish it for free with GitHub Pages

1. Push this project to a public GitHub repository.
2. Go to **Settings → Pages**.
3. Under *Source*, choose the `main` branch and the `/ (root)` folder, then save.
4. After a minute your app is live at
   `https://ethanxiao1.github.io/media-universitaria/`.

## 🧪 Tests

The calculation logic lives in [`src/calc.js`](src/calc.js) and is covered by
tests in [`test/calc.test.js`](test/calc.test.js). They use Node's built-in test
runner, so **no installation is needed** — just Node.js:

```bash
npm test
# or:
node --test
```

## 📁 Project structure

```
media-universitaria/
├── index.html          # the page
├── style.css           # the look
├── src/
│   ├── calc.js         # pure calculation functions (no DOM) — easy to test
│   └── app.js          # connects the page to the calculations
└── test/
    └── calc.test.js    # automated tests for calc.js
```

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for ideas,
including a list of beginner-friendly tasks.

## 📄 License

[MIT](LICENSE) © Yuxuan Xiao
