import { executePublicGql } from '../../../GqlClients';
import { createPasswordResetTokenMutation } from './gql/mutations';

export const setRequestPasswordResetCompleted = completed => ({
  type: 'REQUEST_PASSWORD_RESET_COMPLETED',
  completed,
});

export function resetRequestPasswordResetCompleted() {
  return (dispatch) => {
    dispatch(setRequestPasswordResetCompleted(false));
  };
}

export const requestPasswordReset = email => (dispatch) => {
  executePublicGql({
    mutation: createPasswordResetTokenMutation,
    variables: {
      email,
    },
  })
    .then(() => {
      dispatch(setRequestPasswordResetCompleted(true));
    });
};
