images/memories/ holds the scrapbook photos shown on memories.html —
memory-01.jpg through memory-45.jpg (renamed from your original files,
ordered by file date). The list is generated automatically in
js/memories.js (SEED_PHOTOS). The page auto-plays through them as a
slideshow; there's no upload/add or remove feature on that page
anymore — it's just for viewing.

To change the set, edit the files in this folder directly, then match
the count in js/memories.js:

  const SEED_PHOTOS = Array.from({ length: 45 }, ...)
                                          ^ raise/lower this number
