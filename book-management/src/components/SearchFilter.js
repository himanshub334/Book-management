import React, { useState } from 'react';
import styles from './SearchFilter.module.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title',  label: 'Title A–Z' },
  { value: 'author', label: 'Author A–Z' },
  { value: 'rating', label: 'Top rated' },
  { value: 'added',  label: 'Recently added' },
];

const STATUS_OPTIONS = [
  { value: 'all',     label: 'All statuses' },
  { value: 'read',    label: '✅ Read' },
  { value: 'reading', label: '📖 Reading' },
  { value: 'want',    label: '🔖 Want to read' },
];

export default function SearchFilter({
  search, onSearch, genre, onGenre, genres,
  sort, onSort, yearRange, onYearRange,
  minRating, onMinRating, statusFilter, onStatusFilter,
  resultCount, totalCount, isFiltered, onClearAll,
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className={styles.container}>
      {/* Row 1: search + sort + advanced toggle */}
      <div className={styles.row1}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9.5 9.5l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search title, author, or genre…"
            value={search}
            onChange={e => onSearch(e.target.value)}
            aria-label="Search books"
            spellCheck={false}
          />
          {search && (
            <button className={styles.clearSearch} onClick={() => onSearch('')} aria-label="Clear search">
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M1 1l9 9M10 1L1 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        <select className={styles.select} value={sort} onChange={e => onSort(e.target.value)} aria-label="Sort">
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        <button
          className={`${styles.advancedBtn} ${showAdvanced ? styles.advancedActive : ''}`}
          onClick={() => setShowAdvanced(p => !p)}
          aria-expanded={showAdvanced}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
          Filters
          {isFiltered && <span className={styles.filterDot} aria-label="Filters active" />}
        </button>
      </div>

      {/* Row 2: genre chips — always visible */}
      <div className={styles.genreRow}>
        {(genres || []).map(g => (
          <button
            key={g}
            className={`${styles.chip} ${genre === g ? styles.chipActive : ''}`}
            onClick={() => onGenre(g)}
          >{g}</button>
        ))}
        <div className={styles.resultInfo}>
          {search
            ? <span>{resultCount} match{resultCount !== 1 ? 'es' : ''} for "<em>{search}</em>"</span>
            : <span>{resultCount} of {totalCount}</span>
          }
          {isFiltered && (
            <button className={styles.clearAll} onClick={onClearAll}>Clear all</button>
          )}
        </div>
      </div>

      {/* Row 3: advanced filters panel */}
      {showAdvanced && (
        <div className={styles.advanced}>
          <div className={styles.advGroup}>
            <label className={styles.advLabel}>Status</label>
            <div className={styles.statusRow}>
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s.value}
                  className={`${styles.statusChip} ${statusFilter === s.value ? styles.statusActive : ''}`}
                  onClick={() => onStatusFilter(s.value)}
                >{s.label}</button>
              ))}
            </div>
          </div>

          <div className={styles.advGroup}>
            <label className={styles.advLabel}>Min rating</label>
            <div className={styles.ratingRow}>
              {[0,1,2,3,4,5].map(r => (
                <button
                  key={r}
                  className={`${styles.ratingChip} ${minRating === r ? styles.ratingActive : ''}`}
                  onClick={() => onMinRating(r)}
                >{r === 0 ? 'Any' : `${r}★+`}</button>
              ))}
            </div>
          </div>

          <div className={styles.advGroup}>
            <label className={styles.advLabel}>Year range</label>
            <div className={styles.yearRow}>
              <input
                className={styles.yearInput} type="number"
                placeholder="From" min="1" max="2030"
                value={yearRange[0] || ''}
                onChange={e => onYearRange([e.target.value ? Number(e.target.value) : null, yearRange[1]])}
              />
              <span className={styles.yearSep}>–</span>
              <input
                className={styles.yearInput} type="number"
                placeholder="To" min="1" max="2030"
                value={yearRange[1] || ''}
                onChange={e => onYearRange([yearRange[0], e.target.value ? Number(e.target.value) : null])}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
