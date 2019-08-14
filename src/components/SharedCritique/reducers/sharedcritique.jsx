const initialState = {
  loading: true,
  linkedCritique: {},
  error: null,
  saved: false,
  submitted: false,
  hasUnsavedChanges: false,
};

export default function sharedcritique(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_CRITIQUE':
      return {
        ...state,
        loading: true,
        submitted: false,
        hasUnsavedChanges: false,
        saved: false,
      };
    case 'SET_CRITIQUE':
      return {
        ...state,
        linkedCritique: action.linkedCritique,
        loading: false,
      };
    case 'UPDATE_SUMMARY':
      return {
        ...state,
        linkedCritique: {
          ...state.linkedCritique,
          summary: action.summary,
        },
        saved: false,
        hasUnsavedChanges: true,
      };
    case 'RESET_EDIT':
      return {
        ...state,
        error: null,
        saved: false,
        hasUnsavedChanges: false,
      };
    case 'EDIT_ERRORED':
      return {
        ...state,
        error: action.error,
        hasUnsavedChanges: true,
      };
    case 'EDIT_SAVED':
      return {
        ...state,
        saved: true,
        hasUnsavedChanges: false,
      };
    case 'EDIT_SUBMITTED':
      return {
        ...state,
        submitted: true,
      };
    default:
      return state;
  }
}
