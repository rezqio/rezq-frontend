import values from 'lodash/values';
import { executePublicGql } from '../../../GqlClients';
import { resetPasswordMutation } from './gql/mutations';

export const resetPasswordSuccess = () => ({
  type: 'RESET_PASSWORD_SUCCESS',
});

export const resetPasswordError = error => ({
  type: 'RESET_PASSWORD_ERROR',
  error,
});

export function resetPasswordLoad() {
  return (dispatch) => {
    dispatch({ type: 'RESET_PASSWORD_LOAD' });
  };
}

export const resetPassword = (token, newPassword) => (dispatch) => {
  const genericPasswordResetError = 'Unable to reset password. Your password reset link may be invalid or has expired.';
  executePublicGql({
    mutation: resetPasswordMutation,
    variables: {
      token,
      newPassword,
    },
  })
    .then((res) => {
      if (res.data.resetPassword.errors) {
        const errors = JSON.parse(res.data.resetPassword.errors);
        if ('password' in errors) {
          dispatch(resetPasswordError(values(errors)[0][0]));
          return;
        }
        dispatch(resetPasswordError(genericPasswordResetError));
        return;
      }
      dispatch(resetPasswordSuccess());
    });
};
