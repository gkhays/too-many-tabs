# Export Tab URLs

A lightweight Chrome extension that copies the URLs from all tabs in your current browser window to your clipboard.

## What This Project Does

When you click **Export URLs** in the extension popup, the extension:

- Reads tabs from the current Chrome window
- Keeps the same order as shown in the tab strip
- Includes duplicate URLs if duplicate tabs exist
- Skips non-exportable internal pages like `chrome://`, `chrome-extension://`, `edge://`, and `about:blank`
- Copies the result as plain text with one URL per line

This is useful for quickly sharing research links, creating a list of open resources, or saving a snapshot of a browsing session.

## Quick Start (Install in Chrome)

No build step is required. This project is a static Manifest V3 extension and can be loaded directly.

1. Download or clone this repository to your machine.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode** (top-right).
4. Click **Load unpacked**.
5. Select this project folder (`tab-urls`).
6. Pin the extension from the Chrome extensions menu if desired.
7. Click the extension icon, then click **Export URLs**.
8. Paste anywhere to verify the copied output.

## Usage

1. Open the Chrome window whose tabs you want to export.
2. Click the **Export Tab URLs** extension icon.
3. Click **Export URLs** in the popup.
4. Paste into any editor, chat, or document.

If no exportable URLs are available, the popup shows an informational message.

## Permissions

The extension requests only the permissions needed for v1:

- `tabs`: read tab URLs from the current window
- `clipboardWrite`: copy the URL list to your clipboard

## Project Files

- `manifest.json`: Extension metadata, permissions, and popup registration
- `popup.html`: Popup markup
- `popup.css`: Popup styles
- `popup.js`: Tab query + URL filtering + clipboard export logic
- `DESIGN.md`: Requirements and acceptance criteria

## Notes

- Works with Chrome Manifest V3.
- Internal browser pages are intentionally excluded from export.
