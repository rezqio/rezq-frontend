import { executePublicGql } from '../../../GqlClients';
import { unsubscribeEmailMutation } from './gql/mutations';

export const resetUnsubscribeResult = () => ({
  type: 'RESET_UNSUBSCRIBE_RESULT',
});

export const setUnsubscribeResult = message => ({
  type: 'SET_UNSUBSCRIBE_RESULT',
  message,
});

export const unsubscribeEmail = unsubscribeToken => (dispatch) => {
  dispatch(resetUnsubscribeResult());
  executePublicGql({
    mutation: unsubscribeEmailMutation,
    variables: {
      unsubscribeToken,
    },
  })
    .then((res) => {
      if (res.data.unsubscribeEmail.errors) {
        dispatch(setUnsubscribeResult('Your unsubscribe link is invalid or has expired.'));
        return;
      }
      dispatch(setUnsubscribeResult('You have successfully unsubscribed from email notifications.'));
    });
};
