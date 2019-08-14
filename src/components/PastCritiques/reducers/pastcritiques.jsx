const initialState = {
  critiques: [],
  pooledcritiques: [],
  loading: false,
};

export default function pastcritiques(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_CRITIQUES':
      return {
        ...state,
        loading: true,
      };
    case 'SET_CRITIQUES':
      return {
        ...state,
        critiques: action.profile.matchedcritiqueSet,
        pooledcritiques: action.profile.pooledcritiqueSet,
        linkedcritiques: action.profile.linkedcritiqueSet,
        loading: false,
      };
    default:
      return state;
  }
}
