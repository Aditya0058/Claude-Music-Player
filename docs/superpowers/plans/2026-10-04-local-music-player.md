# Local Music Player Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first, minimalist music player that persists songs in IndexedDB and plays them sequentially.

**Architecture:** A modular frontend app. `db.js` handles binary storage (IndexedDB), `player.js` manages the HTML5 Audio lifecycle and auto-play logic, and `ui.js` handles the sleek minimalist interface. `main.js` coordinates them.

**Tech Stack:** Vanilla HTML5, CSS3, JavaScript (ES6+), IndexedDB.

**Spec:** [docs/superpowers/specs/2026-10-04-local-music-player-design.md](docs/superpowers/specs/2026-10-04-local-music-player-design.md)

## Global Constraints
- **Frontend-Only:** No backend server.
- **Storage:** Use IndexedDB for Blobs (audio files).
- **Mobile-Responsive:** Must work on mobile browsers.
- **Minimalist UI:** High-contrast, clean typography, tactile animations.

## Review Focus
- **Empty Library:** UI should display a "Your library is empty" message.
- **Large Files:** Uploading >50MB files should not freeze the main thread.
- **Invalid Formats:** Non-audio files must be rejected during upload.
- **Rapid Switching:** Switching songs quickly must revoke previous Object URLs.
- **Quota Limits:** Gracefully handle `QuotaExceededError` from IndexedDB.

---

### Task 1: Basic HTML Structure & Minimalist Shell

**Files:**
- Create: `index.html`
- Create: `style.css`

**Interfaces:**
- Produces: HTML DOM elements for the player, controls, and library.

- [ ] **Step 1: Create index.html with basic layout**
  - Include containers for `#player-view`, `#library-view`, and `#controls`.
  - Link `style.css` and `js/main.js` (type="module").
- [ ] **Step 2: Implement basic Minimalist CSS**
  - Set a deep charcoal/off-white theme.
  - Define a clean sans-serif font stack.
  - Create a responsive layout (Centered player on desktop, full-width on mobile).
- [ ] **Step 3: Verify visual shell**
  - Open in browser to ensure layout is centered and responsive.
- [ ] **Step 4: Commit**
  ```bash
  git add index.html style.css
  git commit -m "feat: add basic minimalist layout shell"
  ```

### Task 2: IndexedDB Storage Layer (`db.js`)

**Files:**
- Create: `js/db.js`

**Interfaces:**
- Produces: `async function saveSong(name, blob)`, `async function getAllSongs()`, `async function deleteSong(id)`.

- [ ] **Step 1: Implement DB initialization**
  - Use `idb` patterns to create `MusicPlayerDB` with `songs` store.
- [ ] **Step 2: Implement `saveSong`**
  - Store `{ name, data: blob, addedDate: Date.now() }`.
- [ ] **Step 3: Implement `getAllSongs`**
  - Return an array of song objects.
- [ ] **Step 4: Implement `deleteSong`**
  - Remove entry by ID.
- [ ] **Step 5: Verify DB functionality via console**
  - Use browser dev tools to verify a Blob is successfully stored and retrieved.
- [ ] **Step 6: Commit**
  ```bash
  git add js/db.js
  git commit -m "feat: implement IndexedDB storage layer"
  ```

### Task 3: Audio Playback Engine (`player.js`)

**Files:**
- Create: `js/player.js`

**Interfaces:**
- Consumes: `Blob` from `db.js`.
- Produces: `loadSong(blob)`, `togglePlay()`, `playNext()`, `playPrev()`.

- [ ] **Step 1: Initialize Audio object**
  - Create a private `audio = new Audio()` instance.
- [ ] **Step 2: Implement `loadSong(blob)`**
  - Revoke previous `URL.createObjectURL` if it exists.
  - Create new URL from blob and set as `audio.src`.
- [ ] **Step 3: Implement Play/Pause/Next/Prev logic**
  - Manage the current song index relative to a provided playlist.
- [ ] **Step 4: Implement auto-play "Next" logic**
  - Add `audio.onended` listener to trigger `playNext()`.
- [ ] **Step 5: Verify audio playback in console**
  - Manually call `loadSong` with a sample blob and verify it plays.
- [ ] **Step 6: Commit**
  ```bash
  git add js/player.js
  git commit -m "feat: implement audio playback engine with auto-play"
  ```

### Task 4: UI Interaction Layer (`ui.js`)

**Files:**
- Create: `js/ui.js`

**Interfaces:**
- Consumes: Audio state from `player.js`.
- Produces: `updatePlayerUI(song)`, `updateProgress(currentTime, duration)`, `renderLibrary(songs)`.

- [ ] **Step 1: Implement progress bar update**
  - Use `requestAnimationFrame` or `timeupdate` event to move the seek bar.
- [ ] **Step 2: Implement library rendering**
  - Create a list of songs with "Delete" buttons.
- [ ] **Step 3: Implement "Add Song" file input handler**
  - Only allow audio mime-types.
- [ ] **Step 4: Implement tactile animations**
  - Add CSS transitions/transforms for button clicks.
- [ ] **Step 5: Commit**
  ```bash
  git add js/ui.js
  git commit -m "feat: implement minimalist UI interactions"
  ```

### Task 5: Orchestration & Final Integration (`main.js`)

**Files:**
- Create: `js/main.js`

**Interfaces:**
- Consumes: All functions from `db.js`, `player.js`, and `ui.js`.

- [ ] **Step 1: Connect "Add Song" UI to DB**
  - File input $\rightarrow$ `db.saveSong()` $\rightarrow$ `ui.renderLibrary()`.
- [ ] **Step 2: Connect Library items to Player**
  - Click song $\rightarrow$ `db.getSong()` $\rightarrow$ `player.loadSong()` $\rightarrow$ `ui.updatePlayerUI()`.
- [ ] **Step 3: Connect Playback Controls to Player**
  - UI Buttons $\rightarrow$ `player.togglePlay()`, `player.playNext()`, etc.
- [ ] **Step 4: Connect "Delete" button to DB & Player**
  - Delete click $\rightarrow$ `db.deleteSong()` $\rightarrow$ `ui.renderLibrary()`.
  - If deleted song was playing, stop audio and `playNext()`.
- [ ] **Step 5: Final End-to-End Test**
  - Upload 3 songs $\rightarrow$ Play first $\rightarrow$ Verify it auto-plays to the second $\rightarrow$ Delete second $\rightarrow$ Verify it skips to third.
- [ ] **Step 6: Commit**
  ```bash
  git add js/main.js
  git commit -m "feat: complete end-to-end integration of music player"
  ```
