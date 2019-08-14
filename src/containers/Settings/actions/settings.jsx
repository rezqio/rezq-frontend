import request from 'superagent';
import omitBy from 'lodash/omitBy';
import pickBy from 'lodash/pickBy';
import identity from 'lodash/identity';
import { executePrivateGql } from '../../../GqlClients';
import { profileQuery, avatarUploadInfoQuery } from './gql/queries';
import {
  editProfileMutation,
  editAccountMutation,
  resendVerificationEmailMutation,
  cancelEmailChangeMutation,
  deleteProfileMutation,
  linkProfileWithWaterlooMutation,
  linkProfileWithFacebookMutation,
  linkProfileWithGoogleMutation,
  unlinkProfileWithWaterlooMutation,
  unlinkProfileWithFacebookMutation,
  unlinkProfileWithGoogleMutation,
  removeAvatarMutation,
} from './gql/mutations';
import { THIRD_PARTY_AUTH } from '../../../constants';
import dataURItoBlob from '../../../utils/dataURItoBlob';

export const loadProfile = () => ({
  type: 'LOAD_PROFILE',
});

export const setProfile = profile => ({
  type: 'SET_PROFILE',
  profile,
});

export const editProfileSuccess = profile => ({
  type: 'EDIT_PROFILE_SUCCESS',
  profile,
});

export const editProfileFailure = error => ({
  type: 'EDIT_PROFILE_FAILURE',
  error,
});

export const verificationEmailSuccess = () => ({
  type: 'VERIFICATION_EMAIL_SUCCESS',
});

export const cancelEmailChangeSuccess = () => ({
  type: 'CANCEL_EMAIL_CHANGE_SUCCESS',
});

export const deleteProfileSuccess = () => ({
  type: 'DELETE_PROFILE_SUCCESS',
});

export const deleteProfileFailure = error => ({
  type: 'DELETE_PROFILE_FAILURE',
  error,
});

export const linkProfileSuccess = (profile, message) => ({
  type: 'LINK_PROFILE_SUCCESS',
  profile,
  message,
});

export const linkProfileFailure = error => ({
  type: 'LINK_PROFILE_FAILURE',
  error,
});

export const resetProfileFeedback = () => ({
  type: 'RESET_PROFILE_FEEDBACK',
});

export const passwordMatchFailure = error => ({
  type: 'PASSWORD_MATCH_FAILURE',
  error,
});

export const passwordSetFailure = error => ({
  type: 'PASSWORD_SET_FAILURE',
  error,
});

export const showMergeAccountModal = (bool, accountType) => ({
  type: 'SHOW_MERGE_ACCOUNT_MODAL',
  bool,
  accountType,
});

export const uploadAvatarError = error => ({
  type: 'UPLOAD_AVATAR_ERROR',
  error,
});

export const removeAvatarError = error => ({
  type: 'REMOVE_AVATAR_ERROR',
  error,
});

export const removeAvatarSuccess = () => ({
  type: 'REMOVE_AVATAR_SUCCESS',
});

export function fetchProfile() {
  return (dispatch) => {
    dispatch(loadProfile());
    executePrivateGql({
      query: profileQuery,
    }).then((res) => {
      dispatch(setProfile(res.data.profile));
    });
  };
}

export function editAccount(accountState, hasPassword) {
  return (dispatch) => {
    if ((accountState.email || accountState.username)
      && hasPassword && !accountState.currentPassword) {
      dispatch(passwordSetFailure(
        'Please enter your current password to modify your account information.',
      ));
      return;
    }

    // filter out blank password fields
    if ((accountState.newPassword && !accountState.confirmNewPassword)
      || (!accountState.newPassword && accountState.confirmNewPassword)
      || (accountState.newPassword && accountState.confirmNewPassword
      && accountState.newPassword !== accountState.confirmNewPassword)
    ) {
      dispatch(passwordMatchFailure('New passwords do not match!'));
      return;
    }

    const account = pickBy(accountState, identity);
    executePrivateGql({
      mutation: editAccountMutation,
      variables: account,
    })
      .then((res) => {
        if (res.data.editProfile.errors) {
          dispatch(editProfileFailure(res.data.editProfile.errors));
          return;
        }
        dispatch(editProfileSuccess(res.data.editProfile.profile));
      });
  };
}

