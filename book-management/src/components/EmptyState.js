import React from 'react';
import styles from './EmptyState.module.css';

export default function EmptyState({ search, genre, onClear, onAdd }) {
  const isFiltered = search || (genre && genre !== 'All');
  return (
    <div className={styles.wrap}>
      <div className={styles.icon} aria-hidden="true">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <rect x="8" y="8" width="26" height="36" rx="3" stroke="#3a3830" strokeWidth="1.6"/>
          <rect x="14" y="8" width="24" height="36" rx="3" fill="#1a1a14" stroke="#d4a853" strokeWidth="1.2" strokeOpacity="0.4"/>
          <line x1="19" y1="18" x2="32" y2="18" stroke="#d4a853" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.5"/>
          <line x1="19" y1="24" x2="32" y2="24" stroke="#d4a853" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.5"/>
          <line x1="19" y1="30" x2="27" y2="30" stroke="#d4a853" strokeWidth="1.1" strokeLinecap="round" strokeOpacity="0.5"/>
        </svg>
      </div>
      {isFiltered ? (
        <>
          <h3 className={styles.title}>No matching books</h3>
          <p className={styles.sub}>{search ? `No results for "${search}"` : `No books in "${genre}"`}</p>
          <button className={styles.clearBtn} onClick={onClear}>Clear filters</button>
        </>
      ) : (
        <>
          <h3 className={styles.title}>Your library is empty</h3>
          <p className={styles.sub}>Add your first book to get started.</p>
          <button className={styles.addBtn} onClick={onAdd}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Add your first book
          </button>
        </>
      )}
    </div>
  );
}
