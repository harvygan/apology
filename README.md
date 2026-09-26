# Personal Romantic Web Project

A responsive, framework-free digital love letter built with HTML, CSS, and vanilla JavaScript.

## Run locally

This repository does not currently contain a Laravel installation or Node build setup: there is no `composer.json`, `package.json`, `routes/`, `resources/`, or `public/` directory. The existing project is a static site, so no `composer install` or `npm install` is required.

From the project folder, run either:

```bash
python -m http.server 8000
```

or, if you prefer PHP's built-in server:

```bash
php -S 127.0.0.1:8000
```

Then open <http://127.0.0.1:8000>.

Opening `index.html` directly also works for the local photos. A local server is recommended because browser autoplay policies work more predictably over HTTP.

## What is included

- Purple/lavender editorial love-letter design with responsive navigation.
- Story-style photo viewer with timed progression, touch swipes, keyboard arrows, captions, and a blurred photo backdrop.
- Bento memory gallery with an accessible lightbox.
- “Things I love about you” cards, aged-paper letter, relationship timeline, and final message reveal.
- Floating controller for the local “Libu-libong Buwan” MP3; autoplay is attempted, with a play/pause and mute/unmute fallback.
- Scroll reveals, gentle image transitions, and `prefers-reduced-motion` support.

## Photos

The original folder `assets/images/hd her/` is preserved. A curated set of copied, web-friendly names lives in `assets/images/her/` and is used by `index.html`; the original photos are not overwritten.

## Music

The site uses `assets/music/lbu-libong.mp3`. Browsers may still require a tap before sound starts, so the opening “Begin ♡” button also starts the track.
