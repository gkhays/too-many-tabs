document.addEventListener('DOMContentLoaded', () => {
  const actionBtn = document.getElementById('actionBtn');
  const modeRadios = document.querySelectorAll('input[name="mode"]');

  modeRadios.forEach(radio => radio.addEventListener('change', onModeChange));
  actionBtn.addEventListener('click', onAction);
});

function onModeChange() {
  const isImport = document.getElementById('modeImport').checked;
  document.getElementById('exportOptions').classList.toggle('hidden', isImport);
  document.getElementById('importOptions').classList.toggle('hidden', !isImport);
  document.getElementById('actionBtn').textContent = isImport ? 'Import URLs' : 'Export URLs';
  document.getElementById('status').textContent = '';
  document.getElementById('status').className = 'status-area';
  document.getElementById('formatPreview').textContent = '';
}

function onAction() {
  if (document.getElementById('modeImport').checked) {
    importTabs();
  } else {
    exportTabs();
  }
}

async function exportTabs() {
  const actionBtn = document.getElementById('actionBtn');
  const selectedOnlyCheckbox = document.getElementById('selectedOnly');
  const addTitleCheckbox = document.getElementById('addTitle');
  const statusArea = document.getElementById('status');
  const formatPreview = document.getElementById('formatPreview');

  // Disable button and clear previous status
  actionBtn.disabled = true;
  statusArea.textContent = '';
  statusArea.className = 'status-area';
  formatPreview.textContent = '';

  try {
    // Query all tabs in the current window
    const tabs = await chrome.tabs.query({ currentWindow: true });

    if (tabs.length === 0) {
      showStatus('No tabs found in the current window.', 'info');
      actionBtn.disabled = false;
      return;
    }

    // Optionally narrow to tabs selected in the tab strip (Cmd/Ctrl+Click)
    const tabsToExport = selectedOnlyCheckbox.checked
      ? tabs.filter(tab => tab.highlighted)
      : tabs;

    if (tabsToExport.length === 0) {
      showStatus('No selected tabs found in the current window.', 'info');
      actionBtn.disabled = false;
      return;
    }

    // Collect exportable tabs in tab order
    const exportableTabs = tabsToExport.filter(tab => tab.url && isExportableUrl(tab.url));

    const outputLines = exportableTabs.map(tab => {
      if (!addTitleCheckbox.checked) {
        return tab.url;
      }

      const title = tab.title ? escapeMarkdownText(tab.title) : tab.url;
      return `[${title}](${tab.url})`;
    });

    if (outputLines.length === 0) {
      showStatus('No exportable URLs found in the current window.', 'info');
      actionBtn.disabled = false;
      return;
    }

    // Format output: one item per line
    const output = outputLines.join('\n');

    // Copy to clipboard
    await navigator.clipboard.writeText(output);

    // Show success message
    showStatus(`✓ Copied ${outputLines.length} URL${outputLines.length !== 1 ? 's' : ''} to clipboard`, 'success');
    formatPreview.textContent = addTitleCheckbox.checked
      ? 'Format: Markdown [title](url)'
      : 'Format: Plain URL per line';
    actionBtn.disabled = false;
  } catch (error) {
    console.error('Export failed:', error);
    showStatus(`Error: Failed to copy to clipboard. Please try again.`, 'error');
    formatPreview.textContent = '';
    actionBtn.disabled = false;
  }
}

async function importTabs() {
  const actionBtn = document.getElementById('actionBtn');
  const raw = document.getElementById('importInput').value;

  actionBtn.disabled = true;
  showStatus('', '');

  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    showStatus('No URLs found. Paste at least one URL or Markdown link.', 'info');
    actionBtn.disabled = false;
    return;
  }

  const urls = lines.map(parseUrl).filter(Boolean);
  if (urls.length === 0) {
    showStatus('No valid URLs found in the input.', 'error');
    actionBtn.disabled = false;
    return;
  }

  let opened = 0;
  for (const url of urls) {
    try {
      await chrome.tabs.create({ url, active: false });
      opened++;
    } catch (err) {
      console.warn('Could not open tab for:', url, err);
    }
  }

  showStatus(`\u2713 Opened ${opened} tab${opened !== 1 ? 's' : ''}`, 'success');
  document.getElementById('formatPreview').textContent = '';
  actionBtn.disabled = false;
}

// Extract URL from a plain URL or a Markdown link: [text](url)
function parseUrl(line) {
  const mdMatch = line.match(/\[.*?\]\((.+?)\)/);
  const candidate = mdMatch ? mdMatch[1].trim() : line;
  try {
    const parsed = new URL(candidate);
    // Only allow http and https schemes
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return candidate;
    }
  } catch {
    // not a valid URL
  }
  return null;
}

function escapeMarkdownText(text) {
  return text.replace(/[\\[\]()`*_|]/g, '\\$&');
}

function isExportableUrl(url) {
  // Check if URL is valid and exportable
  // Exclude chrome:// and chrome-extension:// URLs
  if (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url === 'about:blank'
  ) {
    return false;
  }
  return true;
}

function showStatus(message, type) {
  const statusArea = document.getElementById('status');
  statusArea.textContent = message;
  statusArea.className = `status-area ${type}`;
}
