import { useReducer } from 'react';
import { canDispatch, initialState, relationshipReducer } from '../fsm/relationshipMachine.js';
import { PhaseStepper } from './PhaseStepper.jsx';

const EXIT_TEXT = {
  TIMEOUT: 'Seen không rep — hết giờ chờ.',
  SWITCHED: 'Người ấy đã chọn Ai Đó.',
  STOPPED: 'Em chọn Dừng Lại.',
  UNBOUND: 'Đã unbind, giải phóng bộ nhớ.',
};

export function SituationshipAnalyzer() {
  const [state, dispatch] = useReducer(relationshipReducer, initialState);
  const { phase, exitReason } = state;

  // Buttons are disabled from the same guard the reducer uses
  const can = (type) => canDispatch(state, type);

  return (
    <article aria-label="Hẹn Hò Nhưng Không Yêu Analyzer" data-phase={phase}>
      <header>
        <h2>Trạng thái</h2>
        <PhaseStepper phase={phase} />
        {phase === 'GHOSTED_EXIT' && exitReason && <p data-exit-reason={exitReason}>{EXIT_TEXT[exitReason]}</p>}
      </header>

      <section aria-labelledby="actions-heading">
        <h2 id="actions-heading">Hành động</h2>
        <ul role="list">
          <li>
            <button type="button" disabled={!can('START_DATING')} onClick={() => dispatch({ type: 'START_DATING' })}>
              Bắt đầu hẹn hò
            </button>
          </li>
          <li>
            <button type="button" disabled={!can('CONFESS')} onClick={() => dispatch({ type: 'CONFESS' })}>
              Tỏ tình
            </button>
          </li>
          <li>
            <button type="button" disabled={!can('STOP')} onClick={() => dispatch({ type: 'STOP' })}>
              Dừng Lại
            </button>
          </li>
          <li>
            <button type="button" disabled={!can('UNBIND')} onClick={() => dispatch({ type: 'UNBIND' })}>
              Unbind &amp; Free Memory
            </button>
          </li>
          <li>
            <button type="button" disabled={!can('RESET')} onClick={() => dispatch({ type: 'RESET' })}>
              Làm lại
            </button>
          </li>
        </ul>
      </section>
    </article>
  );
}
