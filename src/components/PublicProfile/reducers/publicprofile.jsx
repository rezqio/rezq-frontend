const initialState = {
  publicprofile: null,
  loading: true,
  error: '',
};

export default function publicprofile(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PUBLIC_PROFILE':
      return {
        ...state,
        publicprofile: null,
        loading: true,
        error: '',
      };
    case 'SET_PUBLIC_PROFILE':
      return {
        ...state,
        publicprofile: action.profile,
        loading: false,
        error: '',
      };
    case 'SET_PUBLIC_PROFILE_ERROR':
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
