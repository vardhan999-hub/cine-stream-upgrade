# 🧪 Prompts.md — Testing Suite Notes

**Project:** Testing Suite
**Week:** 11
**Track:** Frontend (Testing)
**Name:** Tadigadapa Harshavardhan

---

## 📌 Overview

This file contains the prompts I used while learning and building the testing part of my project.

I used AI mainly to understand concepts and clear doubts.
All the code, debugging, and final implementation were done by me.

---

## 🔹 Prompt 1 — What is Jest and React Testing Library?

**Prompt:**
What is Jest? What is React Testing Library?

**What I understood:**

* Jest is used to run tests and show results (pass/fail)
* React Testing Library is used to test UI like how a user interacts

**What I did:**

* Installed required packages
* Set up Jest config and setupTests file

---

## 🔹 Prompt 2 — Basic Component Testing

**Prompt:**
How to test if a component renders properly?

**What I did:**

* Tested Button, Input, and Counter components
* Checked if they render without crashing
* Verified text using props

---

## 🔹 Prompt 3 — User Interaction Testing

**Prompt:**
How to simulate user actions in tests?

**What I did:**

* Used userEvent for clicking buttons
* Used userEvent.type for input fields
* Verified UI updates after actions

Example: clicking increment changes value

---

## 🔹 Prompt 4 — Why use getByRole?

**Prompt:**
Why use getByRole instead of getByTestId?

**What I understood:**

* getByRole is closer to how users interact
* It makes tests more realistic

**What I did:**

* Replaced most testId usage with getByRole
* Used getByTestId only where needed

---

## 🔹 Prompt 5 — Testing State Changes

**Prompt:**
How to test state updates in React?

**What I did:**

* Tested Counter component
* Checked increment, decrement, and reset
* Also handled min and max values

---

## 🔹 Prompt 6 — Mocking API Calls

**Prompt:**
How to mock fetch in Jest?

**What I did:**

* Used global.fetch with jest.fn()
* Returned fake data instead of calling real API

---

## 🔹 Prompt 7 — Testing API Scenarios

**Prompt:**
How to test loading and error states?

**What I did:**

* Tested loading state
* Tested success response
* Tested error case
* Tested empty state

---

## 🔹 Prompt 8 — Test Coverage

**Prompt:**
How to check test coverage?

**What I did:**

* Ran coverage command
* Improved tests to cover more cases

Final result:

* Coverage above 90%

---

## 🔧 Extra Work Done by Me

* Organized files properly
* Used separate test files for each component
* Made sure all tests pass without errors
* Improved readability of tests

---

## 🎯 Final Thoughts

* Testing helped me understand my code better
* Writing tests feels difficult at first, but becomes easier
* Mocking APIs is important for reliable tests

This project helped me understand how testing works in real projects.
