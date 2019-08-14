const initialState = {
  resetPasswordSuccess: false,
  resetPasswordError: '',
};

export default function resetpassword(state = initialState, action) {
  switch (action.type) {
    case 'RESET_PASSWORD_LOAD':
      return {
        ...state,
        resetPasswordSuccess: false,
        resetPasswordError: '',
      };
    case 'RESET_PASSWORD_SUCCESS':
      return {
        ...state,
        resetPasswordSuccess: true,
        resetPasswordError: '',
      };
    case 'RESET_PASSWORD_ERROR':
      return {
        ...state,
        resetPasswordSuccess: false,
        resetPasswordError: action.error,
      };
    default:
      return state;
  }
}
