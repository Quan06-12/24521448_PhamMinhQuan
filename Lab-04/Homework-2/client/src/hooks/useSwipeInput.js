import { useRef, useState } from 'react';

// Distance (px) a drag must travel before it counts as a swipe
export const SWIPE_THRESHOLD = 80;

// Pure helper: which direction does a drag offset represent (or null)?
export function directionFromOffset({ x, y }) {
  if (-y > SWIPE_THRESHOLD && Math.abs(y) > Math.abs(x)) return 'up';
  if (x > SWIPE_THRESHOLD) return 'right';
  if (x < -SWIPE_THRESHOLD) return 'left';
  return null;
}

// Keyboard + pointer (mouse, pen, touch) input for the deck.
// Returns props for the focusable deck region, props for the card, and the live drag offset.
export function useSwipeInput({ onSwipe, onUndo, enabled }) {
  const start = useRef(null); // pointer start position, not rendered -> ref
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // rendered -> state

  const KEY_TO_DIRECTION = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up' };

  const onKeyDown = (e) => {
    if (e.repeat) return; // holding a key must not fire many swipes
    const direction = KEY_TO_DIRECTION[e.key];
    if (direction) {
      e.preventDefault(); // stop arrow keys from scrolling the page
      if (enabled) onSwipe(direction);
    } else if (e.key === 'Backspace' && onUndo) {
      e.preventDefault(); // older browsers navigate back on Backspace
      onUndo();
    }
  };

  const onPointerDown = (e) => {
    if (!enabled || e.button !== 0) return; // primary button / touch only
    start.current = { x: e.clientX, y: e.clientY };
    // Keep receiving moves even if the pointer leaves the card
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!start.current) return;
    setOffset({ x: e.clientX - start.current.x, y: e.clientY - start.current.y });
  };

  const finish = (e, commit) => {
    if (!start.current) return;
    const final = { x: e.clientX - start.current.x, y: e.clientY - start.current.y };
    start.current = null;
    setOffset({ x: 0, y: 0 }); // snap back; the next card renders in place
    const direction = commit ? directionFromOffset(final) : null;
    if (direction) onSwipe(direction);
  };

  return {
    offset,
    regionProps: { onKeyDown, tabIndex: 0 },
    cardProps: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (e) => finish(e, true),
      onPointerCancel: (e) => finish(e, false), // e.g. the browser took over the touch
    },
  };
}