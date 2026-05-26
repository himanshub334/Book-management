import React from 'react';
import styles from './Header.module.css';

export default function Header({ totalBooks, onAddBook, activeTab, onTabChange, view, onViewChange }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="14" height="20" rx="2" stroke="#d4a853" strokeWidth="1.4"/>
              <rect x="7" y="3" width="13" height="20" rx="2" fill="#d4a853" fillOpacity="0.1" stroke="#d4a853" strokeWidth="1.4"/>
              <line x1="10" y1="8"  x2="17" y2="8"  stroke="#d4a853" strokeWidth="1.1" strokeLinecap="round"/>
              <line x1="10" y1="12" x2="17" y2="12" stroke="#d4a853" strokeWidth="1.1" strokeLinecap="round"/>
              <line x1="10" y1="16" x2="14" y2="16" stroke="#d4a853" strokeWidth="1.1" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>Librarium</h1>
            <p className={styles.subtitle}>{totalBooks} book{totalBooks !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <nav className={styles.tabs} aria-label="Main navigation">
          <button
            className={`${styles.tab} ${activeTab === 'library' ? styles.tabActive : ''}`}
            onClick={() => onTabChange('library')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              <rect x="8" y="1" width="5" height="12" rx="1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
            Library
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'shelf' ? styles.tabActive : ''}`}
            onClick={() => onTabChange('shelf')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 3h12M1 7h12M1 11h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            My Shelf
          </button>
        </nav>

        <div className={styles.right}>
          {activeTab === 'library' && (
            <div className={styles.viewToggle} role="group" aria-label="View mode">
              <button
                className={`${styles.viewBtn} ${view === 'grid' ? styles.viewActive : ''}`}
                onClick={() => onViewChange('grid')} aria-label="Grid view"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                  <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                  <rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                  <rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
              </button>
              <button
                className={`${styles.viewBtn} ${view === 'list' ? styles.viewActive : ''}`}
                onClick={() => onViewChange('list')} aria-label="List view"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 3h12M1 7h12M1 11h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}
          <button className={styles.addBtn} onClick={onAddBook}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>Add Book</span>
          </button>
        </div>
      </div>
    </header>
  );
}
