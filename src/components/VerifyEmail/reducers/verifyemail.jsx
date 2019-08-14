const initialState = {
  verifyResult: '',
};

export default function verifyemail(state = initialState, action) {
  switch (action.type) {
    case 'RESET_VERIFY_RESULT':
      return {
        ...state,
        verifyResult: '',
      };
    case 'SET_VERIFY_RESULT':
      return {
        ...state,
        verifyResult: action.message,
      };
    default:
      return state;
  }
}
