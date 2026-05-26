import React, { memo } from 'react';
import styles from './StatsBar.module.css';

const StatsBar = memo(function StatsBar({ books, loading }) {
  if (loading) return <div className={styles.bar}><div className={styles.shimmer} /></div>;

  const total   = books.length;
  const read    = books.filter(b => b.status === 'read').length;
  const reading = books.filter(b => b.status === 'reading').length;
  const want    = books.filter(b => !b.status || b.status === 'want').length;
  const avgRating = total
    ? (books.reduce((s, b) => s + (Number(b.rating) || 0), 0) / total).toFixed(1)
    : '—';

  const pct = total ? Math.round((read / total) * 100) : 0;

  const stats = [
    { label: 'Total books',      value: total,      icon: '📚', color: 'accent' },
    { label: 'Read',             value: read,        icon: '✅', color: 'success' },
    { label: 'Reading now',      value: reading,     icon: '📖', color: 'info' },
    { label: 'Want to read',     value: want,        icon: '🔖', color: 'muted' },
    { label: 'Avg rating',       value: avgRating,   icon: '⭐', color: 'accent' },
    { label: 'Progress',         value: `${pct}%`,   icon: null, color: 'progress', pct },
  ];

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        {stats.map(s => (
          <div key={s.label} className={`${styles.stat} ${styles[s.color]}`}>
            {s.icon && <span className={styles.icon}>{s.icon}</span>}
            {s.pct !== undefined ? (
              <div className={styles.progressWrap}>
                <div className={styles.progressLabel}>
                  <span>{s.label}</span><span className={styles.pctVal}>{s.value}</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ) : (
              <>
                <span className={styles.value}>{s.value}</span>
                <span className={styles.label}>{s.label}</span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default StatsBar;
