import React, { memo } from 'react';
import styles from './ReadingShelf.module.css';

const GENRE_COLORS = {
  'Fiction':'#7c6fcd','Non-Fiction':'#4caf7d','Classic':'#d4a853',
  'Sci-Fi':'#5ba3d4','Fantasy':'#a06ec9','Mystery':'#c95b5b',
  'Biography':'#6bbfb5','Self-Help':'#e5874a','Technology':'#5ba0cc',
  'History':'#b8926a','Other':'#888888',
};

function MiniCover({ title, genre, onClick }) {
  const color = GENRE_COLORS[genre] || '#888';
  const initials = (title || '?').split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className={styles.miniCover} style={{ '--cc': color }} onClick={onClick} title={title}>
      <div className={styles.miniSpine} />
      <span className={styles.miniInitials}>{initials}</span>
    </div>
  );
}

function ShelfSection({ label, emoji, books, onEdit, onStatusChange, targetStatus, emptyMsg }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEmoji}>{emoji}</span>
        <h2 className={styles.sectionTitle}>{label}</h2>
        <span className={styles.sectionCount}>{books.length}</span>
      </div>
      <div className={styles.shelf}>
        <div className={styles.shelfPlank} />
        {books.length === 0 ? (
          <p className={styles.empty}>{emptyMsg}</p>
        ) : (
          <div className={styles.books}>
            {books.map(book => (
              <div key={book.id} className={styles.bookWrap}>
                <MiniCover title={book.title} genre={book.genre} onClick={() => onEdit(book)} />
                <div className={styles.bookTooltip}>
                  <strong>{book.title}</strong>
                  <span>{book.author}</span>
                  {book.rating && <span>{'★'.repeat(Number(book.rating))}</span>}
                  <div className={styles.tooltipActions}>
                    {targetStatus && (
                      <button onClick={() => onStatusChange(book.id, targetStatus)}>
                        Mark as {targetStatus === 'read' ? '✅ Read' : targetStatus === 'reading' ? '📖 Reading' : '🔖 Want'}
                      </button>
                    )}
                    <button onClick={() => onEdit(book)}>✏️ Edit</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ReadingShelf = memo(function ReadingShelf({ books, onEdit, onStatusChange, onAdd }) {
  const reading = books.filter(b => b.status === 'reading');
  const read    = books.filter(b => b.status === 'read');
  const want    = books.filter(b => !b.status || b.status === 'want');

  // Reading progress: estimate pages read using rating as proxy (fun stat)
  const avgRating = read.length
    ? (read.reduce((s, b) => s + (Number(b.rating) || 0), 0) / read.length).toFixed(1)
    : null;

  const genreCounts = books.reduce((acc, b) => {
    const g = b.genre || 'Other';
    acc[g] = (acc[g] || 0) + 1;
    return acc;
  }, {});
  const topGenre = Object.entries(genreCounts).sort((a,b) => b[1]-a[1])[0];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>My Reading Shelf</h1>
          <p className={styles.pageSubtitle}>Your personal library at a glance</p>
        </div>
        <button className={styles.addBtn} onClick={onAdd}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          Add Book
        </button>
      </div>

      {/* Insights row */}
      <div className={styles.insights}>
        <div className={styles.insight}>
          <span className={styles.insightVal}>{read.length}</span>
          <span className={styles.insightLabel}>Books completed</span>
        </div>
        <div className={styles.insight}>
          <span className={styles.insightVal}>{reading.length}</span>
          <span className={styles.insightLabel}>In progress</span>
        </div>
        <div className={styles.insight}>
          <span className={styles.insightVal}>{want.length}</span>
          <span className={styles.insightLabel}>On wish list</span>
        </div>
        {avgRating && (
          <div className={styles.insight}>
            <span className={styles.insightVal}>{avgRating}★</span>
            <span className={styles.insightLabel}>Avg rating</span>
          </div>
        )}
        {topGenre && (
          <div className={styles.insight}>
            <span className={styles.insightVal} style={{ fontSize: '0.95rem' }}>{topGenre[0]}</span>
            <span className={styles.insightLabel}>Top genre ({topGenre[1]})</span>
          </div>
        )}
      </div>

      <ShelfSection label="Currently Reading" emoji="📖" books={reading}
        onEdit={onEdit} onStatusChange={onStatusChange}
        targetStatus="read" emptyMsg="Nothing in progress — pick up a book!" />

      <ShelfSection label="Already Read" emoji="✅" books={read}
        onEdit={onEdit} onStatusChange={onStatusChange}
        targetStatus={null} emptyMsg="No finished books yet." />

      <ShelfSection label="Want to Read" emoji="🔖" books={want}
        onEdit={onEdit} onStatusChange={onStatusChange}
        targetStatus="reading" emptyMsg="Your wish list is empty — add some books!" />
    </div>
  );
});

export default ReadingShelf;
