/**
 * UI Interaction Layer
 * Handles DOM updates and user input for the music player.
 */

export const UI = {
    // DOM Elements
    elements: {
        songTitle: document.getElementById('song-title'),
        songArtist: document.getElementById('song-artist'),
        progressBar: document.getElementById('progress-bar'),
        currentTime: document.getElementById('current-time'),
        duration: document.getElementById('duration'),
        playPauseBtn: document.getElementById('play-pause-btn'),
        playIcon: document.getElementById('play-icon'),
        songList: document.getElementById('song-list'),
        libraryView: document.getElementById('library-view'),
        libraryToggleBtn: document.getElementById('library-toggle-btn'),
        closeLibraryBtn: document.getElementById('close-library'),
        addSongBtn: document.getElementById('add-song-btn'),
        fileInput: document.getElementById('file-input'),
        albumArt: document.getElementById('album-art')
    },

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    },

    updatePlayerUI(song) {
        this.elements.songTitle.textContent = song.name;
        this.elements.songArtist.textContent = 'Local Track';

        // Subtle album art animation
        this.elements.albumArt.style.transform = 'scale(1.05)';
        setTimeout(() => {
            this.elements.albumArt.style.transform = 'scale(1)';
        }, 200);
    },

    updatePlaybackState(isPlaying) {
        if (isPlaying) {
            this.elements.playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>'; // Pause icon
        } else {
            this.elements.playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>'; // Play icon
        }
    },

    updateProgress(currentTime, duration) {
        const percent = (currentTime / duration) * 100 || 0;
        this.elements.progressBar.value = percent;
        this.elements.currentTime.textContent = this.formatTime(currentTime);
        this.elements.duration.textContent = this.formatTime(duration);
    },

    renderLibrary(songs, onSongSelect, onSongDelete) {
        this.elements.songList.innerHTML = '';

        if (songs.length === 0) {
            this.elements.songList.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:2rem;">Your library is empty</p>';
            return;
        }

        songs.forEach(song => {
            const item = document.createElement('div');
            item.className = 'song-item';
            item.innerHTML = `
                <div class="song-item-info">
                    <span class="song-item-name">${song.name}</span>
                </div>
                <button class="delete-btn" data-id="${song.id}" title="Delete">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            `;

            item.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-btn')) {
                    onSongSelect(song);
                }
            });

            item.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                onSongDelete(song.id);
            });

            this.elements.songList.appendChild(item);
        });
    },

    toggleLibrary(show) {
        if (show) {
            this.elements.libraryView.classList.remove('hidden');
        } else {
            this.elements.libraryView.classList.add('hidden');
        }
    }
};
