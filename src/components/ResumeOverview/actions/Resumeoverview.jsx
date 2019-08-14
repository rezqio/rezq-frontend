import values from 'lodash/values';
import { executePrivateGql } from '../../../GqlClients';
import { resumeQuery } from './gql/queries';
import {
  requestCritiqueMutation,
  enableLinkSharingMutation,
  editPoolMutation,
  deleteResumeMutation,
  editResumeMutation,
  cancelRequestForCritiqueMutation,
  updateNotesMutation,
} from './gql/mutations';
import {
  commentOnCritiqueMutation,
  votePooledCritiqueMutation,
} from '../../PooledResume/actions/gql/mutations';
import {
  profileIndustriesQuery,
} from '../../../containers/MyResumes/actions/gql/queries';

export const loadResume = () => ({
  type: 'LOAD_RESUME',
});

export const setResume = resume => ({
  type: 'SET_RESUME',
  resume,
});

export const setResumeNotes = notes => ({
  type: 'SET_RESUME_NOTES',
  notes,
});

export const setResumeToken = resumeToken => ({
  type: 'SET_RESUME_TOKEN',
  resumeToken,
});

export const setLinkSharingStatus = isLinkSharingEnabled => ({
  type: 'SET_LINK_SHARING_STATUS',
  isLinkSharingEnabled,
});

export const setResumeEditChanges = resumeDetails => ({
  type: 'SET_RESUME_EDIT_CHANGES',
  resumeDetails,
});

export const setPoolStatus = pool => ({
  type: 'SET_POOL_STATUS',
  pool,
});

// TODO: Why wasn't this implemented @Evan Cao
export const deleteError = errors => ({
  type: 'DELETE_RESUME_ERROR',
  errors,
});

export const editError = error => ({
  type: 'EDIT_RESUME_ERROR',
  error,
});

export const poolChangeError = error => ({
  type: 'POOL_CHANGE_ERROR',
  error,
});

export const clearPoolChangeError = () => ({
  type: 'CLEAR_POOL_CHANGE_ERROR',
});

export const addVoteViaResumeOverview = upvote => ({
  type: 'VOTE_VIA_RESUME_OVERVIEW',
  upvote,
});

export const addCommentViaResumeOverview = comment => ({
  type: 'COMMENT_VIA_RESUME_OVERVIEW',
  comment,
});

export const setInstitutionViaResumeOverview = institutions => ({
  type: 'SET_INSTITUTION_VIA_RESUME_OVERVIEW',
  institutions,
});

export const fetchProfileInstitutionsViaResumeOverview = () => (dispatch) => {
  executePrivateGql({
    query: profileIndustriesQuery,
  }).then((res) => {
    dispatch(setInstitutionViaResumeOverview(res.data.profile.institutions));
  });
};

export const fetchResume = id => (dispatch) => {
  dispatch(loadResume());
  executePrivateGql({
    query: resumeQuery,
    variables: {
      id,
    },
  }).then((res) => {
    dispatch(setResume(res.data.resume));
    dispatch(setResumeToken(res.data.resume.token));
    dispatch(setLinkSharingStatus(res.data.resume.linkEnabled));
  });
};

export const requestCritique = id => (dispatch) => {
  executePrivateGql({
    mutation: requestCritiqueMutation,
    variables: { id },
  }).then(() => {
    // probably want a temporary pending state
    // until backend is updated
    dispatch(fetchResume(id));
  });
};

export const cancelCritiqueRequest = (critiqueId, resumeId) => (dispatch) => {
  executePrivateGql({
    mutation: cancelRequestForCritiqueMutation,
    variables: {
      id: critiqueId,
    },
  }).then(() => {
    dispatch(fetchResume(resumeId));
  });
};

export const updateNotes = (id, notes) => (dispatch) => {
  executePrivateGql({
    mutation: updateNotesMutation,
    variables: {
      id,
      notes,
    },
  }).then((res) => {
    // TODO: return an error later if it failed
    if (res.data.editResume) {
      dispatch(setResumeNotes(res.data.editResume.resume.notesForCritiquer));
    }
  });
};

// Turn link sharing on
export const enableLinkSharing = (id, linkEnabled) => (dispatch) => {
  executePrivateGql({
    mutation: enableLinkSharingMutation,
    variables: {
      id,
      linkEnabled,
    },
  }).then((res) => {
    // TODO: return an error later if it failed
    if (res.data.editResume) {
      dispatch(setResumeToken(res.data.editResume.resume.token));
      dispatch(setLinkSharingStatus(res.data.editResume.resume.linkEnabled));
    }
  });
};

export const editPool = (id, pool, poolIsInstitution) => (dispatch) => {
  if (!poolIsInstitution && pool === '') {
    dispatch(editError('You must enter the private group ID.'));
    return;
  }
  let institutionPool;
  let privatePool;
  if (poolIsInstitution) {
    institutionPool = pool;
    privatePool = '';
  } else {
    institutionPool = '';
    privatePool = pool;
  }
  executePrivateGql({
    mutation: editPoolMutation,
    variables: {
      id,
      institutionPool,
      privatePool,
    },
  }).then((res) => {
    if (res.data.editResume.errors) {
      dispatch(poolChangeError('The pool ID you entered does not exist.'));
      return;
    }

    if (res.data.editResume) {
      dispatch(setResumeToken(res.data.editResume.resume.token));
      dispatch(setPoolStatus(res.data.editResume.resume.pool));
    }
  });
};

export const clearPoolError = () => (dispatch) => {
  dispatch(clearPoolChangeError());
};

export function deleteResume(id) {
  return (dispatch) => {
    executePrivateGql({
      mutation: deleteResumeMutation,
      variables: {
        id,
      },
    }).then((res) => {
      const result = res.data.deleteResume;
      if (result.errors) {
        dispatch(deleteError(result.errors));
        return;
      }

      window.location.href = '/resumes';
    });
  };
}

export function editResume(id, name, description, industries) {
  return (dispatch) => {
    if (name === '') {
      dispatch(editError('Your resume name cannot be blank.'));
      return;
    }
    if (industries === '') {
      dispatch(editError('You must enter at least one industry.'));
      return;
    }
    executePrivateGql({
      mutation: editResumeMutation,
      variables: {
        id,
        name,
        description,
        industries,
      },
    }).then((res) => {
      const result = res.data.editResume;
      if (result.errors) {
        dispatch(editError(values(JSON.parse(result.errors))[0]));
        return;
      }

      dispatch(setResumeEditChanges({ name, description, industries }));
    });
  };
}

export const voteViaResumeOverview = (id, isUpvote) => (dispatch) => {
  executePrivateGql({
    mutation: votePooledCritiqueMutation,
    variables: {
      id,
      isUpvote,
    },
  })
    .then(() => {
      const upvote = {
        id,
        vote: isUpvote,
      };
      dispatch(addVoteViaResumeOverview(upvote));
    });
};

export const commentViaResumeOverview = (id, comment) => (dispatch) => {
  executePrivateGql({
    mutation: commentOnCritiqueMutation,
    variables: {
      comment,
      critiqueId: id,
    },
  })
    .then((res) => {
      let commentInfo = res.data.commentPooledCritique;
      commentInfo = {
        ...commentInfo,
        id,
      };
      dispatch(addCommentViaResumeOverview(commentInfo));
    });
};
