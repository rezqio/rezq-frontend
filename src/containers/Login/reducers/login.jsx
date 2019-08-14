import values from 'lodash/values';
import * as types from '../actions/actionTypes';

const initialState = {
  session: false,
  loginError: null,
  isFirstLogin: false,
  unverifiedEmail: null,
};

export default function login(state = initialState, action) {
  switch (action.type) {
    case types.LOG_IN_REQUEST:
      return {
        ...state,
        loginError: null,
      };
    case types.LOG_IN_SUCCESS:
      return {
        ...state,
        session: true,
        loginError: null,
        isFirstLogin: false,
        unverifiedEmail: action.unverifiedEmail,
      };
    case types.LOG_OUT_SUCCESS:
      return {
        ...state,
        session: false,
        loginError: null,
        isFirstLogin: false,
        unverifiedEmail: null,
      };
    case types.LOG_IN_FAILURE:
      return {
        ...state,
        session: false,
        loginError: values(JSON.parse(action.errors))[0],
      };
    case types.REGEX_FAILURE:
      return {
        ...state,
        session: false,
        loginError: action.errors,
      };
    case types.SET_FIRST_LOGIN:
      return {
        ...state,
        isFirstLogin: true,
      };
    default:
      return state;
  }
}
