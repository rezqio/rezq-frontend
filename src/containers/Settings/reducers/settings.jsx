import values from 'lodash/values';

const initialState = {
  profile: {},
  loading: false,
  editProfileSuccess: false,
  editProfileError: '',
  verificationEmailSuccess: false,
  cancelEmailChangeSuccess: false,
  linkProfileSuccessMessage: '',
  linkProfileError: '',
  deleteProfileSuccess: false,
  deleteProfileError: false,
  showMergeAccountModal: false,
  mergeAccountType: '',
  uploadAvatarError: '',
  removeAvatarError: '',
};

export default function settings(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PROFILE':
      return {
        ...state,
        loading: true,
      };
    case 'SET_PROFILE':
      return {
        ...state,
        profile: action.profile,
        loading: false,
        editProfileSuccess: false,
        editProfileError: '',
        verificationEmailSuccess: false,
        cancelEmailChangeSuccess: false,
        linkProfileSuccess: false,
        linkProfileError: '',
        deleteProfileSuccess: false,
        deleteProfileError: false,
        uploadAvatarError: '',
        removeAvatarError: '',
      };
    case 'EDIT_PROFILE_SUCCESS':
      return {
        ...state,
        profile: action.profile,
        editProfileSuccess: true,
        editProfileError: '',
        uploadAvatarError: '',
        removeAvatarError: '',
      };
    case 'EDIT_PROFILE_FAILURE':
      return {
        ...state,
        editProfileError: values(JSON.parse(action.error))[0],
        editProfileSuccess: false,
      };
    case 'PASSWORD_MATCH_FAILURE':
      return {
        ...state,
        editProfileError: action.error,
        editProfileSuccess: false,
      };
    case 'PASSWORD_SET_FAILURE':
      return {
        ...state,
        editProfileError: action.error,
        editProfileSuccess: false,
      };
    case 'VERIFICATION_EMAIL_SUCCESS':
      return {
        ...state,
        verificationEmailSuccess: true,
      };
    case 'CANCEL_EMAIL_CHANGE_SUCCESS':
      return {
        ...state,
        cancelEmailChangeSuccess: true,
      };
    case 'DELETE_PROFILE_FAILURE':
      return {
        ...state,
        deleteProfileSuccess: false,
        deleteProfileError: true,
      };
    case 'DELETE_PROFILE_SUCCESS':
      return {
        ...state,
        deleteProfileSuccess: true,
        deleteProfileError: false,
      };
    case 'LINK_PROFILE_SUCCESS':
      return {
        ...state,
        profile: action.profile,
        linkProfileSuccessMessage: action.message,
        linkProfileError: '',
      };
    case 'LINK_PROFILE_FAILURE':
      return {
        ...state,
        linkProfileError: values(JSON.parse(action.error))[0],
        linkProfileSuccess: '',
      };
    case 'SHOW_MERGE_ACCOUNT_MODAL':
      return {
        ...state,
        showMergeAccountModal: action.bool,
        mergeAccountType: action.accountType,
      };
    case 'RESET_PROFILE_FEEDBACK':
      return {
        ...state,
        editProfileSuccess: false,
        editProfileError: '',
        linkProfileSuccessMessage: '',
        linkProfileError: '',
        deleteProfileSuccess: false,
        deleteProfileError: false,
      };
    case 'UPLOAD_AVATAR_ERROR':
      return {
        ...state,
        uploadAvatarError: action.error,
      };
    case 'REMOVE_AVATAR_ERROR':
      return {
        ...state,
        removeAvatarError: action.error,
      };
    case 'REMOVE_AVATAR_SUCCESS':
      return {
        ...state,
        profile: {
          ...state.profile,
          avatarDownloadUrl: null,
        },
        removeAvatarError: '',
      };
    default:
      return state;
  }
}
