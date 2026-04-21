# 🎬 Prompts.md — Cine-Stream Redux Upgrade Notes

**Project:** Cine-Stream — Advanced State Management
**Week:** 10
**Track:** A — Frontend Specialists
**Intern:** Tadigadapa Harshavardhan

---

## 📌 Overview

This document explains how AI was used as a **learning reference** during the upgrade of Cine-Stream with **Redux Toolkit and advanced state management**.

### 🎯 Focus Areas

* Eliminating prop drilling using **global state**
* Managing application state using **Redux Toolkit**
* Implementing **global filters**
* Optimizing rendering performance
* Managing **theme globally**

> AI was used only for conceptual understanding.
> All implementation, debugging, and decisions were done independently.

---

## 🔹 Prompt 1 — Why Redux Toolkit?

**Prompt Used:**
Why should I use Redux Toolkit instead of Context API?

**Implementation:**

* Identified that prop drilling becomes difficult in larger apps
* Understood Context API limitations for complex state
* Introduced Redux Toolkit for centralized state

✔ Created global store
✔ Structured state using slices

---

## 🔹 Prompt 2 — Creating Redux Store & Slices

**Prompt Used:**
How to structure a Redux store using Redux Toolkit?

**Implementation:**

* Created `store/store.js`
* Created slices:

  * `favoritesSlice` → manages saved movies
  * `filtersSlice` → manages filtering state
  * `themeSlice` → manages dark/light mode

✔ Used `createSlice` for clean reducer logic
✔ Used actions and dispatch properly

---

## 🔹 Prompt 3 — Favorites Management

**Prompt Used:**
How to manage favorites globally using Redux?

**Implementation:**

* Moved favorites logic from local state to Redux
* Implemented `toggleFavorite` action
* Synced favorites with localStorage

✔ Eliminated prop drilling
✔ Centralized favorite state

---

## 🔹 Prompt 4 — Global Filtering System

**Prompt Used:**
How to implement filters using global state?

**Implementation:**

* Created filter sidebar UI
* Stored filter values in Redux
* Applied filters globally to movie list

✔ Filters update UI instantly
✔ No need to pass props across components

---

## 🔹 Prompt 5 — Performance Optimization

**Prompt Used:**
How to prevent unnecessary re-renders in React?

**Implementation:**

* Used `useMemo` for filtering and sorting logic
* Used `useCallback` for event handlers
* Used `createSelector` for memoized Redux state

✔ Improved performance for large movie lists

---

## 🔹 Prompt 6 — Infinite Scroll Optimization

**Prompt Used:**
How to implement efficient infinite scrolling?

**Implementation:**

* Used `IntersectionObserver`
* Created custom hook `useInfiniteScroll`
* Added proper cleanup using `observer.disconnect()`

✔ Prevented memory leaks
✔ Optimized loading behavior

---

## 🔹 Prompt 7 — Handling API Race Conditions

**Prompt Used:**
How to avoid stale API responses?

**Implementation:**

* Used `AbortController` to cancel previous requests
* Used `useRef` to track active query
* Ignored outdated responses

✔ Prevented incorrect UI updates

---

## 🔹 Prompt 8 — Debouncing Search

**Prompt Used:**
How to debounce user input in React?

**Implementation:**

* Created custom hook `useDebounce`
* Delayed API calls until user stops typing

✔ Reduced unnecessary API requests

---

## 🔹 Prompt 9 — Theme Management

**Prompt Used:**
How to manage theme globally?

**Implementation:**

* Created `themeSlice` in Redux
* Stored theme state globally
* Persisted theme using localStorage

✔ Theme applied across entire app

---

## 🔧 Additional Work (Independent)

* Implemented API layer with centralized fetch logic
* Added environment validation using Zod
* Fixed race conditions in API calls
* Implemented caching for better performance
* Added retry mechanism for failed requests
* Handled empty states and loading states

---

## 📊 Week 9 vs Week 10

| Feature          | Week 9        | Week 10       |
| ---------------- | ------------- | ------------- |
| State Management | Local + Props | Redux Toolkit |
| Prop Drilling    | Present       | Eliminated    |
| Filters          | Local State   | Global State  |
| Theme            | Basic         | Redux Managed |
| Optimization     | Partial       | Advanced      |
| Architecture     | SSR-focused   | State-focused |

---

## 🎯 Final Reflection

AI was used strictly as a **learning aid**, not for implementation.

### Key Learnings:

* Redux Toolkit simplifies complex state management
* Global state improves scalability
* Performance optimization is essential for large apps
* Proper architecture reduces bugs and improves maintainability

This upgrade reflects a **real-world application structure**, similar to production-level frontend systems.
