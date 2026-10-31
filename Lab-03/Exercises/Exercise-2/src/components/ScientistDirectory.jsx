import { useId, useState } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople.js';

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

/**
 * Pioneer directory with derived search / filter / sort state.
 * @param {{ initialData?: ReadonlyArray<{id: string, name: string, age: number, iq: number}> }} props
 */
export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  // One useId per control: label htmlFor <-> input id, unique even with two directories
  const headingId = useId();
  const queryId = useId();
  const iqId = useId();
  const sortId = useId();

  // Source-of-truth state: only raw, independent inputs
  const [people] = useState(initialData);        // setter added in Step 4 (delete/reset)
  const [query, setQuery] = useState('');
  const [minIq, setMinIq] = useState(160);
  const [sortBy, setSortBy] = useState('iq-desc');

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

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>Pioneers</h2>

      {/* role="search" landmark; Enter must not reload the page */}
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <p>
          <label htmlFor={queryId}>Name</label>
          <input
            id={queryId}
            type="search"
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </p>
        <p>
          <label htmlFor={iqId}>Minimum IQ</label>
          <input
            id={iqId}
            type="number"
            inputMode="numeric"
            min="0"
            max="250"
            step="5"
            value={minIq}
            onChange={handleIqChange}
          />
        </p>
        <p>
          <label htmlFor={sortId}>Sort by</label>
          <select id={sortId} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            {Object.entries(SORT_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </p>
      </form>

      <ul>
        {visible.map((person) => (
          <li key={person.id}>
            {person.name} — IQ {person.iq}, age {person.age}
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p>No pioneers match these filters.</p>}
    </section>
  );
}