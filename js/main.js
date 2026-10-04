/**
 * Main Orchestrator
 * Connects DB, Player, and UI to create the functional music player.
 */
import { saveSong, getAllSongs, deleteSong } from './db.js';
import { player } from './player.js';
import { UI } from './ui.js';

async function init() {
    // 1. Setup Navigation & Library Toggle
    UI.elements.libraryToggleBtn.addEventListener('click', () => UI.toggleLibrary(true));
    UI.elements.closeLibraryBtn.addEventListener('click', () => UI.toggleLibrary(false));

    // 2. Handle Song Uploads
    UI.elements.addSongBtn.addEventListener('click', () => UI.elements.fileInput.click());
    UI.elements.fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        for (const file of files) {
            if (file.type.startsWith('audio/')) {
                await saveSong(file.name, file);
            }
        }
        UI.elements.fileInput.value = ''; // Reset input
        await refreshLibrary();
    });

    // 3. Playback Controls
    UI.elements.playPauseBtn.addEventListener('click', () => {
        player.togglePlay();
        UI.updatePlaybackState(player.state.isPlaying);
    });

    UI.elements.nextBtn.addEventListener('click', () => {
        player.playNext();
        updateCurrentSongUI();
        UI.updatePlaybackState(true);
    });

    UI.elements.prevBtn.addEventListener('click', () => {
        player.playPrev();
        updateCurrentSongUI();
        UI.updatePlaybackState(true);
    });

    UI.elements.progressBar.addEventListener('input', (e) => {
        player.seek(e.target.value);
    });

    // 4. Audio Event Listeners
    player.audio.addEventListener('timeupdate', () => {
        UI.updateProgress(player.audio.currentTime, player.audio.duration);
    });

    player.audio.addEventListener('play', () => UI.updatePlaybackState(true));
    player.audio.addEventListener('pause', () => UI.updatePlaybackState(false));

    // Handle auto-play visual update
    player.audio.addEventListener('ended', () => {
        // The player.js internally calls playNext(), we just update UI
        setTimeout(updateCurrentSongUI, 100);
    });

    // Initial Load
    await refreshLibrary();
}

async function refreshLibrary() {
    const songs = await getAllSongs();
    player.setPlaylist(songs);
    UI.renderLibrary(songs, handleSongSelect, handleDeleteSong);
}

async function handleSongSelect(song) {
    await player.loadSong(song);
    player.play();
    updateCurrentSongUI();
    UI.updatePlaybackState(true);
    UI.toggleLibrary(false);
}

async function handleDeleteSong(id) {
    await deleteSong(id);

    // If the deleted song was playing, move to next
    if (player.playlist[player.currentIndex]?.id === id) {
        player.playNext();
        updateCurrentSongUI();
    }

    await refreshLibrary();
}

function updateCurrentSongUI() {
    const song = player.playlist[player.currentIndex];
    if (song) {
        UI.updatePlayerUI(song);
    }
}

// Launch App
init().catch(console.error);
