The music note button (bottom-right of the main page) plays through
song.mp3 and song2.mp3 back to back, looping: song1 -> song2 -> song1 -> ...

To change the playlist (add more songs, reorder, or go back to just
one), edit CONFIG.musicPlaylist near the top of js/script.js:

  musicPlaylist: ["audio/song.mp3", "audio/song2.mp3"],

If the list is empty and no file is present, the button simply does
nothing when clicked — the rest of the site works fine without it.
