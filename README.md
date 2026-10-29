# Little Lines

A small, child-friendly drawing app built with React, TypeScript, and Vite. This first milestone focuses on a usable drawing surface; letter practice is planned, not yet implemented.

## Get started

Requires Node.js 20.19+ or 22.13+ (or a newer supported release).

```sh
npm install
npm run dev
```

Open `http://localhost:5180/` or the network URL printed by Vite. The development server uses port 5180 and reports an error if that port is already in use. For a production build and checks:

```sh
npm run lint
npm test
npm run build
```

## How it works

`src/App.tsx` contains the home and drawing screens. `src/features/drawing/DrawingCanvas.tsx` handles Pointer Events and canvas resizing; `src/engine/drawing.ts` owns normalized stroke data, rendering, and history. Strokes are resolution-independent and remain editable in memory as the canvas resizes. A new stroke after undo clears the redo branch. Erasing is an editable stroke, so it can be undone. Clear removes all history after confirmation.

The drawing surface fills the screen. The drawing tools start at the bottom left and colors at the bottom right. Tap the selected tool or color to expand its palette vertically. The brush and eraser remain visible side by side; erasing becomes available after a brush stroke. Clear is in the expanded tools, asks for confirmation, and returns to the brush. On small screens, swipe along an open palette to reach the remaining options.

Finger, stylus, and mouse input are accepted. One pointer is accepted at a time; the app does not currently distinguish a palm from a finger or implement palm rejection. Interrupted strokes are retained. Pointer moves redraw the canvas without triggering React updates for each point.

**Drawings are currently held in memory only.** Returning home preserves the current drawing while the page stays open, but refresh, closing the tab, or a browser crash will lose it. Saving, a gallery, backup, and offline/PWA support are future milestones. Browser storage is not the same as native app storage and can be cleared or evicted; a future backup feature will be important before relying on local storage for artwork.

## iPad testing

Start the dev server and open its network URL on an iPad on the same network. Test finger and Apple Pencil drawing, continuous lines, scrolling and zoom gestures, undo/redo, erasing, and rotation in portrait and landscape. Also check interruptions and switching apps. These behaviors have **not yet been verified on physical hardware**; browser Pointer Events alone do not establish Apple Pencil or palm-rejection support.

## Next milestones

See [TASKS.md](TASKS.md) for the phased backlog. Persistence and backup come before a full tracing system; native packaging follows a stable web experience.
