const initialState = {
  currentCritique: '',
  isCritiquerRequestQueued: false,
  loading: false,
  profileIndustries: '',
};

export default function critiqueothers(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_CURRENT_CRITIQUE':
      return {
        ...state,
        loading: true,
      };
    case 'SET_CURRENT_CRITIQUE':
      return {
        ...state,
        currentCritique: action.id,
        loading: false,
      };
    case 'SET_PROFILE_INDUSTRIES':
      return {
        ...state,
        profileIndustries: action.industries,
      };
    case 'SET_CRITIQUER_REQUEST_QUEUED':
      return {
        ...state,
        isCritiquerRequestQueued: action.queued,
      };
    default:
      return state;
  }
}
