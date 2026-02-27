# Cloud-based HPC Mockup

A clickable mockup web app for a Cloud-based HPC portal with a dark UI.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (e.g. http://localhost:5173).

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

## Docker

Build the image:

```bash
docker build -t hpc-mockup .
```

Run the container (serves the app on port 8080):

```bash
docker run -p 8080:80 hpc-mockup
```

Open http://localhost:8080 in your browser.
