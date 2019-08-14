import values from 'lodash/values';
import { executePublicGql, executePrivateGql } from '../../../GqlClients';
import {
  reportPageMutation,
} from './gql/mutations';
import { VALID_EMAIL_REGEX } from '../../../constants';

export const reportPageSuccess = () => ({
  type: 'REPORT_PAGE_SUCCESS',
});

export const reportPageError = error => ({
  type: 'REPORT_PAGE_ERROR',
  error,
});

export const resetReportPageState = () => ({
  type: 'RESET_REPORT_MODAL',
});

export function reportPage(isLoggedIn, pathname, search, stars, message, replyTo) {
  return (dispatch) => {
    if (stars === 0 && message === '') {
      dispatch(reportPageError('Cannot submit an empty feedback.'));
      return;
    }

    if (message.length > 1024) {
      dispatch(reportPageError('Your message is too long (1024 character limit).'));
      return;
    }

    if (replyTo !== '' && !VALID_EMAIL_REGEX.test(replyTo)) {
      dispatch(reportPageError('Invalid email address.'));
      return;
    }

    (isLoggedIn ? executePrivateGql : executePublicGql)({
      mutation: reportPageMutation,
      variables: {
        pathname,
        search,
        stars,
        message,
        replyTo,
      },
    }).then((res) => {
      const result = res.data.reportPage;
      if (result.errors) {
        dispatch(reportPageError(values(JSON.parse(result.errors))[0]));
        return;
      }
      localStorage.setItem('feedbackSubmitted', 'true');
      dispatch(reportPageSuccess());
    });
  };
}

export function resetReportModal() {
  return (dispatch) => {
    dispatch(resetReportPageState());
  };
}
