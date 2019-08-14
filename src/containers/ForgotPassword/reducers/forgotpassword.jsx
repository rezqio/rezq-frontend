const initialState = {
  requestPasswordResetCompleted: false,
};

export default function forgotpassword(state = initialState, action) {
  switch (action.type) {
    case 'REQUEST_PASSWORD_RESET_COMPLETED':
      return {
        ...state,
        requestPasswordResetCompleted: action.completed,
      };
    default:
      return state;
  }
}
