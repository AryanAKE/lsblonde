# LS Blonde Unisex Salon — Guwahati

A premium, modern single-page web application for **LS Blonde Unisex Salon** located at Six Mile, Guwahati, Assam. Rated ⭐ 5.0 on Google.

🔗 **Live Site:** [aryanake.github.io/lsblonde](https://aryanake.github.io/lsblonde/)

---

## ✨ Features

### UI & Design
- **Premium Dark Aesthetic** — Gold (`#d4af37`) accent tones, glassmorphism cards, rich typography
- **Custom Interactive Cursor** — Circular cursor with context-aware labels (Book, Explore, View)
- **Scroll Progress Bar** — Thin gold progress indicator at the top of the viewport
- **Back-to-Top Button** — With circular SVG scroll progress ring animation

### Animations & Interactivity
- **Smooth Scrolling** via [Lenis](https://github.com/darkroomengineering/lenis)
- **GSAP ScrollTrigger Animations** — Hero parallax/zoom, staggered reveals, horizontal gallery scroll
- **Animated Page Loader** — Percentage counter with animated progress bar
- **Counter Animations** — Animated number counters in the hero stats section

### Content Sections
- **Hero** — Full-bleed image with dynamic open/closed status indicator
- **About** — Two overlapping images with a rotating "Top Rated" stamp
- **Services** — 5 service cards with 3D mouse-tilt effect + "And More" list with NEW badge
- **Pricing Accordion** — Collapsible price menu by category
- **Package Estimator** — Interactive cost & time calculator with checkbox selections
- **Gallery (Our Work)** — Horizontal GSAP-scrolled gallery with filter tabs & lightbox
- **Reviews Slider** — 6 auto-playing review cards with dots and touch swipe support
- **FAQ Accordion** — 6 expandable questions including student/group discounts
- **Find Us** — Contact cards + embedded Google Map + WhatsApp/Call links + social links
- **Booking Modal** — Full appointment form (name, phone, service, date, time) with success animation

### Performance & SEO
- `<link rel="preload">` for hero image
- `loading="eager"` + `fetchpriority="high"` on LCP image
- Open Graph, Twitter Card, and Schema.org (BeautySalon) structured data
- Semantic HTML5 with proper heading hierarchy and `aria-*` attributes

---

## 🛠 Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Structure & semantic markup |
| Vanilla CSS | Styling with CSS custom properties |
| JavaScript (ES6+) | All interactivity and animations |
| GSAP + ScrollTrigger | Scroll-driven animations |
| Lenis | Smooth scroll experience |

---

## 📁 Project Structure

```
lsblonde/
├── index.html         — Single-page app structure
├── style.css          — Design system, tokens, and all component styles
├── script.js          — All JS: animations, cursor, modal, gallery, calculator
├── hero.png           — Hero section image
├── haircut.png        — Haircut service image
├── hair-service.png   — Hair styling service image
├── color-treatment.png — Color treatment service image
├── facial-spa.png     — Facial & spa service image
├── bridal-makeup.png  — Bridal makeup service image
├── mens-grooming.png  — Men's grooming service image
├── salon-interior.png — Salon interior about section image
└── texture.png        — Background texture overlay
```
