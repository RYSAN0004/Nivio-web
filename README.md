# NIVIO — Website

A production-ready, fully responsive marketing site for **NIVIO**, built with plain HTML5, CSS3 and vanilla JavaScript (ES6+). No frameworks, no build step, no dependencies.

---

## ✨ Features

- Dark, premium UI with an electric-blue accent and subtle glow effects
- Sticky, blurring navbar with a smooth sliding active-link indicator
- Animated hero: canvas particle field, aurora blobs, mouse parallax, scroll-linked progress bar
- Scroll-reveal animations (fade + slide) via `IntersectionObserver`
- Animated counters, timeline scroll-fill, magnetic buttons, ripple effects
- Accessible modal dialogs for product details, Privacy Policy and Terms
- Keyboard-accessible FAQ accordion (8 questions)
- Client-side validated contact form
- Full SEO setup: meta tags, Open Graph, Twitter Cards, Schema.org `Organization` JSON-LD, canonical URL, `robots.txt`, `sitemap.xml`
- PWA-ready `manifest.json` + icon set
- Fully responsive — no layout shift, no overflow, tested down to 320px width
- Respects `prefers-reduced-motion`

---

## 📁 Project Structure

```
nivio/
├── index.html
├── manifest.json
├── robots.txt
├── sitemap.xml
├── favicon.ico
├── README.md
├── assets/
│   ├── icons/
│   │   ├── favicon.svg
│   │   ├── apple-touch-icon.png
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   └── images/
│       └── og-cover.png
├── css/
│   └── style.css
└── js/
    └── script.js
```

---

## 🚀 Deployment

This project needs **zero build steps** — it's static HTML/CSS/JS.

### Netlify
1. Drag the unzipped `nivio/` folder onto the Netlify dashboard, **or**
2. Push to a GitHub repo and connect it in Netlify → no build command, publish directory `/`.

### Vercel
1. Push to GitHub.
2. Import the repo in Vercel. Framework preset: **Other**. Build command: none. Output directory: `/`.

### GitHub Pages
1. Push this project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Set source to the `main` branch, root folder (`/`).
4. Your site will be live at `https://<username>.github.io/<repo>/`.

> If deploying to a GitHub Pages **project** page (not a custom domain), update the absolute paths (`/css/style.css`, `/js/script.js`, `/manifest.json`, `/assets/...`) in `index.html` to relative paths, or add a `<base href="/<repo-name>/">` tag — otherwise assets will 404 under the `/repo-name/` subpath.

---

## 🖼️ Replacing Logo & Product Images

This build ships with a custom SVG monogram mark (used in the navbar, hero, footer and favicon) and simple line-icon glyphs for each product card, since it was generated without live network access to fetch external image URLs.

To use your actual PNG logos instead:

1. Drop your image files into `assets/images/` (e.g. `nivio-logo.png`, `omniverse-logo.png`, `focuz-logo.png`, `stayon-logo.png`, `founder-photo.png`).
2. In `index.html`, replace the inline `<svg>` blocks (search for `nav-logo`, `hero-logo`, `product-logo`, `founder-photo`) with `<img>` tags pointing to your files, e.g.:
   ```html
   <img src="/assets/images/omniverse-logo.png" alt="Omniverse logo" width="30" height="30" loading="lazy">
   ```
3. For the founder photo, replace the placeholder `.founder-photo` div content with an `<img>` tag and keep the `loading="lazy"` attribute for performance.
4. Regenerate `assets/images/og-cover.png` (1200×630) with your real logo if you want it in social share previews.

---

## 🎨 Customization

- **Colors / theme**: all design tokens live at the top of `css/style.css` inside `:root` (`--bg`, `--accent`, etc).
- **Fonts**: Space Grotesk (display) + Inter (body), loaded from Google Fonts in `index.html`.
- **Content**: all copy lives directly in `index.html` — no CMS or data files.
- **Contact form**: currently simulates a submission client-side. Wire it to a real backend (Formspree, Netlify Forms, a serverless function, etc.) by updating the `fetch`/submit logic in `js/script.js`.

---

## ✅ Lighthouse Targets

Built to hit **95+ Performance / 100 Accessibility / 100 Best Practices / 100 SEO**:
- No render-blocking heavy assets; fonts use `display=swap`
- Images use `loading="lazy"` where applicable and are served at appropriate sizes
- Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`)
- All interactive elements are keyboard accessible with visible focus states
- Color contrast meets WCAG AA against the dark background
- `prefers-reduced-motion` is respected throughout

---

## 📄 License

© 2023–2026 NIVIO. All Rights Reserved.

---

## 📬 Contact

- Email: iamrysan@gmail.com
- Instagram: [@_adiityagoswami](https://instagram.com/_adiityagoswami)
