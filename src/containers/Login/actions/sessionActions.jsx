import * as types from './actionTypes';
import {
  createTokenMutation,
  createTokenWithWaterlooMutation,
  createTokenWithFacebookMutation,
  createTokenWithGoogleMutation,
} from './gql/mutations';
import { executePublicGql } from '../../../GqlClients';
import {
  VALID_EMAIL_REGEX,
  VALID_USERNAME_REGEX,
} from '../../../constants';

export function refreshPage() {
  setTimeout(() => {
    window.location = window.location.pathname + window.location.hash; // Quick fix for Firefox/CAS
  }, 100);
}

export const loginSuccess = unverifiedEmail => ({
  type: types.LOG_IN_SUCCESS,
  unverifiedEmail,
});
export const logoutSuccess = () => ({ type: types.LOG_OUT_SUCCESS });
export const loginFailure = errors => ({
  type: types.LOG_IN_FAILURE,
  errors,
});

export const regexFailure = errors => ({
  type: types.REGEX_FAILURE,
  errors,
});

export const setFirstLogin = () => ({
  type: types.SET_FIRST_LOGIN,
});

export function loginRequest() {
  return (dispatch) => {
    dispatch({ type: types.LOG_IN_REQUEST });
  };
}

export function logoutUser() {
  return (dispatch) => {
    const feedbackSubmitted = localStorage.getItem('feedbackSubmitted');
    localStorage.clear();
    if (feedbackSubmitted !== null) {
      localStorage.setItem('feedbackSubmitted', feedbackSubmitted);
    }

    dispatch(logoutSuccess());
    dispatch(refreshPage());
  };
}

export function createToken(credentials) {
  return (dispatch) => {
    if (
      !(VALID_EMAIL_REGEX.test(credentials.email)
      || VALID_USERNAME_REGEX.test(credentials.email)
      )) {
      dispatch(regexFailure('Please enter a valid username or e-mail address.'));
      return;
    }
    if (credentials.password === '') {
      dispatch(regexFailure('Please enter a password.'));
      return;
    }
    executePublicGql({
      mutation: createTokenMutation,
      variables: credentials,
    })
      .then((res) => {
        if (res.data.createToken.errors) {
          dispatch(loginFailure(res.data.createToken.errors));
          return;
        }
        localStorage.setItem('token', res.data.createToken.token);
        localStorage.setItem('expires', res.data.createToken.expires);

        dispatch(loginSuccess(res.data.createToken.unverifiedEmail));
      });
  };
}

export function createTokenWithWaterloo(ticket) {
  return (dispatch) => {
    executePublicGql({
      mutation: createTokenWithWaterlooMutation,
      variables: ticket,
    })
      .then((res) => {
        const result = res.data.createTokenWithWaterloo;
        if (result.errors) {
          dispatch(loginFailure(result.errors));
          return;
        }
        localStorage.setItem('token', result.token);
        localStorage.setItem('expires', result.expires);

        dispatch(loginSuccess(result.unverifiedEmail));
        if (result.profileCreated) {
          dispatch(setFirstLogin());
        }
      });
  };
}

export function createTokenWithFacebook(accessToken) {
  return (dispatch) => {
    if (!accessToken || !accessToken.token) {
      dispatch(loginFailure('{"errors": "Something went wrong when authenticating your Facebook account."}'));
      return;
    }

    executePublicGql({
      mutation: createTokenWithFacebookMutation,
      variables: accessToken,
    })
      .then((res) => {
        const result = res.data.createTokenWithFacebook;
        if (result.errors) {
          dispatch(loginFailure(result.errors));
          return;
        }
        localStorage.setItem('token', result.token);
        localStorage.setItem('expires', result.expires);

        dispatch(loginSuccess(result.unverifiedEmail));
        if (result.profileCreated) {
          dispatch(setFirstLogin());
        }
      });
  };
}

export function createTokenWithGoogle(idToken) {
  return (dispatch) => {
    if (!idToken || !idToken.token) {
      dispatch(loginFailure('{"errors": "Something went wrong when authenticating your Google account."}'));
      return;
    }

    executePublicGql({
      mutation: createTokenWithGoogleMutation,
      variables: idToken,
    })
      .then((res) => {
        const result = res.data.createTokenWithGoogle;
        if (result.errors) {
          dispatch(loginFailure(result.errors));
          return;
        }
        localStorage.setItem('token', result.token);
        localStorage.setItem('expires', result.expires);

        dispatch(loginSuccess(result.unverifiedEmail));
        if (result.profileCreated) {
          dispatch(setFirstLogin());
        }
      });
  };
}
