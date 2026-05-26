import React, { useState, useMemo, useCallback, memo } from 'react';
import styles from './App.module.css';
import { useBooks } from './hooks/useBooks';
import { useToast } from './hooks/useToast';
import { searchBooks } from './utils/search';
import Header from './components/Header';
import SearchFilter from './components/SearchFilter';
import BookCard from './components/BookCard';
import BookModal from './components/BookModal';
import ToastContainer from './components/Toast';
import EmptyState from './components/EmptyState';
import StatsBar from './components/StatsBar';
import ReadingShelf from './components/ReadingShelf';

// Memoised skeleton to avoid re-renders
const Skeleton = memo(function Skeleton() {
  return (
    <div className={styles.skeleton} aria-hidden="true">
      <div className={styles.skeletonCover} />
      <div className={styles.skeletonBody}>
        <div className={styles.skeletonLine} style={{ width: '55%', height: 10 }} />
        <div className={styles.skeletonLine} style={{ width: '88%', height: 16, marginTop: 8 }} />
        <div className={styles.skeletonLine} style={{ width: '68%', height: 13, marginTop: 4 }} />
        <div className={styles.skeletonLine} style={{ width: '100%', height: 10, marginTop: 14 }} />
        <div className={styles.skeletonLine} style={{ width: '75%', height: 10, marginTop: 5 }} />
      </div>
    </div>
  );
});

function sortBooks(books, sort) {
  return [...books].sort((a, b) => {
    switch (sort) {
      case 'newest':  return (Number(b.year)   || 0) - (Number(a.year)   || 0);
      case 'oldest':  return (Number(a.year)   || 0) - (Number(b.year)   || 0);
      case 'title':   return (a.title  || '').localeCompare(b.title  || '');
      case 'author':  return (a.author || '').localeCompare(b.author || '');
      case 'rating':  return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      case 'added':   return (b.id > a.id ? 1 : -1); // most recently added first
      default: return 0;
    }
  });
}

// Derive genres dynamically from the actual book data
function getGenres(books) {
  const set = new Set(books.map(b => b.genre).filter(Boolean));
  return ['All', ...Array.from(set).sort()];
}

export default function App() {
  const {
    books, loading, error, operationLoading,
    addBook, updateBook, deleteBook, refetch,
    updateReadingStatus,
  } = useBooks();
  const { toasts, success, error: toastError, dismiss } = useToast();

  const [search,   setSearch]   = useState('');
  const [genre,    setGenre]    = useState('All');
  const [sort,     setSort]     = useState('newest');
  const [yearRange, setYearRange] = useState([null, null]); // [min, max]
  const [minRating, setMinRating] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all'); // all | reading | read | want
  const [view,     setView]     = useState('grid');   // grid | list
  const [modal,    setModal]    = useState(null);
  const [activeTab, setActiveTab] = useState('library'); // library | shelf

  const genres = useMemo(() => getGenres(books), [books]);

  const filtered = useMemo(() => {
    // 1. Fuzzy search (handles title, author, genre)
    let result = searchBooks(books, search);

    // 2. Genre filter
    if (genre !== 'All') {
      result = result.filter(b => b.genre === genre);
    }

    // 3. Year range filter
    if (yearRange[0]) result = result.filter(b => Number(b.year) >= yearRange[0]);
    if (yearRange[1]) result = result.filter(b => Number(b.year) <= yearRange[1]);

    // 4. Minimum rating filter
    if (minRating > 0) {
      result = result.filter(b => Number(b.rating) >= minRating);
    }

    // 5. Reading status filter
    if (statusFilter !== 'all') {
      result = result.filter(b => (b.status || 'want') === statusFilter);
    }

    // 6. Sort (only when not searching — search already sorts by relevance)
    if (!search.trim()) {
      result = sortBooks(result, sort);
    }

    return result;
  }, [books, search, genre, sort, yearRange, minRating, statusFilter]);

  const handleSubmit = useCallback(async (formData) => {
    if (modal === 'add') {
      const res = await addBook(formData);
      if (res.success) {
        success(`"${formData.title}" added to your library!`);
        setModal(null);
      } else {
        toastError('Failed to add book. Please try again.');
      }
    } else {
      const res = await updateBook(modal.id, formData);
      if (res.success) {
        success(`"${formData.title}" updated successfully.`);
        setModal(null);
      } else {
        toastError('Failed to update book. Please try again.');
      }
    }
  }, [modal, addBook, updateBook, success, toastError]);

  const handleDelete = useCallback(async (id) => {
    const book = books.find(b => b.id === id);
    const res = await deleteBook(id);
    if (res.success) {
      success(`"${book?.title}" removed from your library.`);
    } else {
      toastError('Failed to delete book.');
    }
  }, [books, deleteBook, success, toastError]);

  const handleStatusChange = useCallback(async (id, status) => {
    await updateReadingStatus(id, status);
    const labels = { reading: 'Currently reading', read: 'Marked as read', want: 'Added to want list' };
    success(labels[status] || 'Status updated');
  }, [updateReadingStatus, success]);

  const clearFilters = useCallback(() => {
    setSearch(''); setGenre('All'); setYearRange([null,null]);
    setMinRating(0); setStatusFilter('all');
  }, []);

  const isFiltered = search || genre !== 'All' || yearRange[0] || yearRange[1] || minRating > 0 || statusFilter !== 'all';

  return (
    <div className={styles.app}>
      <Header
        totalBooks={books.length}
        onAddBook={() => setModal('add')}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        view={view}
        onViewChange={setView}
      />

      {activeTab === 'library' ? (
        <>
          <StatsBar books={books} loading={loading} />

          <SearchFilter
            search={search}         onSearch={setSearch}
            genre={genre}           onGenre={setGenre}
            genres={genres}
            sort={sort}             onSort={setSort}
            yearRange={yearRange}   onYearRange={setYearRange}
            minRating={minRating}   onMinRating={setMinRating}
            statusFilter={statusFilter} onStatusFilter={setStatusFilter}
            resultCount={loading ? 0 : filtered.length}
            totalCount={books.length}
            isFiltered={!!isFiltered}
            onClearAll={clearFilters}
          />

          <main className={styles.main}>
            {error && (
              <div className={styles.errorBanner} role="alert">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span>API unreachable — showing local data. <button onClick={refetch}>Retry</button></span>
              </div>
            )}

            <div className={view === 'list' ? styles.list : styles.grid}>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} />)
                : filtered.length === 0
                  ? <EmptyState search={search} genre={genre} onClear={clearFilters} onAdd={() => setModal('add')} />
                  : filtered.map(book => (
                      <BookCard
                        key={book.id}
                        book={book}
                        view={view}
                        searchQuery={search}
                        onEdit={() => setModal(book)}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))
              }
            </div>
          </main>
        </>
      ) : (
        <ReadingShelf
          books={books}
          onEdit={(b) => { setModal(b); setActiveTab('library'); }}
          onStatusChange={handleStatusChange}
          onAdd={() => { setModal('add'); setActiveTab('library'); }}
        />
      )}

      {modal && (
        <BookModal
          book={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
          loading={operationLoading}
        />
      )}

      <ToastContainer toasts={toasts} onDismiss={dismiss} />

      <footer className={styles.footer}>
        <p>Librarium — your personal library, beautifully managed</p>
      </footer>
    </div>
  );
}
