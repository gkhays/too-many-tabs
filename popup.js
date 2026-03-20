document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('exportBtn');
  const statusArea = document.getElementById('status');

  exportBtn.addEventListener('click', exportTabs);
});

async function exportTabs() {
  const exportBtn = document.getElementById('exportBtn');
  const selectedOnlyCheckbox = document.getElementById('selectedOnly');
  const statusArea = document.getElementById('status');

  // Disable button and clear previous status
  exportBtn.disabled = true;
  statusArea.textContent = '';
  statusArea.className = 'status-area';

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

    // Collect URLs in tab order
    const urls = tabsToExport
      .filter(tab => tab.url && isExportableUrl(tab.url))
      .map(tab => tab.url);

    if (urls.length === 0) {
      showStatus('No exportable URLs found in the current window.', 'info');
      exportBtn.disabled = false;
      return;
    }

    // Format output: one URL per line
    const output = urls.join('\n');

    // Copy to clipboard
    await navigator.clipboard.writeText(output);

    // Show success message
    showStatus(`✓ Copied ${urls.length} URL${urls.length !== 1 ? 's' : ''} to clipboard`, 'success');
    exportBtn.disabled = false;
  } catch (error) {
    console.error('Export failed:', error);
    showStatus(`Error: Failed to copy to clipboard. Please try again.`, 'error');
    exportBtn.disabled = false;
  }
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
