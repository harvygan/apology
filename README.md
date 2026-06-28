# Romantic Apology Website

A responsive, framework-free apology website built with HTML5, CSS3, and vanilla JavaScript.

## Run Locally

Open `index.html` directly in a browser, or serve the folder with any static server.

Example with Python:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Replace Placeholder Images

Gallery images are in:

```text
assets/images/
```

Replace `memory-1.svg` through `memory-6.svg` with your own photos. If you use `.jpg`, `.jpeg`, `.png`, or `.webp` files, update the matching `src` and `data-full` values in `index.html`.

## Add Background Music

Place your music file here:

```text
assets/music/background-music.mp3
```

The site does not autoplay music. Visitors must press Play.

If your file has a different name or format, update the `<source>` element in `index.html`.

## Edit The Apology Text

Open `index.html` and edit the text inside these sections:

- `#hero`
- `#apology`
- `#learned`
- `#promise`
- `#memories`
- `#reasons`
- `#final`

The main styles are in `style.css`. Colors are controlled by CSS variables near the top of the file.

## Deploy To GitHub Pages

1. Create a GitHub repository.
2. Upload all files and folders from this project.
3. In GitHub, open **Settings**.
4. Go to **Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/root`.
7. Save and wait for GitHub to publish the site.

## Deploy To Vercel

1. Go to <https://vercel.com>.
2. Create a new project.
3. Import your GitHub repository or drag-and-drop this folder.
4. Keep the framework preset as **Other**.
5. Deploy.

## Deploy To Netlify

1. Go to <https://www.netlify.com>.
2. Open **Sites**.
3. Drag this project folder into the deploy area, or import it from GitHub.
4. Leave the build command empty.
5. Set the publish directory to the project root.
6. Deploy.

## Notes

- The navigation collapses into a hamburger menu on mobile.
- Gallery images lazy-load for performance.
- The music player includes Play, Pause, Volume, and Loop controls.
- Animations respect reduced-motion browser preferences.
