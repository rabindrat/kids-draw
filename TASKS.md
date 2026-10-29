# Project backlog

## Foundation and drawing MVP

- [x] Initialize a React, Vite, and strict TypeScript application.
- [x] Add linting, unit tests, and production build scripts.
- [x] Create a responsive home screen and drawing workspace.
- [x] Add normalized Pointer Events input, high-DPI canvas rendering, and resize redraw.
- [x] Add brush colors and sizes, eraser, undo, redo, and confirmed clear.
- [x] Test stroke history, coordinate conversion, and stroke serialization.
- [ ] Test finger input, Apple Pencil, orientation, gestures, and interruptions on a real iPad.
- [ ] Add browser-level tests for the main user journeys.

## Saving artwork

- [ ] Add versioned IndexedDB storage, save and restore.
- [ ] Build an artwork gallery and add validated backup and import.

## Alphabet practice

- [x] Add normalized uppercase and lowercase templates for A–Z.
- [x] Add tracing, forgiving geometric feedback, retry, celebration, and sequential advancement.
- [x] Save alphabet progress locally in IndexedDB and restore it on reopening.
- [ ] Add stroke-order indicators and animated demonstrations.
- [ ] Validate the letter guides and feedback with children on a real iPad.

## Word practice

- [x] Add a second practice level with short words and a word picker.
- [x] Track word progress separately from alphabet progress in IndexedDB.
- [ ] Validate word guides and matching with children on a real iPad.

## Offline and native

- [ ] Add a PWA manifest and a service worker; verify offline startup and recovery.
- [ ] Conduct family usability sessions.
- [ ] Consider Capacitor and native storage testing after the web experience is stable.
