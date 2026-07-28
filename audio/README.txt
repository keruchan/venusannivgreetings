The music note button plays through song.mp3 and song2.mp3 back to
back, looping: song1 -> song2 -> song1 -> ... It's the same button and
the same continuous playback on both the main page and the memories
page — moving between them picks up right where the song left off
instead of restarting.

To change the playlist (add more songs, reorder, or go back to just
one), edit MUSIC_PLAYLIST near the top of js/music.js:

  const MUSIC_PLAYLIST = ["audio/song.mp3", "audio/song2.mp3"];

If the list is empty and no file is present, the button simply does
nothing when clicked — the rest of the site works fine without it.
