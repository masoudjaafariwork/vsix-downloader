# VSIX Downloader

A simple web application to download VS Code extensions from the Visual Studio Marketplace.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Build the CSS (development mode with watch):
```bash
npm run build-css
```

Or build for production (minified):
```bash
npm run build-css-prod
```

3. Open `vsix-download-generator.html` in your browser.

## Usage

1. Enter a VS Code Marketplace URL in the format:
   `https://marketplace.visualstudio.com/items?itemName=Publisher.ExtensionName`

2. Click "Download VSIX File" or press Enter

3. The extension will automatically:
   - Fetch the latest version
   - Display extension information
   - Download the VSIX file

## Development

The project uses Tailwind CSS for styling. The source CSS file is in `src/input.css` and gets compiled to `style.css`.

To watch for changes during development:
```bash
npm run build-css
```

