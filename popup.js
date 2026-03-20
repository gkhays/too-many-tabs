document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');
  const statusArea = document.getElementById('status');

  exportBtn.addEventListener('click', exportTabs);
});

async function exportTabs() {
  const exportBtn = document.getElementById('exportBtn');
  const selectedOnlyCheckbox = document.getElementById('selectedOnly');
  const addTitleCheckbox = document.getElementById('addTitle');
  const statusArea = document.getElementById('status');
  const formatPreview = document.getElementById('formatPreview');

  // Disable button and clear previous status
  exportBtn.disabled = true;
  statusArea.textContent = '';
  statusArea.className = 'status-area';
  formatPreview.textContent = '';

  try {
    // Query all tabs in the current window
    const tabs = await chrome.tabs.query({ currentWindow: true });

    if (tabs.length === 0) {
      showStatus('No tabs found in the current window.', 'info');
      exportBtn.disabled = false;
      return;
    }

    // Optionally narrow to tabs selected in the tab strip (Cmd/Ctrl+Click)
    const tabsToExport = selectedOnlyCheckbox.checked
      ? tabs.filter(tab => tab.highlighted)
      : tabs;

    if (tabsToExport.length === 0) {
      showStatus('No selected tabs found in the current window.', 'info');
      exportBtn.disabled = false;
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
      exportBtn.disabled = false;
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
    exportBtn.disabled = false;
  } catch (error) {
    console.error('Export failed:', error);
    showStatus(`Error: Failed to copy to clipboard. Please try again.`, 'error');
    formatPreview.textContent = '';
    exportBtn.disabled = false;
  }
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