export function editProfile(profileState) {
  return (dispatch) => {
    const profile = omitBy(profileState, (value, fieldName) => {
      if (
        // fields that we allow blank submissions
        fieldName !== 'firstName'
        && fieldName !== 'lastName'
        && fieldName !== 'industries'
        && fieldName !== 'biography'
        && value === ''
      ) {
        return true;
      }
      // everything else is filtered out if blank
      return false;
    });

    executePrivateGql({
      mutation: editProfileMutation,
      variables: profile,
    })
      .then((res) => {
        if (res.data.editProfile.errors) {
          dispatch(editProfileFailure(res.data.editProfile.errors));
          return;
        }
        dispatch(editProfileSuccess(res.data.editProfile.profile));
      });
  };
}

export function resendVerificationEmail() {
  return (dispatch) => {
    executePrivateGql({
      mutation: resendVerificationEmailMutation,
    })
      .then((res) => {
        if (!res.data.resendVerificationEmail.errors) {
          dispatch(verificationEmailSuccess());
        }
      });
  };
}

export function cancelEmailChange() {
  return (dispatch) => {
    executePrivateGql({
      mutation: cancelEmailChangeMutation,
    })
      .then((res) => {
        if (!res.data.cancelEmailChange.errors) {
          dispatch(cancelEmailChangeSuccess());
        }
      });
  };
}

export function deleteProfile() {
  return (dispatch) => {
    executePrivateGql({
      mutation: deleteProfileMutation,
    })
      .then((res) => {
        if (res.data.deleteProfile.errors) {
          dispatch(deleteProfileFailure(res.data.deleteProfile.errors));
          return;
        }
        dispatch(deleteProfileSuccess());
      });
  };
}

export function linkProfileWithWaterloo(ticket, linkExistingAccount) {
  return (dispatch) => {
    executePrivateGql({
      mutation: linkProfileWithWaterlooMutation,
      variables: { ticket, linkExistingAccount },
    })
      .then((res) => {
        const dataErrorsString = res.data.linkProfileWithWaterloo.errors;
        if (dataErrorsString) {
          const dataErrorsJson = JSON.parse(dataErrorsString);
          if (dataErrorsJson.waterloo_id) {
            dispatch(showMergeAccountModal(true, 'Waterloo'));
          }
          dispatch(linkProfileFailure(res.data.linkProfileWithWaterloo.errors));
          return;
        }
        dispatch(
          linkProfileSuccess(
            res.data.linkProfileWithWaterloo.profile,
            'Your account has been linked to UWaterloo CAS.',
          ),
        );
        window.history.replaceState({}, '', '/settings');
      });
  };
}

export function linkProfileWithFacebook(token, linkExistingAccount) {
  return (dispatch) => {
    if (!token) {
      dispatch(linkProfileFailure('{"errors": "Something went wrong when authenticating your Facebook account."}'));
      return;
    }

    executePrivateGql({
      mutation: linkProfileWithFacebookMutation,
      variables: { token, linkExistingAccount },
    })
      .then((res) => {
        const dataErrorsString = res.data.linkProfileWithFacebook.errors;
        if (dataErrorsString) {
          const dataErrorsJson = JSON.parse(dataErrorsString);
          if (dataErrorsJson.facebook_id) {
            dispatch(showMergeAccountModal(true, 'Facebook'));
          }
          dispatch(linkProfileFailure(res.data.linkProfileWithFacebook.errors));
          return;
        }
        dispatch(linkProfileSuccess(
          res.data.linkProfileWithFacebook.profile,
          'Your account has been linked to Facebook.',
        ));
      });
  };
}

