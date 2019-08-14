import { executePublicGql } from '../../../GqlClients';
import { verifyEmailMutation } from './gql/mutations';

export const resetVerifyResult = () => ({
  type: 'RESET_VERIFY_RESULT',
});

export const setVerifyResult = message => ({
  type: 'SET_VERIFY_RESULT',
  message,
});

export const verifyEmail = verificationToken => (dispatch) => {
  dispatch(resetVerifyResult());
  executePublicGql({
    mutation: verifyEmailMutation,
    variables: {
      verificationToken,
    },
  })
    .then((res) => {
      if (res.data.verifyEmail.errors) {
        dispatch(setVerifyResult('Your verification link is invalid or has expired.'));
        return;
      }

      localStorage.setItem('token', res.data.verifyEmail.token);
      localStorage.setItem('expires', res.data.verifyEmail.expires);

      dispatch(({ type: 'LOG_IN_SUCCESS' }));
      dispatch(setVerifyResult('Your email has been verified.'));
    });
};
