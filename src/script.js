function parseMarketplaceUrl(url) {
  try {
    const urlObj = new URL(url);
    const itemName = urlObj.searchParams.get('itemName');

    if (!itemName) {
      throw new Error('Invalid marketplace URL. Missing itemName parameter.');
    }

    const parts = itemName.split('.');
    if (parts.length < 2) {
      throw new Error('Invalid itemName format. Expected: Publisher.ExtensionName');
    }

    const publisher = parts[0];
    const extension = parts.slice(1).join('.');

    return { publisher, extension, itemName };
  } catch (error) {
    throw new Error('Invalid URL format: ' + error.message);
  }
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  document.getElementById('resultGroup').classList.add('hidden');
}

function hideError() {
  document.getElementById('errorMessage').classList.add('hidden');
}

function showInfo(publisher, extension, version, isLoading = false) {
  const infoDiv = document.getElementById('info');
  let html = `<strong class="text-indigo-500">Publisher:</strong> ${publisher}<br><strong class="text-indigo-500">Extension:</strong> ${extension}<br>`;
  if (isLoading) {
    html += `<div class="flex items-center"><strong class="text-indigo-500">Version:</strong><span class="spinner border-blue-600 border-t-blue-300 size-3"></span>Fetching...</div>`;
  } else if (version) {
    html += `<strong class="text-indigo-500">Version:</strong> ${version}`;
  } else {
    html += `<strong class="text-indigo-500">Version:</strong> <span class="text-red-500">Not found</span>`;
  }
  infoDiv.innerHTML = html;
  infoDiv.classList.remove('hidden');
}

function clearInfo() {
  const infoDiv = document.getElementById('info');
  infoDiv.classList.add('hidden');
  infoDiv.innerHTML = '';
}

function showButtonLoading() {
  const button = document.getElementById('downloadBtn');
  button.disabled = true;
  button.innerHTML = '<span class="spinner"></span>Downloading...';
}

function hideButtonLoading() {
  const button = document.getElementById('downloadBtn');
  button.disabled = false;
  button.innerHTML = '⬇️ Download VSIX File';
}

function displayResult(link) {
  const resultGroup = document.getElementById('resultGroup');
  const downloadLinkDiv = document.getElementById('downloadLink');
  downloadLinkDiv.textContent = link;
  resultGroup.classList.remove('hidden');
}

function clearResult() {
  const resultGroup = document.getElementById('resultGroup');
  resultGroup.classList.add('hidden');
  const downloadLinkDiv = document.getElementById('downloadLink');
  downloadLinkDiv.textContent = '';
}

async function fetchLatestVersion(publisher, extension, itemName) {
  // Fetch the marketplace page to extract version
  const marketplaceUrl = `https://marketplace.visualstudio.com/items?itemName=${encodeURIComponent(itemName)}`;

  try {
    // Use CORS proxy to fetch the page
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(marketplaceUrl)}`;
    const proxyResponse = await fetch(proxyUrl);

    if (proxyResponse.ok) {
      const proxyData = await proxyResponse.json();
      const html = proxyData.contents;

      // Try to find version in the HTML - look for version patterns
      // Common patterns: "version":"1.2.3" or data-version="1.2.3" or Version: 1.2.3
      const versionPatterns = [
        /"version"\s*:\s*"([\d.]+)"/,
        /data-version\s*=\s*"([\d.]+)"/,
        /Version["\s:]+([\d.]+)/i,
        /vsextensions\/[^/]+\/([\d.]+)\//,
        /\/vsextensions\/[^/]+\/([\d.]+)\/vspackage/
      ];

      for (const pattern of versionPatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
    }
  } catch (proxyError) {
    // Proxy failed, try direct fetch (may have CORS issues)
  }

  // Fallback: Try direct fetch (may fail due to CORS)
  try {
    const response = await fetch(marketplaceUrl);
    if (response.ok) {
      const html = await response.text();
      const versionPatterns = [
        /"version"\s*:\s*"([\d.]+)"/,
        /data-version\s*=\s*"([\d.]+)"/,
        /Version["\s:]+([\d.]+)/i,
        /vsextensions\/[^/]+\/([\d.]+)\//,
        /\/vsextensions\/[^/]+\/([\d.]+)\/vspackage/
      ];

      for (const pattern of versionPatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          return match[1];
        }
      }
    }
  } catch (directError) {
    // Direct fetch failed
  }

  throw new Error('Could not extract version from marketplace page. Please check the URL.');
}

function generateDownloadUrl(publisher, extension, version) {
  return `https://marketplace.visualstudio.com/_apis/public/gallery/publishers/${publisher}/vsextensions/${extension}/${version}/vspackage`;
}

function downloadFile(url, filename) {
  // Create a link and trigger download immediately
  // Let the browser handle the download process
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

async function downloadVSIX() {
  const url = document.getElementById('marketplaceUrl').value.trim();

  if (!url) {
    showError('Please enter a marketplace URL.');
    return;
  }

  try {
    // Clear previous information
    hideError();
    clearInfo();
    clearResult();
    showButtonLoading();

    // Parse URL
    const { publisher, extension, itemName } = parseMarketplaceUrl(url);

    // Show info with loading state
    showInfo(publisher, extension, null, true);

    // Fetch latest version
    const version = await fetchLatestVersion(publisher, extension, itemName);

    // Update info with version
    showInfo(publisher, extension, version, false);

    // Generate download URL
    const downloadUrl = generateDownloadUrl(publisher, extension, version);

    // Display link
    displayResult(downloadUrl);

    // Download file immediately (let browser handle it)
    const filename = `${extension}-${version}.vsix`;
    downloadFile(downloadUrl, filename);

    // Hide loading immediately - don't wait for download to complete
    hideButtonLoading();
  } catch (error) {
    hideButtonLoading();
    showError(error.message || 'An error occurred. Please check the URL and try again.');
  }
}

function copyToClipboard() {
  const link = document.getElementById('downloadLink').textContent;

  navigator.clipboard.writeText(link).then(() => {
    const copyBtn = document.querySelector('.copy-button');
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
    copyBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
      copyBtn.classList.add('bg-green-500', 'hover:bg-green-600');
    }, 2000);
  }).catch(err => {
    showError('Failed to copy to clipboard: ' + err.message);
  });
}

// Allow Enter key to trigger download
document.getElementById('marketplaceUrl').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    downloadVSIX();
  }
});

