import { PHASES, PHASE_LABELS } from '../fsm/relationshipMachine.js';

/**
 * Read-only view of the machine; aria-current lets screen readers (and tests) find the active phase.
 * @param {{ phase: string }} props
 */
export function PhaseStepper({ phase }) {
  return (
    <nav aria-label="Giai đoạn">
      <ol>
        {PHASES.map((name) => (
          <li key={name} aria-current={name === phase ? 'step' : undefined} data-phase={name}>
            {PHASE_LABELS[name]}
          </li>
        ))}
      </ol>
    </nav>
  );
}
