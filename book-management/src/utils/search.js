// Fuzzy search utility — scores and ranks results by relevance
export function fuzzyMatch(str, query) {
  if (!query) return { match: true, score: 0 };
  const s = str.toLowerCase();
  const q = query.toLowerCase().trim();

  // Exact match — highest priority
  if (s === q) return { match: true, score: 100 };
  // Starts with query
  if (s.startsWith(q)) return { match: true, score: 80 };
  // Contains full query as substring
  if (s.includes(q)) return { match: true, score: 60 };

  // Word-level: all query words present somewhere
  const words = q.split(/\s+/).filter(Boolean);
  if (words.length > 1) {
    const allWordsMatch = words.every(w => s.includes(w));
    if (allWordsMatch) return { match: true, score: 50 };
    const someWordsMatch = words.some(w => s.includes(w));
    if (someWordsMatch) return { match: true, score: 30 };
  }

  // Character-level fuzzy: each char in query appears in order in str
  let qi = 0;
  for (let i = 0; i < s.length && qi < q.length; i++) {
    if (s[i] === q[qi]) qi++;
  }
  if (qi === q.length) return { match: true, score: 20 };

  return { match: false, score: 0 };
}

export function searchBooks(books, query) {
  if (!query || !query.trim()) return books;
  const q = query.trim();

  const scored = books.map(book => {
    const titleScore  = fuzzyMatch(book.title  || '', q).score * 2; // title weighted higher
    const authorScore = fuzzyMatch(book.author || '', q).score;
    const genreScore  = fuzzyMatch(book.genre  || '', q).score * 0.5;
    const totalScore  = Math.max(titleScore, authorScore, genreScore);
    return { book, score: totalScore };
  }).filter(({ score }) => score > 0);

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  return scored.map(({ book }) => book);
}
