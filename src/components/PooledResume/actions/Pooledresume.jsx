import values from 'lodash/values';
import { executePublicGql, executePrivateGql } from '../../../GqlClients';
import { pooledResumeQuery } from './gql/queries';
import {
  createPooledCritiqueMutation,
  votePooledCritiqueMutation,
  commentOnCritiqueMutation,
} from './gql/mutations';

export const loadPooledResume = () => ({
  type: 'LOAD_POOLED_RESUME',
});

export const setPooledResume = pooledResume => ({
  type: 'SET_POOLED_RESUME',
  pooledResume,
});

export const votePooledResume = upvote => ({
  type: 'UPVOTE_POOLED_RESUME',
  upvote,
});

export const setPooledResumeError = error => ({
  type: 'SET_POOLED_RESUME_ERROR',
  error,
});

export const addCommentViaPooledResume = comment => ({
  type: 'COMMENT_VIA_POOLED_RESUME',
  comment,
});

export function fetchPooledResume(isLoggedIn, id, privatePool = '') {
  return (dispatch) => {
    dispatch(loadPooledResume());
    (isLoggedIn ? executePrivateGql : executePublicGql)({
      query: pooledResumeQuery,
      variables: {
        id,
        privatePool,
      },
    }).then((res) => {
      dispatch(setPooledResume(res.data.pooledResume));
    });
  };
}

export function createPooledResumeCritique(id, privatePool = '') {
  return (dispatch) => {
    executePrivateGql({
      mutation: createPooledCritiqueMutation,
      variables: {
        resumeId: id,
        privatePool,
      },
    })
      .then((res) => {
        if (res.data.createPooledCritique.errors) {
          dispatch(
            setPooledResumeError(values(JSON.parse(res.data.createPooledCritique.errors))[0]),
          );
          return;
        }
        window.location.href = `/pooled-critique/${res.data.createPooledCritique.critique.id}${
          privatePool ? `?${privatePool}` : ''}`;
      });
  };
}

export const votePooledResumeCritique = (id, isUpvote) => (dispatch) => {
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
      dispatch(votePooledResume(upvote));
    });
};

export function commentViaPooledResume(id, comment, privatePool = '') {
  return (dispatch) => {
    executePrivateGql({
      mutation: commentOnCritiqueMutation,
      variables: {
        comment,
        critiqueId: id,
        privatePool,
      },
    })
      .then((res) => {
        let commentInfo = res.data.commentPooledCritique;
        commentInfo = {
          ...commentInfo,
          id,
        };
        dispatch(addCommentViaPooledResume(commentInfo));
      });
  };
}
