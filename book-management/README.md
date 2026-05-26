# Librarium — Book Management System

A full-stack React application to manage your personal book collection with full CRUD operations, search, filtering, and sorting.

## Features

- 📚 **Full CRUD** — Create, Read, Update, Delete books via a live REST API (MockAPI.io)
- 🔍 **Search** — Filter by title or author in real time
- 🏷️ **Genre filtering** — Filter books by genre with one click
- ↕️ **Sorting** — Sort by year (newest/oldest), title, author, or rating
- ⭐ **Ratings** — 1–5 star ratings with interactive UI
- ✅ **Form validation** — Client-side validation with inline error messages
- 🔔 **Toast notifications** — Non-blocking success/error feedback
- ⏳ **Loading states** — Skeleton cards during initial load
- 🛡️ **Error handling** — Graceful degradation with local fallback data
- 📱 **Responsive** — Works on mobile, tablet, and desktop
- ♿ **Accessible** — ARIA labels, keyboard navigation, focus management

## Tech Stack

- **Frontend**: React 18, CSS Modules
- **API**: [MockAPI.io](https://mockapi.io) — hosted mock REST API
- **Fonts**: Playfair Display (display) + DM Sans (body)
- **Deployment**: Vercel (or Netlify)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## API Configuration

The app uses MockAPI.io at:
```
https://67f3b2a52466325443ea7df2.mockapi.io/api/v1/books
```

**To use your own MockAPI project:**
1. Go to [mockapi.io](https://mockapi.io) and create a free account
2. Create a new project and add a resource named `books` with fields:
   - `title` (string)
   - `author` (string)
   - `genre` (string)
   - `year` (number)
   - `rating` (number)
   - `description` (string)
3. Copy your project URL and update `BASE_URL` in `src/utils/api.js`

## Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo at vercel.com/new
```

### Deploy to Netlify

```bash
# Build first
npm run build

# Drag & drop the /build folder to netlify.com/drop
# Or: netlify deploy --dir=build --prod
```

The `vercel.json` file is already configured for SPA routing.

## Project Structure

```
src/
├── components/
│   ├── Header.js        # Top navigation with add button
│   ├── SearchFilter.js  # Search input + genre tags + sort select
│   ├── BookCard.js      # Individual book card with cover art
│   ├── BookModal.js     # Add/Edit form modal
│   ├── EmptyState.js    # Empty/no-results state
│   └── Toast.js         # Notification toasts
├── hooks/
│   ├── useBooks.js      # All CRUD logic + state management
│   └── useToast.js      # Toast notification state
├── utils/
│   └── api.js           # API service (fetch wrapper)
├── App.js               # Root component, layout, wiring
└── index.css            # Global styles + CSS variables
```
