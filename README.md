# Too Many Tabs

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-yellow?logo=google-chrome)](https://chrome.google.com/webstore)

A lightweight Chrome extension that copies the URLs from all tabs in your current browser window to your clipboard, and can also open a saved list of URLs as new tabs.

## What This Project Does

The popup operates in two modes selectable via radio buttons.

### Export mode (default)

When you click **Export URLs** the extension:

- Reads tabs from the current Chrome window
- Can limit export to only selected tabs (Cmd + Click / Ctrl + Click) when enabled
- Can format each exported URL as Markdown link syntax with title when **Add title** is enabled
- Keeps the same order as shown in the tab strip
- Includes duplicate URLs if duplicate tabs exist
- Skips non-exportable internal pages like `chrome://`, `chrome-extension://`, `edge://`, and `about:blank`
- Copies the result as plain text with one URL per line

### Import mode

When you click **Import URLs** the extension:

- Accepts a newline-delimited list of URLs pasted into the text area
- Supports plain URLs (`https://example.com`) and Markdown links (`[Example](https://example.com)`)
- Opens each valid URL as a new background tab in the current window
- Reports how many tabs were opened

This is useful for quickly sharing research links, creating a list of open resources, saving a snapshot of a browsing session, or restoring a previously exported list.

## Quick Start (Install in Chrome)

No build step is required. This project is a static Manifest V3 extension and can be loaded directly.

1. Download or clone this repository to your machine.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select this project folder (`too-many-tabs`).
6. Pin the extension from the Chrome extensions menu if desired.
7. Click the extension icon, then click **Export URLs** to copy all tab URLs.
8. Paste anywhere to verify the copied output.

To restore tabs from a saved list:

1. Click the extension icon.
2. Select **Import**.
3. Paste your list of URLs (plain or Markdown) into the text area.
4. Click **Import URLs**.

## Usage

### Exporting tabs

1. Open the Chrome window whose tabs you want to export.
2. Click the **too-many-tabs** extension icon to open the popup.
3. (Optional) Check **Only selected tabs (Cmd/Ctrl+Click)** to export just selected tabs.
4. (Optional) Check **Add title** to export each line as `[tab title](url)`.
5. Click **Export URLs**.
6. Paste into any editor, chat, or document.

If no exportable URLs are available, the popup shows an informational message.

### Importing tabs

1. Click the **too-many-tabs** extension icon.
2. Select the **Import** radio button.
3. Paste a newline-delimited list of URLs into the text area. Each line can be either:
   - A plain URL: `https://example.com`
   - A Markdown link: `[Example](https://example.com)`
4. Click **Import URLs**. Each valid URL opens as a new background tab.

## Permissions

- `tabs`: read tab URLs from the current window and open new tabs on import
- `clipboardWrite`: copy the URL list to your clipboard during export

## Project Files

- `manifest.json`: Extension metadata, permissions, and popup registration
- `popup.html`: Popup markup
- `popup.css`: Popup styles
- `popup.js`: Tab query + URL filtering + clipboard export logic
- `DESIGN.md`: Requirements and acceptance criteria

## Notes

- Works with Chrome Manifest V3.
- Internal browser pages are intentionally excluded from export.
