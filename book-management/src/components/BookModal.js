import React, { useState, useEffect, useRef } from 'react';
import styles from './BookModal.module.css';

const GENRES = ['Fiction','Non-Fiction','Classic','Sci-Fi','Fantasy','Mystery','Biography','Self-Help','Technology','History','Other'];
const STATUSES = [
  { value: 'want',    label: '🔖 Want to read' },
  { value: 'reading', label: '📖 Currently reading' },
  { value: 'read',    label: '✅ Already read' },
];

const EMPTY = { title:'', author:'', genre:'Fiction', year: new Date().getFullYear(), rating:4, status:'want', description:'' };

function validate(f) {
  const e = {};
  if (!f.title.trim())  e.title  = 'Title is required';
  if (!f.author.trim()) e.author = 'Author is required';
  const y = Number(f.year);
  if (!f.year || isNaN(y) || y < 1 || y > new Date().getFullYear() + 5) e.year = 'Enter a valid year';
  return e;
}

export default function BookModal({ book, onClose, onSubmit, loading }) {
  const isEdit = Boolean(book?.id);
  const [form, setForm]     = useState(isEdit ? { title: book.title||'', author: book.author||'', genre: book.genre||'Fiction', year: book.year||new Date().getFullYear(), rating: book.rating||4, status: book.status||'want', description: book.description||'' } : EMPTY);
  const [errors, setErrors] = useState({});
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = (name, value) => {
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    await onSubmit({ ...form, year: Number(form.year), rating: Number(form.rating) });
  }

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.header}>
          <h2 className={styles.title}>{isEdit ? 'Edit Book' : 'Add New Book'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/></svg>
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className={`${styles.field} ${errors.title ? styles.err : ''}`}>
            <label>Title <span className={styles.req}>*</span></label>
            <input ref={ref} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. The Midnight Library" autoComplete="off"/>
            {errors.title && <span className={styles.errMsg}>{errors.title}</span>}
          </div>

          {/* Author */}
          <div className={`${styles.field} ${errors.author ? styles.err : ''}`}>
            <label>Author <span className={styles.req}>*</span></label>
            <input value={form.author} onChange={e => set('author', e.target.value)} placeholder="e.g. Matt Haig" autoComplete="off"/>
            {errors.author && <span className={styles.errMsg}>{errors.author}</span>}
          </div>

          {/* Genre + Year */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Genre</label>
              <select value={form.genre} onChange={e => set('genre', e.target.value)}>
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className={`${styles.field} ${errors.year ? styles.err : ''}`}>
              <label>Year <span className={styles.req}>*</span></label>
              <input type="number" value={form.year} onChange={e => set('year', e.target.value)} min="1" max="2030" placeholder="2024"/>
              {errors.year && <span className={styles.errMsg}>{errors.year}</span>}
            </div>
          </div>

          {/* Status */}
          <div className={styles.field}>
            <label>Reading status</label>
            <div className={styles.statusRow}>
              {STATUSES.map(s => (
                <button type="button" key={s.value}
                  className={`${styles.statusOpt} ${form.status === s.value ? styles.statusOptActive : ''}`}
                  onClick={() => set('status', s.value)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className={styles.field}>
            <label>Rating</label>
            <div className={styles.ratingRow}>
              {[1,2,3,4,5].map(r => (
                <button type="button" key={r}
                  className={`${styles.star} ${r <= Number(form.rating) ? styles.starOn : ''}`}
                  onClick={() => set('rating', r)} aria-label={`${r} star`}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill={r <= Number(form.rating) ? '#d4a853' : 'none'}>
                    <path d="M11 2l2.4 4.9L19 8l-4 3.9 1 5.4-4.8-2.5L6.3 17.3l1-5.4L3 8l5.6-.9L11 2z" stroke={r <= Number(form.rating) ? '#d4a853' : '#3a3830'} strokeWidth="1.2"/>
                  </svg>
                </button>
              ))}
              <span className={styles.ratingText}>{form.rating}/5</span>
            </div>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label>Description <span className={styles.opt}>(optional)</span></label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} placeholder="A brief note or summary…"/>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancel} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submit} disabled={loading}>
              {loading ? <><span className={styles.spinner}/> Saving…</> : isEdit ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
