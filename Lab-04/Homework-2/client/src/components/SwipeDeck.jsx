import { useState } from 'react';
import { requestJson } from '../api.js';
import ProfileCard from './ProfileCard.jsx';
import styles from './Deck.module.css';

// Owns the swipe history. Everything else (current card, remaining count) is derived from it.
export default function SwipeDeck({ profiles, initialSwipes }) {
  // History = saved swipe records from the server, oldest first (the future LIFO stack)
  const [history, setHistory] = useState(initialSwipes);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  // Derived during render: a profile is still in the deck if it has no swipe record
  const swipedIds = new Set(history.map((s) => s.profileId));
  const remaining = profiles.filter((p) => !swipedIds.has(p._id));
  const current = remaining[0] ?? null;

  // Save first, then push the server record (it carries the _id needed for undo)
  const swipe = async (direction) => {
    if (!current || pending) return;
    setPending(true);
    setError(null);
    try {
      const saved = await requestJson('/swipes', {
        method: 'POST',
        body: JSON.stringify({ profileId: current._id, direction }),
      });
      setHistory((prev) => [...prev, saved]);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  };

  return (
    <section className={styles.deck} aria-labelledby="deck-title">
      <h2 id="deck-title" className={styles.srOnly}>Swipe deck</h2>
      <p className={styles.counter} role="status">
        {remaining.length} of {profiles.length} profiles left
      </p>

      {current ? (
        <ProfileCard profile={current} />
      ) : (
        <p className={styles.empty}>No more profiles. Maybe it is time to text someone back.</p>
      )}

      <p className={styles.controls}>
        <button type="button" onClick={() => swipe('left')} disabled={!current || pending}>
          <span aria-hidden="true">←</span> Nope
        </button>
        <button type="button" onClick={() => swipe('up')} disabled={!current || pending}>
          <span aria-hidden="true">↑</span> Super
        </button>
        <button type="button" onClick={() => swipe('right')} disabled={!current || pending}>
          Like <span aria-hidden="true">→</span>
        </button>
      </p>

      {error && <p role="alert" className={styles.error}>Swipe not saved: {error}</p>}
    </section>
  );
}