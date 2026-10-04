/**
 * Audio Playback Engine
 * Manages the HTML5 Audio object and playlist navigation.
 */

class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.playlist = [];
        this.currentIndex = -1;
        this.currentObjectURL = null;

        // Auto-play next song when current one ends
        this.audio.onended = () => this.playNext();
    }

    async loadSong(song) {
        // Cleanup previous object URL to prevent memory leaks
        if (this.currentObjectURL) {
            URL.revokeObjectURL(this.currentObjectURL);
        }

        this.currentObjectURL = URL.createObjectURL(song.data);
        this.audio.src = this.currentObjectURL;

        // Update current index based on playlist
        this.currentIndex = this.playlist.findIndex(s => s.id === song.id);
    }

    async play() {
        try {
            await this.audio.play();
        } catch (err) {
            console.error("Playback failed. User interaction may be required:", err);
        }
    }

    pause() {
        this.audio.pause();
    }

    togglePlay() {
        if (this.audio.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    setPlaylist(songs) {
        this.playlist = songs;
    }

    playNext() {
        if (this.playlist.length === 0) return;

        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        const nextSong = this.playlist[this.currentIndex];
        this.loadSong(nextSong);
        this.play();
    }

    playPrev() {
        if (this.playlist.length === 0) return;

        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        const prevSong = this.playlist[this.currentIndex];
        this.loadSong(prevSong);
        this.play();
    }

    seek(percent) {
        const time = (percent / 100) * this.audio.duration;
        this.audio.currentTime = time;
    }

    get state() {
        return {
            isPlaying: !this.audio.paused,
            currentTime: this.audio.currentTime,
            duration: this.audio.duration || 0,
            currentIndex: this.currentIndex
        };
    }
}

export const player = new MusicPlayer();
