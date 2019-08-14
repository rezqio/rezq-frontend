import values from 'lodash/values';
import * as types from '../actions/actionTypes';

const initialState = {
  loading: false,
  succ: false,
  fail: false,
  errorMsg: '',
};

export default function signup(state = initialState, action) {
  switch (action.type) {
    case types.EMAIL_REGEX_FAILURE:
    case types.PASSWORD_FAILURE:
      return {
        ...state,
        loading: false,
        fail: true,
        succ: false,
        errorMsg: action.errors,
      };
    case types.SIGN_UP_REQUEST:
      return {
        ...state,
        loading: true,
        fail: false,
        succ: false,
        errorMsg: '',
      };
    case types.SIGN_UP_FAILURE:
      return {
        ...state,
        loading: false,
        fail: true,
        succ: false,
        errorMsg: values(JSON.parse(action.errors))[0],
      };
    default:
      return {
        ...state,
        loading: false,
        succ: false,
        fail: false,
        errorMsg: '',
      };
  }
}