export function linkProfileWithGoogle(token, linkExistingAccount) {
  return (dispatch) => {
    if (!token) {
      dispatch(linkProfileFailure('{"errors": "Something went wrong when authenticating your Google account."}'));
      return;
    }

    executePrivateGql({
      mutation: linkProfileWithGoogleMutation,
      variables: { token, linkExistingAccount },
    })
      .then((res) => {
        const dataErrorsString = res.data.linkProfileWithGoogle.errors;
        if (dataErrorsString) {
          const dataErrorsJson = JSON.parse(dataErrorsString);
          if (dataErrorsJson.google_id) {
            dispatch(showMergeAccountModal(true, 'Google'));
          }
          dispatch(linkProfileFailure(res.data.linkProfileWithGoogle.errors));
          return;
        }
        dispatch(linkProfileSuccess(
          res.data.linkProfileWithGoogle.profile,
          'Your account has been linked to Google.',
        ));
      });
  };
}

export function unlinkProfileFromThirdPartyAuth(thirdPartyAuthType) {
  let unlinkProfileMutation;
  let unlinkProfileMutationNode;

  switch (thirdPartyAuthType) {
    case THIRD_PARTY_AUTH.UWATERLOO:
      unlinkProfileMutation = unlinkProfileWithWaterlooMutation;
      unlinkProfileMutationNode = 'unlinkProfileWithWaterloo';
      break;
    case THIRD_PARTY_AUTH.FACEBOOK:
      unlinkProfileMutation = unlinkProfileWithFacebookMutation;
      unlinkProfileMutationNode = 'unlinkProfileWithFacebook';
      break;
    case THIRD_PARTY_AUTH.GOOGLE:
      unlinkProfileMutation = unlinkProfileWithGoogleMutation;
      unlinkProfileMutationNode = 'unlinkProfileWithGoogle';
      break;
    default:
      return (dispatch) => {
        dispatch(linkProfileFailure('{"":"No third party auth specified."}'));
      };
  }

  return (dispatch) => {
    executePrivateGql({
      mutation: unlinkProfileMutation,
    })
      .then((res) => {
        if (res.data[unlinkProfileMutationNode].errors) {
          dispatch(linkProfileFailure(res.data[unlinkProfileMutationNode].errors));
          return;
        }
        dispatch(
          linkProfileSuccess(
            res.data[unlinkProfileMutationNode].profile,
            `Your account has been unlinked from ${thirdPartyAuthType}.`,
          ),
        );
      });
  };
}

export function resetMergeAccountModal() {
  return (dispatch) => {
    dispatch(showMergeAccountModal(false, ''));
  };
}

export function uploadAvatar(userID, avatarDataURL) {
  return (dispatch) => {
    if (!avatarDataURL) {
      dispatch(uploadAvatarError('You must attach an avatar.'));
      return;
    }

    executePrivateGql({
      query: avatarUploadInfoQuery,
    }, false)
      .then((res) => {
        if (!res.data.profile) {
          dispatch(uploadAvatarError('Something went wrong when uploading your avatar.'));
          return;
        }
        const avatarUploadInfoMap = JSON.parse(res.data.profile.avatarUploadInfo);
        const avatarBlob = dataURItoBlob(avatarDataURL);
        const avatarFile = new File([avatarBlob], `${userID}_avatar.png`);
        avatarUploadInfoMap.fields = {
          ...avatarUploadInfoMap.fields,
          file: avatarFile,
        };

        request
          .post(avatarUploadInfoMap.url)
          .field(avatarUploadInfoMap.fields)
          .end((err) => {
            if (err) {
              dispatch(uploadAvatarError(JSON.stringify(err)));
              return;
            }
            window.location.reload();
          });
      });
  };
}

export function removeAvatar() {
  return (dispatch) => {
    executePrivateGql({
      mutation: removeAvatarMutation,
    })
      .then((res) => {
        if (res.data.removeAvatar.errors) {
          dispatch(removeAvatarError(JSON.stringify(res.data.removeAvatar.errors)));
          return;
        }
        dispatch(removeAvatarSuccess());
      });
  };
}
