# First increment decisions

The first vertical slice is a responsive home screen and a free drawing workspace. A child can select a color and size, draw with a pointer, erase, undo, redo, and clear after confirmation. Canvas coordinates and widths are normalized; redraw uses the current canvas dimensions and device pixel ratio. Stroke history lives outside the canvas renderer so it can later be saved or rendered by another surface.

The app accepts the first active finger, stylus, or mouse pointer and ignores additional pointers until it finishes. A cancelled or interrupted pointer keeps the points collected so far. This is not palm rejection. Real-device input and orientation behavior still need verification.

The current stroke history is memory-only. IndexedDB, backup, letter tracing, PWA caching, and native packaging are intentionally deferred. Until saving and recovery are built, a refresh loses the drawing.
