# Local Music Player Design Spec
**Date:** 2026-10-04
**Status:** Draft for Approval
**Path:** Architectural

## 1. Intent & Goal
Create a local-first music player web-app that allows users to upload, store, play, and delete music files. The app must be mobile-responsive and feature a high-end minimalist aesthetic.

### Success Criteria
- Users can upload audio files which persist after page refresh.
- Songs play sequentially (automatic "play next").
- Users can delete songs from the local storage.
- UI is sleek, minimalist, and works on both desktop and mobile.

---

## 2. Technical Architecture

### 2.1 Storage Layer (IndexedDB)
To handle large audio files, the app will use **IndexedDB**.
- **Database Name:** `MusicPlayerDB`
- **Object Store:** `songs`
- **Schema:**
  - `id`: (KeyPath) Auto-incrementing integer.
  - `name`: String (Filename/Title).
  - `data`: Blob (The raw audio file).
  - `addedDate`: Timestamp.

### 2.2 Playback Engine
- **Core:** HTML5 `Audio` API.
- **Lifecycle:**
  1. Retrieve `Blob` from IndexedDB.
  2. Create temporary URL via `URL.createObjectURL(blob)`.
  3. Set `audio.src` $\rightarrow$ `.play()`.
  4. Revoke URL upon song change to prevent memory leaks.

### 2.3 Playback Logic
- **Playlist Management:** An array of IDs fetched from the database.
- **Auto-Play:** `audio.onended` event triggers the `playNext()` function.
- **Looping:** When the last song ends, the index resets to 0.

---

## 3. Component Design (Minimalist/Sleek)

### 3.1 Visual Direction
- **Style:** Minimalist/Sleek.
- **Palette:** High-contrast (Deep charcoal/Off-white) with a single accent color for the progress bar.
- **Typography:** Modern sans-serif (Inter/System-UI).

### 3.2 Key Components
- **Main Player View:**
  - Large soft-edged album art placeholder.
  - Bold song title and muted artist/file info.
  - Thin, elegant progress bar with tiny time stamps.
- **Controls:**
  - High-contrast thin-line icons for `Previous`, `Play/Pause`, `Next`.
  - Tactile scale-down animations on click.
- **Library View:**
  - Clean list of songs.
  - Delete button (trash icon) for each entry.
  - Floating Action Button (`+`) for uploading new files.

---

## 4. Implementation Constraints
- **Frontend-Only:** No backend server.
- **Performance:** Efficient Blob handling to avoid browser lag on mobile.
- **Responsiveness:** Flexbox/Grid layout to ensure seamless mobile experience.
