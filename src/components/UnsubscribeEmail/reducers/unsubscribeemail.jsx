const initialState = {
  unsubscribeResult: '',
};

export default function unsubscribeemail(state = initialState, action) {
  switch (action.type) {
    case 'RESET_UNSUBSCRIBE_RESULT':
      return {
        ...state,
        unsubscribeResult: '',
      };
    case 'SET_UNSUBSCRIBE_RESULT':
      return {
        ...state,
        unsubscribeResult: action.message,
      };
    default:
      return state;
  }
}
