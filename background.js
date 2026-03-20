const MAX_BADGE_COUNT = 99;
const BADGE_BACKGROUND_COLOR = '#2b5cff';

chrome.action.setBadgeBackgroundColor({ color: BADGE_BACKGROUND_COLOR });

async function updateBadge() {
  try {
    const tabs = await chrome.tabs.query({ lastFocusedWindow: true });
    const exportableCount = tabs.filter(tab => tab.url && isExportableUrl(tab.url)).length;
    const badgeText = getBadgeText(exportableCount);

    await chrome.action.setBadgeText({ text: badgeText });
    await chrome.action.setTitle({
      title: exportableCount > 0
        ? `Too Many Tabs (${exportableCount} exportable tab${exportableCount !== 1 ? 's' : ''})`
        : 'Too Many Tabs'
    });
  } catch (error) {
    console.error('Badge update failed:', error);
  }
}

function getBadgeText(count) {
  if (count <= 0) {
    return '';
  }

  if (count > MAX_BADGE_COUNT) {
    return `${MAX_BADGE_COUNT}+`;
  }

  return String(count);
}

function isExportableUrl(url) {
  return !(
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('edge://') ||
    url === 'about:blank'
  );
}

chrome.runtime.onInstalled.addListener(() => {
  updateBadge();
});

chrome.runtime.onStartup.addListener(() => {
  updateBadge();
});

chrome.tabs.onCreated.addListener(() => {
  updateBadge();
});

chrome.tabs.onRemoved.addListener(() => {
  updateBadge();
});

chrome.tabs.onUpdated.addListener(() => {
  updateBadge();
});

chrome.tabs.onMoved.addListener(() => {
  updateBadge();
});

chrome.tabs.onAttached.addListener(() => {
  updateBadge();
});

chrome.tabs.onDetached.addListener(() => {
  updateBadge();
});

chrome.windows.onFocusChanged.addListener(() => {
  updateBadge();
});

updateBadge();