export const initialState = {
  theme: 'dark',
  activeTab: 'reels',
  activeRoom: 'appeal-hub',
  evidenceList: [],
  filterTag: '',
  currentPage: 1,
  pageSize: 6,
  messages: [],
};

export function appReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'SET_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_FILTER':
      return { ...state, filterTag: action.payload, currentPage: 1 };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_EVIDENCE':
      return { ...state, evidenceList: action.payload };
    case 'APPEND_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
}