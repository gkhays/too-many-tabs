# Chrome Extension Requirements Spec: Too Many Tabs

## 1. Overview

This document defines requirements for a Chrome extension that exports tab URLs from the current browser window. The v1 product is intentionally narrow: users click the extension action and copy the current window's tab URLs to the clipboard in a predictable text format.

## 2. Product Goal

Provide a fast, low-friction way to collect and share links from the current Chrome window without leaving the browser.

## 3. Scope

### 3.1 In Scope (v1)

1. Export URLs from all tabs in the current Chrome window.
2. Trigger export from the extension popup.
3. Copy exported content to clipboard as the default and only v1 output.
4. Preserve tab order exactly as shown in the current window.
5. Include duplicate URLs if duplicate tabs exist.
6. Show success or error feedback in the popup.

### 3.2 Out of Scope (v1)

1. Exporting tabs across all windows.
2. Downloading output as files (txt, csv, json).
3. Syncing data to cloud services or external integrations.
4. User-configurable formatting options.

## 4. Functional Requirements

### FR-1: Launch and Action

1. The extension must be available from the Chrome toolbar.
2. When the user opens the popup, an Export URLs action must be visible.
3. When the user clicks Export URLs, the extension must query tabs in the current window only.

### FR-2: Tab Selection Rules

1. The extension must include each tab URL that is readable and exportable.
2. The extension must keep output in the same sequence as tab order.
3. The extension must not remove duplicates in v1.

### FR-3: Clipboard Output

1. On successful export, the extension must copy results to clipboard.
2. The popup must display a success message including the number of URLs copied.

### FR-4: Error Feedback

1. If no exportable URLs are found, the extension must show a clear informational message.
2. If clipboard write fails, the extension must show an error message with retry guidance.

## 5. Output Requirements

### OR-1: Format

1. Output must be plain text.
2. Each URL must appear on its own line.
3. No header row or metadata is included in v1 output.

### OR-2: Example

Expected structure:

https://example.com/page-1
https://example.com/page-2
https://example.com/page-2

## 6. UX Requirements

### UX-1: Popup Layout

1. Popup must include a single primary action button labeled Export URLs.
2. Popup must include a status area for success, warning, or error text.

### UX-2: Interaction and Accessibility

1. Export button must be keyboard reachable and operable.
2. Focus state must be visible for interactive controls.
3. Status messages must be readable without relying on color only.

## 7. Technical Requirements

### TR-1: Platform and Manifest

1. The extension must use Chrome Extension Manifest V3.
2. Required manifest entries must include action popup configuration and needed permissions.

### TR-2: APIs and Permissions

1. The implementation must use Chrome tabs API to query current-window tabs.
2. The implementation must include permissions required to read tab URLs and write to clipboard.
3. Permissions should be minimal and limited to what v1 requires.

### TR-3: Component Responsibilities

1. Popup UI handles user interaction and status display.
2. Export logic collects URLs, formats output, and initiates clipboard copy.
3. Service worker/background logic is optional in v1 unless needed for architecture or permission flow.

## 8. Reliability and Edge Cases

1. If the current window has zero tabs, show a non-error informational message.
2. If restricted internal URLs cannot be exported, skip them and show how many were skipped.
3. If all URLs are skipped, do not report success.
4. If extension is used in incognito, behavior must follow Chrome extension incognito settings and fail gracefully when unavailable.

## 9. Acceptance Criteria

1. From any normal browser window, clicking Export URLs copies newline-delimited URLs for tabs in that window only.
2. Output order matches tab order.
3. Duplicate tabs produce duplicate lines.
4. Success feedback reports copied count.
5. Restricted URLs are skipped with user-visible notice.
6. Clipboard failures show clear error messaging.

## 10. Manual Test Scenarios

1. Basic export with 3 normal tabs returns 3 lines in clipboard.
2. Window with duplicate tabs returns duplicate lines.
3. Window with mix of exportable and restricted URLs skips restricted and reports skip count.
4. Empty or non-exportable result set shows informative non-success status.
5. Simulated clipboard denial/failure shows retryable error.

## 11. Future Enhancements (Non-v1)

1. Optional deduplicate toggle.
2. File download formats (txt, csv, json).
3. Export scope toggle (current window vs all windows).
4. Optional inclusion of tab titles with URLs.

