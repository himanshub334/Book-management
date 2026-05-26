import React, { useState, memo } from 'react';
import styles from './BookCard.module.css';

const GENRE_COLORS = {
  'Fiction':     '#7c6fcd', 'Non-Fiction': '#4caf7d', 'Classic':    '#d4a853',
  'Sci-Fi':      '#5ba3d4', 'Fantasy':     '#a06ec9', 'Mystery':    '#c95b5b',
  'Biography':   '#6bbfb5', 'Self-Help':   '#e5874a', 'Technology': '#5ba0cc',
  'History':     '#b8926a', 'Other':       '#888888',
};

const STATUS_CONFIG = {
  read:    { label: 'Read',          color: '#4caf7d', bg: 'rgba(76,175,125,0.12)' },
  reading: { label: 'Reading',       color: '#5ba3d4', bg: 'rgba(91,163,212,0.12)' },
  want:    { label: 'Want to read',  color: '#d4a853', bg: 'rgba(212,168,83,0.1)' },
};

function highlight(text, query) {
  if (!query || !query.trim() || !text) return text;
  const q = query.trim();
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className={styles.highlight}>{text.slice(idx, idx + q.length)}</mark>
      {text.slice(idx + q.length)}
    </>
  );
}

function Stars({ rating }) {
  const r = Math.min(5, Math.max(0, Number(rating) || 0));
  return (
    <div className={styles.stars} aria-label={`${r} out of 5`}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width="11" height="11" viewBox="0 0 11 11" fill={i <= r ? '#d4a853' : 'none'} aria-hidden="true">
          <path d="M5.5 1l1.2 2.5L9.5 4 7.5 6l.5 3-2.5-1.3L3 9l.5-3L1.5 4l2.8-.5L5.5 1z"
            stroke={i <= r ? '#d4a853' : '#3a3830'} strokeWidth="0.7"/>
        </svg>
      ))}
    </div>
  );
}

function BookCover({ title, genre }) {
  const color = GENRE_COLORS[genre] || '#888';
  const initials = (title || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  return (
    <div className={styles.cover} style={{ '--cc': color }}>
      <div className={styles.spine} />
      <div className={styles.coverInner}>
        <div className={styles.initials}>{initials}</div>
        <div className={styles.coverGenre}>{genre || 'Book'}</div>
      </div>
    </div>
  );
}

const BookCard = memo(function BookCard({ book, view, searchQuery, onEdit, onDelete, onStatusChange }) {
  const [confirming, setConfirming] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const status = book.status || 'want';
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.want;
  const gc = GENRE_COLORS[book.genre] || '#888';

  async function handleDelete() {
    if (!confirming) { setConfirming(true); return; }
    setDeleting(true);
    setConfirming(false);
    await onDelete(book.id);
  }

  if (view === 'list') {
    return (
      <article className={`${styles.listCard} ${deleting ? styles.deleting : ''}`}>
        <div className={styles.listLeft}>
          <div className={styles.listSpine} style={{ background: gc }} />
          <div className={styles.listInfo}>
            <h2 className={styles.listTitle}>{highlight(book.title, searchQuery)}</h2>
            <p className={styles.listAuthor}>{highlight(book.author, searchQuery)}</p>
          </div>
        </div>
        <div className={styles.listMeta}>
          <span className={styles.listGenre} style={{ color: gc }}>{book.genre}</span>
          <span className={styles.listYear}>{book.year}</span>
          {book.rating && <Stars rating={book.rating} />}
          <span className={styles.statusBadge} style={{ color: sc.color, background: sc.bg }}>{sc.label}</span>
        </div>
        <div className={styles.listActions}>
          <StatusDropdown status={status} onChange={s => onStatusChange(book.id, s)} />
          <button className={styles.iconBtn} onClick={onEdit} title="Edit">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8.5 1.5l3 3L3.5 12H1v-2.5L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </button>
          <button className={`${styles.iconBtn} ${confirming ? styles.iconBtnDanger : ''}`}
            onClick={handleDelete} onBlur={() => setConfirming(false)} title={confirming ? 'Confirm delete' : 'Delete'}>
            {confirming
              ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 2l9 9M11 2L2 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              : <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M4.5 3.5V2h4v1.5M5 6v4M8 6v4M2.5 3.5l.6 7.5h6.8l.6-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            }
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className={`${styles.card} ${deleting ? styles.deleting : ''}`}>
      <BookCover title={book.title} genre={book.genre || 'Other'} />

      <div className={styles.body}>
        <div className={styles.topRow}>
          <span className={styles.genre} style={{ color: gc }}>{book.genre || 'Other'}</span>
          <span className={styles.year}>{book.year || '—'}</span>
        </div>
        <h2 className={styles.title} title={book.title}>{highlight(book.title, searchQuery)}</h2>
        <p className={styles.author}>{highlight(book.author, searchQuery)}</p>
        {book.rating && <Stars rating={book.rating} />}
        {book.description && <p className={styles.desc}>{book.description}</p>}
      </div>

      <div className={styles.statusBar}>
        <StatusDropdown status={status} onChange={s => onStatusChange(book.id, s)} />
      </div>

      <div className={styles.actions}>
        <button className={styles.editBtn} onClick={onEdit}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
            <path d="M8.5 1.5l3 3L3.5 12H1v-2.5L8.5 1.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
          </svg>
          Edit
        </button>
        <button
          className={`${styles.deleteBtn} ${confirming ? styles.deleteBtnConfirm : ''}`}
          onClick={handleDelete}
          onBlur={() => setConfirming(false)}
        >
          {confirming ? '⚠ Confirm?' : (
            <><svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
              <path d="M2 3.5h9M4.5 3.5V2h4v1.5M5 6v4M8 6v4M2.5 3.5l.6 7.5h6.8l.6-7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>Delete</>
          )}
        </button>
      </div>
    </article>
  );
});

function StatusDropdown({ status, onChange }) {
  const sc = STATUS_CONFIG[status] || STATUS_CONFIG.want;
  return (
    <select
      className={styles.statusSelect}
      style={{ color: sc.color, borderColor: sc.color + '44', background: sc.bg }}
      value={status}
      onChange={e => onChange(e.target.value)}
      aria-label="Reading status"
      onClick={e => e.stopPropagation()}
    >
      <option value="want">🔖 Want to read</option>
      <option value="reading">📖 Reading</option>
      <option value="read">✅ Read</option>
    </select>
  );
}

export default BookCard;
