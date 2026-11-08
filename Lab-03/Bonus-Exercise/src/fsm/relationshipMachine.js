// "Hẹn Hò Nhưng Không Yêu" as one finite state machine.
// A single `phase` replaces isDating / isLoved / hasTitle, so impossible combos cannot exist.

export const PHASES = ['FRIENDS', 'DATING_NO_LOVE', 'OFFICIAL_LOVE', 'GHOSTED_EXIT'];

export const PHASE_LABELS = {
  FRIENDS: 'Bạn bè',
  DATING_NO_LOVE: 'Hẹn hò nhưng không yêu',
  OFFICIAL_LOVE: 'Chính thức yêu',
  GHOSTED_EXIT: 'Ghosted — rời đi',
};

// How long the other side has to reply before the wait counts as "seen không rep"
export const REPLY_WINDOW_MS = 5000;

// Asymmetric effort: one step from Ai Đó outweighs hundreds from Em
export const EFFORT_MULTIPLIER = {
  EM: 0.1,
  AI_DO: 50,
};

export const ACTOR_LABELS = {
  EM: 'Em',
  AI_DO: 'Ai Đó',
};

// Which actions each phase accepts. Anything missing here is ignored by the reducer.
const TRANSITIONS = {
  FRIENDS: ['START_DATING', 'ADD_SIGNAL', 'RESET'],
  DATING_NO_LOVE: [
    'ADD_SIGNAL',
    'SEND_MESSAGE',
    'REPLY',
    'GHOST_TIMEOUT',
    'SWITCH_TO_AI_DO',
    'CONFESS',
    'STOP',
    'UNBIND',
    'RESET',
  ],
  OFFICIAL_LOVE: ['ADD_SIGNAL', 'UNBIND', 'RESET'],
  GHOSTED_EXIT: ['RESET'],
};

// Seed log mirrors the slide: "Em cố trăm lần" vs "Ai đó một phần".
// Fixed ids because these exist before any event handler runs.
const SEED_SIGNALS = [
  { id: 'seed-em', actor: 'EM', steps: 100, multiplier: EFFORT_MULTIPLIER.EM },
  { id: 'seed-ai-do', actor: 'AI_DO', steps: 1, multiplier: EFFORT_MULTIPLIER.AI_DO },
];

export const initialState = {
  phase: 'FRIENDS',
  signals: SEED_SIGNALS,
  pendingMessage: null, // { id, sentAt } while waiting for a reply
  exitReason: null, // 'TIMEOUT' | 'SWITCHED' | 'STOPPED' | 'UNBOUND'
};

/**
 * Guard used by both the reducer and the buttons, so the UI never offers an action
 * the machine would drop.
 * @param {typeof initialState} state
 * @param {string} type
 */
export function canDispatch(state, type) {
  if (!TRANSITIONS[state.phase].includes(type)) return false;
  // One message in flight at a time; reply / timeout only make sense while one is pending
  if (type === 'SEND_MESSAGE') return state.pendingMessage === null;
  if (type === 'REPLY' || type === 'GHOST_TIMEOUT') return state.pendingMessage !== null;
  return true;
}

function isValidSignal(signal) {
  return (
    typeof signal?.id === 'string' &&
    signal.actor in EFFORT_MULTIPLIER &&
    Number.isFinite(signal.steps) &&
    signal.steps > 0
  );
}

function exitWith(state, exitReason) {
  return { ...state, phase: 'GHOSTED_EXIT', pendingMessage: null, exitReason };
}

/**
 * Pure reducer: ids and timestamps arrive in the action (made in event handlers),
 * so the same action always gives the same next state.
 */
export function relationshipReducer(state, action) {
  if (!canDispatch(state, action.type)) return state;

  switch (action.type) {
    case 'START_DATING':
      return { ...state, phase: 'DATING_NO_LOVE' };

    case 'ADD_SIGNAL':
      if (!isValidSignal(action.signal)) return state;
      return { ...state, signals: [...state.signals, action.signal] };

    case 'SEND_MESSAGE':
      return { ...state, pendingMessage: { id: action.messageId, sentAt: action.sentAt } };

    case 'REPLY':
      return { ...state, pendingMessage: null };

    case 'GHOST_TIMEOUT':
      // A late timeout from an older message must not end the current wait
      if (action.messageId !== state.pendingMessage.id) return state;
      return exitWith(state, 'TIMEOUT');

    case 'SWITCH_TO_AI_DO':
      return exitWith(state, 'SWITCHED');

    case 'STOP':
      return exitWith(state, 'STOPPED');

    case 'UNBIND':
      return exitWith(state, 'UNBOUND');

    case 'CONFESS':
      return { ...state, phase: 'OFFICIAL_LOVE', pendingMessage: null };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
