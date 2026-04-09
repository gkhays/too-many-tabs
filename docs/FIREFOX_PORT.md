# Proposal: Make Too Many Tabs Available on Firefox

## Executive Summary

Level of effort is **Low to Medium**.

- **Engineering effort (core work): 1 to 2 days**
- **QA and cross-browser verification: 0.5 to 1 day**
- **AMO packaging/submission and review buffer: 2 to 7+ calendar days** (mostly waiting)

Because this extension is popup-only and already simple (no background service worker logic, no build pipeline, limited permissions), most work is compatibility hardening and release packaging.

## Current-State Assessment

Based on the current codebase:

- Manifest uses MV3 and basic permissions (`tabs`, `clipboardWrite`)
- Runtime logic is in popup script only
- Uses `chrome.tabs.query`, `chrome.tabs.create`, and `navigator.clipboard.writeText`
- URL filtering currently excludes Chrome/Edge internal URLs but not Firefox internal URLs

Overall, architecture is favorable for Firefox support.

## Proposed Scope

1. Add Firefox-targeted manifest metadata and packaging guidance.
2. Add light API-compatibility guardrails where needed.
3. Update URL export filtering for Firefox-specific internal pages.
4. Add a Firefox test checklist and run manual validation.
5. Prepare AMO submission package and release notes.

## Technical Gaps and Changes

### 1. Manifest updates for Firefox distribution

Recommended additions in Firefox package manifest:

- `browser_specific_settings.gecko.id`
- `browser_specific_settings.gecko.strict_min_version`

Notes:

- Keep permissions minimal.
- Re-validate whether `clipboardWrite` is needed in Firefox for popup user-gesture clipboard writes. If not required, remove for least-privilege.

### 2. Internal URL filtering parity

Current export filter excludes:

- `chrome://`
- `chrome-extension://`
- `edge://`
- `about:blank`

Add Firefox internal URL exclusions:

- `about:` pages (at least `about:blank`, plus other `about:*` pages that are not useful for export)
- `moz-extension://`

This prevents confusing export output and keeps behavior aligned across browsers.

### 3. API compatibility check

Firefox supports WebExtensions APIs and usually supports `chrome.*` compatibility aliases, but verify:

- `tabs.query` highlighted selection behavior
- `tabs.create` with background tab open
- Clipboard write behavior from popup click event

If needed, add a tiny browser API wrapper:

- Prefer `browser` when available, fallback to `chrome`

Likely optional for this project, but useful for resilience.

### 4. Documentation and release process

Add/adjust docs for:

- Local Firefox install (temporary add-on)
- Packaging zip for AMO
- Known behavior differences (if any)

## Effort Estimate

### Engineering LOE

1. Manifest and compatibility changes: **2 to 4 hours**
2. URL filter hardening and minor code adjustments: **1 to 2 hours**
3. Documentation updates: **1 to 2 hours**

Subtotal engineering: **4 to 8 hours**

### QA LOE

Manual regression on export/import modes and options:

- Export all tabs
- Export selected tabs only
- Markdown title export
- Import plain URLs and Markdown links
- Internal URL skip behavior
- Clipboard failure/success handling

QA estimate: **3 to 6 hours**

### Distribution LOE

AMO listing metadata, screenshots, and submission:

- Prep and submit: **1 to 2 hours**
- Review lead time: **2 to 7+ calendar days**

## Delivery Plan

### Phase 1: Compatibility implementation (same day)

1. Introduce Firefox-specific manifest variant or build-time manifest transform.
2. Update URL filtering for Firefox internal schemes/pages.
3. Validate popup behavior in latest Firefox release.

### Phase 2: QA and documentation (same day)

1. Execute manual test checklist.
2. Record any browser-specific behavior differences.
3. Update README/docs install instructions.

### Phase 3: Publish (day 2, plus review wait)

1. Create signed zip package for AMO.
2. Submit listing and respond to review feedback.

## Risks and Mitigations

1. Clipboard permission/gesture behavior differences.
   - Mitigation: Validate user-gesture path early; add fallback error messaging.
2. Manifest policy mismatch during AMO review.
   - Mitigation: Keep permissions minimal and provide clear add-on purpose text.
3. Minor API behavior differences for selected tab export.
   - Mitigation: Add explicit Firefox regression checks for highlighted tabs.

## Recommendation

Proceed now. This is a small, contained effort with low technical risk.

For planning purposes, treat this as:

- **1 engineering day** to implement and self-test
- **0.5 day** for QA/docs polish
- **external AMO review time** before public availability

Net result: Firefox support is feasible with a modest investment and minimal architectural change.