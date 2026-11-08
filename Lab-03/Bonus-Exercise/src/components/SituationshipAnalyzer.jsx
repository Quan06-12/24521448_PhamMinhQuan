import { useReducer } from 'react';
import {
  ACTOR_LABELS,
  canDispatch,
  initialState,
  relationshipReducer,
} from '../fsm/relationshipMachine.js';
import { deriveEffort, formatScore } from '../fsm/effort.js';
import { useGhostTimer } from '../hooks/useGhostTimer.js';
import { PhaseStepper } from './PhaseStepper.jsx';
import { SignalForm } from './SignalForm.jsx';
import { EffortReport } from './EffortReport.jsx';
import styles from './SituationshipAnalyzer.module.css';

const EXIT_TEXT = {
  TIMEOUT: 'Seen không rep — hết giờ chờ.',
  SWITCHED: 'Người ấy đã chọn Ai Đó.',
  STOPPED: 'Em chọn Dừng Lại.',
  UNBOUND: 'Đã unbind, giải phóng bộ nhớ.',
};

export function SituationshipAnalyzer() {
  const [state, dispatch] = useReducer(relationshipReducer, initialState);
  const { phase, signals, pendingMessage, exitReason } = state;

  // Derived every render from the log; nothing here is kept in state
  const effort = deriveEffort(signals, phase);
  const secondsLeft = useGhostTimer(phase, pendingMessage, dispatch);

  // Buttons are disabled from the same guard the reducer uses
  const can = (type) => canDispatch(state, type);

  // Ids and timestamps are made here, so the reducer stays pure
  const sendMessage = () => {
    dispatch({ type: 'SEND_MESSAGE', messageId: crypto.randomUUID(), sentAt: Date.now() });
  };
  const addSignal = (signal) => dispatch({ type: 'ADD_SIGNAL', signal });

  return (
    <article className={styles.analyzer} aria-label="Hẹn Hò Nhưng Không Yêu Analyzer" data-phase={phase}>
      <header className={`${styles.panel} ${styles.wide}`}>
        <h2>Trạng thái</h2>
        <PhaseStepper phase={phase} />
        {phase === 'GHOSTED_EXIT' && exitReason && <p className={styles.exit} data-exit-reason={exitReason}>{EXIT_TEXT[exitReason]}</p>}
      </header>

      <EffortReport className={styles.panel} effort={effort} />

      <section className={styles.panel} aria-labelledby="chat-heading">
        <h2 id="chat-heading">Tin nhắn</h2>
        {secondsLeft === null ? (
          <p className={styles.countdown} data-countdown="idle">Không có tin nhắn nào đang chờ.</p>
        ) : (
          <p className={styles.countdown} data-countdown="running">
            Đã seen, chờ rep: <strong data-seconds-left={secondsLeft}>{secondsLeft}</strong> giây
          </p>
        )}
        <ul className={styles.actions} role="list">
          <li>
            <button className={styles.button} type="button" disabled={!can('SEND_MESSAGE')} onClick={sendMessage}>
              Gửi tin nhắn
            </button>
          </li>
          <li>
            <button className={styles.button} type="button" disabled={!can('REPLY')} onClick={() => dispatch({ type: 'REPLY' })}>
              Người ấy rep
            </button>
          </li>
          <li>
            <button
              className={styles.button}
              type="button"
              disabled={!can('SWITCH_TO_AI_DO')}
              onClick={() => dispatch({ type: 'SWITCH_TO_AI_DO' })}
            >
              Người ấy chọn Ai Đó
            </button>
          </li>
        </ul>
      </section>

      <section className={`${styles.panel} ${styles.wide}`} aria-labelledby="actions-heading">
        <h2 id="actions-heading">Hành động</h2>
        <ul className={styles.actions} role="list">
          <li>
            <button className={styles.button} type="button" disabled={!can('START_DATING')} onClick={() => dispatch({ type: 'START_DATING' })}>
              Bắt đầu hẹn hò
            </button>
          </li>
          <li>
            <button className={styles.button} type="button" disabled={!can('CONFESS')} onClick={() => dispatch({ type: 'CONFESS' })}>
              Tỏ tình
            </button>
          </li>
          <li>
            <button className={styles.danger} type="button" disabled={!can('STOP')} onClick={() => dispatch({ type: 'STOP' })}>
              Dừng Lại
            </button>
          </li>
          <li>
            <button className={styles.danger} type="button" disabled={!can('UNBIND')} onClick={() => dispatch({ type: 'UNBIND' })}>
              Unbind &amp; Free Memory
            </button>
          </li>
          <li>
            <button className={styles.button} type="button" disabled={!can('RESET')} onClick={() => dispatch({ type: 'RESET' })}>
              Làm lại
            </button>
          </li>
        </ul>
      </section>

      <section className={`${styles.panel} ${styles.wide}`} aria-labelledby="log-heading">
        <h2 id="log-heading">Nhật ký tín hiệu</h2>
        <SignalForm disabled={!can('ADD_SIGNAL')} onAdd={addSignal} />
        {/* Newest first; toReversed keeps the log itself untouched */}
        <ul className={styles.log} role="list">
          {signals.toReversed().map((signal) => (
            <li key={signal.id} data-actor={signal.actor}>
              {ACTOR_LABELS[signal.actor]}: {signal.steps} × {signal.multiplier} ={' '}
              {formatScore(Math.round(signal.steps * signal.multiplier * 10) / 10)}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
