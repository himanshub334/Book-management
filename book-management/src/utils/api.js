// API Service — uses MockAPI.io
// The BASE_URL points to a publicly accessible mock REST API
// You can replace this with your own MockAPI project URL

const BASE_URL = 'https://6a14994a6c7db8aac054c5dc.mockapi.io/api/book/';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };

  const res = await fetch(url, config);
  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`API Error ${res.status}: ${errBody || res.statusText}`);
  }

  // DELETE returns empty body on success
  if (res.status === 204 || options.method === 'DELETE') {
    try { return await res.json(); } catch { return null; }
  }
  return res.json();
}

export const booksApi = {
  getAll: () => request('/books'),
  getById: (id) => request(`/books/${id}`),
  create: (book) => request('/books', { method: 'POST', body: JSON.stringify(book) }),
  update: (id, book) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(book) }),
  delete: (id) => request(`/books/${id}`, { method: 'DELETE' }),
};

export default booksApi;
