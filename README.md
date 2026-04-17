# 🎬 Cine-Stream — Redux State Management Upgrade

A production-ready **movie discovery application** enhanced with **Redux Toolkit**, focused on scalable state management, performance optimization, and clean architecture.

🔗 **Live Demo:** [https://cine-stream-upgrade.vercel.app/](https://cine-stream-upgrade-five.vercel.app/)
📂 **GitHub Repository:** https://github.com/vardhan999-hub/cine-stream-upgrade

---

## 📌 Overview

Cine-Stream is a modern movie browsing platform that allows users to discover, search, and save their favorite movies.

This project upgrades the previous version by introducing **Redux Toolkit for global state management**, replacing local state and prop drilling with a scalable architecture.

### 🚀 Key Improvements

* Centralized state using **Redux Toolkit**
* Eliminated **prop drilling**
* Implemented **global filters**
* Added **theme management**
* Improved rendering performance

---

## ✨ Features

* 🎥 Browse popular movies from TMDB API
* 🔍 Search movies with debounced input
* ❤️ Add / remove favorites (Redux state)
* 🎛️ Filter movies (genre, rating, sorting)
* ♾️ Infinite scroll using `IntersectionObserver`
* 🌗 Dark / Light theme (global state)
* ⚡ Optimized rendering using `useMemo` and `useCallback`
* 🚫 Prevent stale API responses using `AbortController`

---

## 🛠 Tech Stack

| Technology    | Purpose                 |
| ------------- | ----------------------- |
| React 18      | UI components           |
| Redux Toolkit | Global state management |
| React Redux   | State integration       |
| Vite          | Build tool              |
| TMDB API      | Movie data              |
| Zod           | Environment validation  |
| Reselect      | Memoized selectors      |

---

## 📂 Project Structure

```bash
cine-stream-upgrade/
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── store/
│   │   ├── slices/
│   │   └── store.js
│   ├── utils/
│   └── main.jsx
│
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## ⚙️ State Management

### 🔹 Favorites (Redux Slice)

* Stores selected movies globally
* Synced with localStorage
* Managed via Redux actions

---

### 🔹 Filters (Redux Slice)

* Genre selection
* Rating filter
* Sorting options

Filters update the UI instantly using global state.

---

### 🔹 Theme (Redux Slice)

* Dark / Light mode
* Persisted across sessions

---

## ⚡ Performance Optimizations

* `useMemo` → avoids expensive recalculations
* `useCallback` → prevents unnecessary re-renders
* `createSelector` → memoized Redux selectors
* `AbortController` → prevents stale API responses
* Infinite scroll optimized with proper cleanup

---

## 🎯 Requirements Covered

### ✅ Level 1

* Redux store setup
* Favorites management using slice

### ✅ Level 2

* Global filtering system
* State-driven UI updates

### ✅ Level 3

* Render optimization
* Global theme management

---

## 🚀 Deployment

Deployed on Vercel.

Steps:

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

---

## 🔑 Environment Variables

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_GROQ_API_KEY=your_groq_api_key
```

---

## 🎯 Highlights

* Scalable Redux architecture
* Clean separation of logic and UI
* Performance-focused implementation
* Real-world state management patterns

---

## 👨‍💻 Author

**Tadigadapa Harshavardhan**
🔗 https://github.com/vardhan999-hub
