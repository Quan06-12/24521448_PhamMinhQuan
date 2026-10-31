import { useId } from 'react';
import { SMART_PEOPLE } from '../data/smartPeople.js';

/**
 * Pioneer directory. Step 1: render the normalized dataset with stable keys.
 * @param {{ initialData?: ReadonlyArray<{id: string, name: string, age: number, iq: number}> }} props
 */
export function ScientistDirectory({ initialData = SMART_PEOPLE }) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>Pioneers</h2>
      <ul>
        {initialData.map((person) => (
          // Stable entity id as key, never the array index
          <li key={person.id}>
            {person.name} — IQ {person.iq}, age {person.age}
          </li>
        ))}
      </ul>
    </section>
  );
}