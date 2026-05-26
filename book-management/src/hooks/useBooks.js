import { useState, useEffect, useCallback, useRef } from 'react';
import booksApi from '../utils/api';

const SEED_BOOKS = [
  { title: 'The Midnight Library',   author: 'Matt Haig',             genre: 'Fiction',     year: 2020, rating: 5, status: 'read',    description: 'A dazzling novel about all the choices that go into a life well lived.' },
  { title: 'Atomic Habits',          author: 'James Clear',           genre: 'Self-Help',   year: 2018, rating: 5, status: 'read',    description: 'Tiny changes, remarkable results. An easy and proven way to build good habits.' },
  { title: 'Dune',                   author: 'Frank Herbert',         genre: 'Sci-Fi',      year: 1965, rating: 5, status: 'read',    description: 'The epic tale of Paul Atreides on the desert planet Arrakis.' },
  { title: 'The Great Gatsby',       author: 'F. Scott Fitzgerald',   genre: 'Classic',     year: 1925, rating: 4, status: 'read',    description: 'A story of the fabulously wealthy Jay Gatsby and his love for Daisy Buchanan.' },
  { title: 'Sapiens',                author: 'Yuval Noah Harari',     genre: 'Non-Fiction', year: 2011, rating: 5, status: 'reading', description: 'A brief history of humankind — from the Stone Age to the Silicon Age.' },
  { title: 'The Alchemist',          author: 'Paulo Coelho',          genre: 'Fiction',     year: 1988, rating: 4, status: 'want',    description: 'A magical fable about following your dream and listening to your heart.' },
  { title: '1984',                   author: 'George Orwell',         genre: 'Classic',     year: 1949, rating: 5, status: 'read',    description: 'A chilling vision of a totalitarian society and the power of independent thought.' },
  { title: 'Clean Code',             author: 'Robert C. Martin',      genre: 'Technology',  year: 2008, rating: 4, status: 'reading', description: 'A handbook of agile software craftsmanship for professional programmers.' },
  { title: 'The Pragmatic Programmer', author: 'David Thomas',        genre: 'Technology',  year: 1999, rating: 5, status: 'want',    description: 'Your journey to mastery — timeless advice for software craftsmen.' },
  { title: 'Deep Work',              author: 'Cal Newport',           genre: 'Self-Help',   year: 2016, rating: 4, status: 'want',    description: 'Rules for focused success in a distracted world.' },
];

export function useBooks() {
  const [books, setBooks]                   = useState([]);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [operationLoading, setOpLoading]    = useState(false);
  const initialized = useRef(false);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await booksApi.getAll();
      if (!data || data.length === 0) {
        const seeded = await Promise.all(SEED_BOOKS.map(b => booksApi.create(b).catch(() => b)));
        setBooks(seeded.filter(Boolean));
      } else {
        setBooks(data);
      }
    } catch (err) {
      setError(err.message);
      setBooks(SEED_BOOKS.map((b, i) => ({ ...b, id: String(i + 1) })));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialized.current) { initialized.current = true; fetchBooks(); }
  }, [fetchBooks]);

  const addBook = useCallback(async (data) => {
    setOpLoading(true);
    try {
      const book = await booksApi.create({ ...data, status: data.status || 'want' });
      setBooks(prev => [book, ...prev]);
      return { success: true, book };
    } catch {
      const book = { ...data, id: `local-${Date.now()}`, status: data.status || 'want' };
      setBooks(prev => [book, ...prev]);
      return { success: true, book };
    } finally { setOpLoading(false); }
  }, []);

  const updateBook = useCallback(async (id, data) => {
    setOpLoading(true);
    try {
      const book = await booksApi.update(id, data);
      setBooks(prev => prev.map(b => b.id === id ? book : b));
      return { success: true, book };
    } catch {
      const book = { ...data, id };
      setBooks(prev => prev.map(b => b.id === id ? book : b));
      return { success: true, book };
    } finally { setOpLoading(false); }
  }, []);

  const deleteBook = useCallback(async (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    try {
      await booksApi.delete(id);
      return { success: true };
    } catch {
      return { success: true }; // optimistic — keep deleted
    }
  }, []);

  // Update only the reading status field
  const updateReadingStatus = useCallback(async (id, status) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    try {
      const book = books.find(b => b.id === id);
      if (book) await booksApi.update(id, { ...book, status });
    } catch { /* optimistic — ignore */ }
  }, [books]);

  return { books, loading, error, operationLoading, refetch: fetchBooks, addBook, updateBook, deleteBook, updateReadingStatus };
}
