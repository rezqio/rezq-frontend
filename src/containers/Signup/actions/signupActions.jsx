import * as types from './actionTypes';
import {
  createProfileMutation,
  createProfileWithWaterlooMutation,
  createProfileWithFacebookMutation,
  createProfileWithGoogleMutation,
} from './gql/mutations';
import { executePublicGql } from '../../../GqlClients';
import { setFirstLogin } from '../../Login/actions/sessionActions';
import { VALID_EMAIL_REGEX } from '../../../constants';

export const autoLogin = unverifiedEmail => ({
  type: types.LOG_IN_SUCCESS,
  unverifiedEmail,
});

export const emailFailure = errors => ({
  type: types.EMAIL_REGEX_FAILURE,
  errors,
});

export const passwordFailure = errors => ({
  type: types.PASSWORD_FAILURE,
  errors,
});

export const signUpFailure = errors => ({
  type: types.SIGN_UP_FAILURE,
  errors,
});

export function signUpRequest() {
  return { type: types.SIGN_UP_REQUEST };
}

export function createProfile(profile) {
  return (dispatch) => {
    dispatch(signUpRequest());
    if (!VALID_EMAIL_REGEX.test(profile.email)) {
      dispatch(emailFailure('Please enter a valid email.'));
      return;
    }
    if (profile.password.length < 8) {
      dispatch(passwordFailure('This password is too short. It must contain at least 8 characters.'));
      return;
    }
    if (profile.password !== profile.confirmPassword) {
      dispatch(passwordFailure('Passwords do not match.'));
      return;
    }
    executePublicGql({
      mutation: createProfileMutation,
      variables: profile,
    })
      .then((res) => {
        if (res.data.createProfile.errors) {
          dispatch(signUpFailure(res.data.createProfile.errors));
          return;
        }
        localStorage.setItem('token', res.data.createProfile.token);
        localStorage.setItem('expires', res.data.createProfile.expires);
        dispatch(autoLogin(res.data.createProfile.profile.unverifiedEmail));
        dispatch(setFirstLogin());
      });
  };
}

export function createProfileWithWaterloo(ticket) {
  return (dispatch) => {
    dispatch(signUpRequest());
    executePublicGql({
      mutation: createProfileWithWaterlooMutation,
      variables: ticket,
    })
      .then((res) => {
        if (res.data.createProfileWithWaterloo.errors) {
          dispatch(signUpFailure(res.data.createProfileWithWaterloo.errors));
          return;
        }
        localStorage.setItem('token', res.data.createProfileWithWaterloo.token);
        localStorage.setItem('expires', res.data.createProfileWithWaterloo.expires);
        dispatch(autoLogin(res.data.createProfileWithWaterloo.profile.unverifiedEmail));
        if (res.data.createProfileWithWaterloo.profileCreated) {
          dispatch(setFirstLogin());
        }
      });
  };
}

export function createProfileWithFacebook(token) {
  return (dispatch) => {
    if (!token || !token.token) {
      dispatch(signUpFailure('{"errors": "Something went wrong when authenticating your Facebook account."}'));
      return;
    }
    dispatch(signUpRequest());
    executePublicGql({
      mutation: createProfileWithFacebookMutation,
      variables: token,
    })
      .then((res) => {
        if (res.data.createProfileWithFacebook.errors) {
          dispatch(signUpFailure(res.data.createProfileWithFacebook.errors));
          return;
        }
        localStorage.setItem('token', res.data.createProfileWithFacebook.token);
        localStorage.setItem('expires', res.data.createProfileWithFacebook.expires);
        dispatch(autoLogin(res.data.createProfileWithFacebook.profile.unverifiedEmail));
        if (res.data.createProfileWithFacebook.profileCreated) {
          dispatch(setFirstLogin());
        }
      });
  };
}

export function createProfileWithGoogle(token) {
  return (dispatch) => {
    if (!token || !token.token) {
      dispatch(signUpFailure('{"errors": "Something went wrong when authenticating your Google account."}'));
      return;
    }
    dispatch(signUpRequest());
    executePublicGql({
      mutation: createProfileWithGoogleMutation,
      variables: token,
    })
      .then((res) => {
        if (res.data.createProfileWithGoogle.errors) {
          dispatch(signUpFailure(res.data.createProfileWithGoogle.errors));
          return;
        }
        localStorage.setItem('token', res.data.createProfileWithGoogle.token);
        localStorage.setItem('expires', res.data.createProfileWithGoogle.expires);
        dispatch(autoLogin(res.data.createProfileWithGoogle.profile.unverifiedEmail));
        if (res.data.createProfileWithGoogle.profileCreated) {
          dispatch(setFirstLogin());
        }
      });
  };
}
