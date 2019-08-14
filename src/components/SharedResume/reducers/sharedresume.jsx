const initialState = {
  resume: null,
  critiqueToken: null,
  linkedTokenKey: null,
  loading: true,
  linkedCritiqueCreated: null,
};

export default function sharedresume(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_LINKED_RESUME':
      return {
        ...state,
        resume: null,
        loading: true,
      };
    case 'SET_LINKED_RESUME':
      return {
        ...state,
        resume: action.resume,
        loading: false,
      };
    case 'SET_LINKED_CRITIQUE_CREATED':
      return {
        ...state,
        linkedCritiqueCreated: action.critiqueCreated,
        loading: false,
      };
    case 'UNSET_LINKED_CRITIQUE_CREATED':
      return {
        ...state,
        linkedCritiqueCreated: false,
      };
    default:
      return state;
  }
}
