import { useCallback, useEffect, useRef, useState } from 'react';
import { INITIAL_DROPS } from '../domain/drops.js';
import { ClaimConflictError, claimDrop, isAbortError } from '../api/claimDrop.js';

/**
 * Drop stock with optimistic claims.
 * Flow: lock the drop -> stock - 1 right away -> ask the server ->
 * success reconciles with the server stock, any failure restores the previous stock.
 */
export function useDropClaims() {
  const [drops, setDrops] = useState(INITIAL_DROPS);
  const [inFlight, setInFlight] = useState({}); // { [dropId]: true } - only for rendering
  const [notice, setNotice] = useState(null);   // { id, kind: 'success' | 'conflict' | 'error', title }

  // The ref is the real lock: two clicks in the same tick both see the same stale state
  const lockedIdsRef = useRef(new Set());
  const controllersRef = useRef(new Set());
  const noticeCountRef = useRef(0);

  // Leaving the page cancels every pending claim
  useEffect(() => {
    const controllers = controllersRef.current;
    return () => controllers.forEach((controller) => controller.abort());
  }, []);

  const setStock = (dropId, remainingStock) =>
    setDrops((prev) => prev.map((d) => (d.id === dropId ? { ...d, remainingStock } : d)));

  const claim = useCallback(
    async (dropId) => {
      const drop = drops.find((d) => d.id === dropId);
      if (!drop || drop.remainingStock <= 0) return;
      if (lockedIdsRef.current.has(dropId)) return; // duplicate click while in flight

      const previousStock = drop.remainingStock;
      const controller = new AbortController();
      lockedIdsRef.current.add(dropId);
      controllersRef.current.add(controller);
      setInFlight((prev) => ({ ...prev, [dropId]: true }));
      setNotice(null);
      setStock(dropId, previousStock - 1); // optimistic

      try {
        const result = await claimDrop(dropId, { signal: controller.signal });
        setStock(dropId, result.remainingStock); // server is the source of truth
        noticeCountRef.current += 1;
        setNotice({ id: noticeCountRef.current, kind: 'success', title: drop.title });
      } catch (error) {
        if (isAbortError(error)) return; // unmounted, nothing left to update
        setStock(dropId, previousStock); // rollback
        // Report instead of rethrowing: this runs from a click handler, so a throw
        // would only become an unhandled rejection the user never sees
        const kind = error instanceof ClaimConflictError ? 'conflict' : 'error';
        noticeCountRef.current += 1;
        setNotice({ id: noticeCountRef.current, kind, title: drop.title });
      } finally {
        lockedIdsRef.current.delete(dropId);
        controllersRef.current.delete(controller);
        setInFlight((prev) => ({ ...prev, [dropId]: false }));
      }
    },
    [drops],
  );

  return { drops, inFlight, notice, claim };
}
