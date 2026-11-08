import { useId } from 'react';
import { ACTOR_LABELS, EFFORT_MULTIPLIER } from '../fsm/relationshipMachine.js';
import styles from './SignalForm.module.css';

/**
 * Logs one effort signal. Uncontrolled inputs, read once on submit.
 * @param {{ disabled: boolean, onAdd: (signal: object) => void }} props
 */
export function SignalForm({ disabled, onAdd }) {
  const actorId = useId();
  const stepsId = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const actor = form.elements.namedItem('actor').value;
    const raw = form.elements.namedItem('steps').valueAsNumber;
    const steps = Number.isNaN(raw) ? 0 : Math.floor(raw);
    // The reducer drops 0-step signals, so an empty field is a harmless no-op
    onAdd({ id: crypto.randomUUID(), actor, steps, multiplier: EFFORT_MULTIPLIER[actor] });
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className={styles.fieldset} disabled={disabled}>
        <legend>Thêm tín hiệu</legend>
        <label htmlFor={actorId}>Ai cố gắng</label>
        <select className={styles.field} id={actorId} name="actor" defaultValue="EM">
          {Object.keys(ACTOR_LABELS).map((actor) => (
            <option key={actor} value={actor}>
              {ACTOR_LABELS[actor]} (×{EFFORT_MULTIPLIER[actor]})
            </option>
          ))}
        </select>
        <label htmlFor={stepsId}>Số lần cố</label>
        <input
          className={styles.field}
          id={stepsId}
          name="steps"
          type="number"
          min="0"
          step="1"
          inputMode="numeric"
          defaultValue="10"
        />
        <button className={styles.submit} type="submit">Thêm</button>
      </fieldset>
    </form>
  );
}
