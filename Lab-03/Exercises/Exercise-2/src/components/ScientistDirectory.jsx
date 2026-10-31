import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { SMART_PEOPLE } from '../data/smartPeople.js';
import styles from './ScientistDirectory.module.css';
// Comparators defined once at module level (not recreated per render)
const SORTERS = {
  'iq-desc': (a, b) => b.iq - a.iq,
  'iq-asc': (a, b) => a.iq - b.iq,
  'age-asc': (a, b) => a.age - b.age,
  'age-desc': (a, b) => b.age - a.age,
};
const SORT_LABELS = {
  'iq-desc': 'IQ (high to low)',
  'iq-asc': 'IQ (low to high)',
  'age-asc': 'Age (young to old)',
  'age-desc': 'Age (old to young)',
};
// Tie-breaker so equal IQ/age rows keep a deterministic order
const byName = (a, b) => a.name.localeCompare(b.name);

const DEFAULT_MIN_IQ = 160;
const DEFAULT_SORT = 'iq-desc';

/**
 * Pioneer directory with derived search / filter / sort state, delete and reset.
 * @param {{ initialData?: ReadonlyArray<{id: string, name: string, age: number, iq: number}> }} props
 */
export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  // One useId per control: label htmlFor <-> input id, unique even with two directories
  const headingId = useId();
  const queryId = useId();
  const iqId = useId();
  const sortId = useId();

  // Source-of-truth state: only raw, independent inputs
  const [people, setPeople] = useState(initialData);
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(DEFAULT_MIN_IQ);
  const [sortBy, setSortBy] = useState(DEFAULT_SORT);

  // DOM handles for focus management (never read during render)
  const headingRef = useRef(null);
  const deleteButtonsRef = useRef(new Map()); // person.id -> <button>

  // Derived state: computed during render in one pass, no extra state or effect hooks.
  // toSorted() returns a new array (ES2023); sort() would mutate and throws on a frozen array.
  const needle = query.trim().toLowerCase();
  const visible = people
    .filter((p) => p.name.toLowerCase().includes(needle) && p.iq >= minIq)
    .toSorted((a, b) => SORTERS[sortBy](a, b) || byName(a, b));

  // e.target.value is always a string ('35' + 1 === '351'); valueAsNumber is a number or NaN
  const handleIqChange = (e) => {
    const value = e.target.valueAsNumber;
    setMinIq(Number.isNaN(value) ? 0 : value);
  };

  const handleDelete = (id) => {
    // Pick the neighbour that should receive focus BEFORE the row disappears
    const index = visible.findIndex((p) => p.id === id);
    const nextId = (visible[index + 1] ?? visible[index - 1])?.id;

    // Immutable removal; flushSync commits the DOM now so focus can move right after
    flushSync(() => setPeople((prev) => prev.filter((p) => p.id !== id)));

    // Keyboard users never fall back to <body>: next/previous Delete button, else the heading
    const target = nextId ? deleteButtonsRef.current.get(nextId) : headingRef.current;
    target?.focus();
  };

  const handleReset = () => {
    setPeople(initialData); // restore the original frozen snapshot
    setQuery('');
    setMinIq(DEFAULT_MIN_IQ);
    setSortBy(DEFAULT_SORT);
  };

   return (
    <section className={styles.panel} aria-labelledby={headingId}>
      {/* tabIndex -1: focusable by script (after the last delete), not a Tab stop */}
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className={styles.heading}>Pioneers</h2>

      {/* role="search" landmark; Enter must not reload the page */}
      <form role="search" className={styles.filters} onSubmit={(e) => e.preventDefault()}>
        <p className={styles.field}>
          <label htmlFor={queryId}>Name</label>
          <input
            id={queryId}
            className={styles.control}
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={iqId}>Minimum IQ</label>
          <input
            id={iqId}
            className={styles.control}
            type="number"
            inputMode="numeric"
            min="0"
            max="250"
            step="5"
            value={minIq}
            onChange={handleIqChange}
          />
        </p>
        <p className={styles.field}>
          <label htmlFor={sortId}>Sort by</label>
          <select id={sortId} className={styles.control} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </p>
        <p className={styles.actions}>
          <button type="button" className={styles.button} onClick={handleReset}>Reset directory</button>
        </p>
      </form>

      {/* Screen readers announce the new count after every search, filter, delete or reset */}
      <output className={styles.status} role="status" aria-live="polite">
        Found {visible.length} of {people.length} pioneers
      </output>

      <ul className={styles.list} role="list">
        {visible.map((person) => (
          <li key={person.id} className={styles.row}>
            <span className={styles.person}>
              <strong>{person.name}</strong>
              <small>IQ {person.iq} · age {person.age}</small>
            </span>
            <button
              type="button"
              className={styles.button}
              aria-label={`Delete ${person.name}`}
              onClick={() => handleDelete(person.id)}
              // React 19 ref callback with cleanup: register on mount, unregister on unmount
              ref={(node) => {
                deleteButtonsRef.current.set(person.id, node);
                return () => deleteButtonsRef.current.delete(person.id);
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className={styles.empty}>No pioneers match these filters.</p>}
    </section>
  );
}