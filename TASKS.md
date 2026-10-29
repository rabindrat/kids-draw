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

- [ ] Define normalized letter templates with stroke order and starting points.
- [ ] Build a tracing activity, animated demonstrations, forgiving feedback, and retry/completion states.
- [ ] Validate a small initial set of letters before expanding.

## Offline and native

- [ ] Add local progress, a PWA manifest, and a service worker; verify offline startup and recovery.
- [ ] Conduct family usability sessions.
- [ ] Consider Capacitor and native storage testing after the web experience is stable.
