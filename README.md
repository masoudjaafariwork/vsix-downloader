# VSIX Downloader

A simple web application to download VS Code extensions from the Visual Studio Marketplace.

## Features

- Download VS Code extensions as VSIX files directly from the marketplace
- Automatically fetches the latest version of the extension
- Displays extension information (publisher, extension name, version)
- Copy download link to clipboard
- Modern, responsive UI built with Tailwind CSS

## Setup

1. Install dependencies:

```bash
npm install
```

1. Build the CSS (development mode with watch):

```bash
npm run tailwind
```

Or build for production (minified):

```bash
npm run build-css-prod
```

1. Open `src/vsix-download-generator.html` in your browser.

## Usage

1. Enter a VS Code Marketplace URL in the format:
   `https://marketplace.visualstudio.com/items?itemName=Publisher.ExtensionName`

1. Click "Download VSIX File" or press Enter

1. The extension will automatically:
   - Parse the marketplace URL
   - Fetch the latest version
   - Display extension information (publisher, extension name, version)
   - Generate and display the download link
   - Download the VSIX file to your computer

1. You can also copy the download link to clipboard using the "📋 Copy Link" button.

## Development

The project uses Tailwind CSS for styling. The source CSS file is in `src/input.css` and gets compiled to `src/output.css`.

To watch for changes during development:

```bash
npm run tailwind
```

## Deployment to GitHub Pages

This project includes an automated GitHub Actions workflow that deploys the app to GitHub Pages whenever you push to the `main` branch.

### Initial Setup

1. **Enable GitHub Pages in your repository:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **GitHub Actions**
   - Save the settings

2. **Push your code:**
   - The workflow will automatically run when you push to the `main` branch
   - You can also manually trigger it from the **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

3. **Access your site:**
   - After deployment, your site will be available at:
     `https://<your-username>.github.io/<repository-name>/`
   - The deployment typically takes 1-2 minutes to complete

### Manual Deployment

If you prefer to deploy manually:

1. Build the CSS for production:
```bash
npm run build-css-prod
```

2. Copy files to a `docs/` folder or configure GitHub Pages to serve from the `src/` directory

## Project Structure

```text
VSIX Downloader/
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions workflow for deployment
├── src/
│   ├── input.css          # Tailwind CSS source file
│   ├── output.css         # Compiled CSS output
│   ├── script.js          # Main application logic
│   └── vsix-download-generator.html  # Main HTML file
├── package.json
└── README.md
```
