# Cloud-based HPC Mockup

A clickable mockup web app for a Cloud-based HPC portal with a dark UI.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

To run the app under a URL path suffix (e.g. http://localhost:5174/myapp/):

```bash
BASE_PATH=/myapp/ npm run dev
```

Then open http://localhost:5174/myapp/.

## Features

- **Left panel**: Apps (Shell, Desktop, Jupyter, RStudio) and Data (My files, Shared with me, Common data). Collapsible sidebar with search and user block.
- **Right pane**: Tabbed content. Click a left menu item to open its view in a new tab.
- **Tabs**: Reorder by drag-and-drop. Close via the × on each tab.
- **Split view**: Use the "Split" button in the tab bar to show two panes side-by-side. Click a pane to focus it, then click a tab to assign it to that pane. Drag the divider to resize.

## Build

```bash
npm run build
```

Output is in `dist/`.

To build for a URL path suffix (e.g. `/myapp/`), set `BASE_PATH` so asset URLs match your server path:

```bash
BASE_PATH=/myapp/ npm run build
```

## Docker

By default the image is built to serve the app under `/app/`. Build and run:

```bash
docker build -t hpc-mockup .
docker run -p 8080:80 hpc-mockup
```

Open http://localhost:8080/app/ in your browser.

To serve at the domain root instead of a path:

```bash
docker build --build-arg BASE_PATH=/ -t hpc-mockup .
docker run -p 8080:80 hpc-mockup
```

Open http://localhost:8080 in your browser.
