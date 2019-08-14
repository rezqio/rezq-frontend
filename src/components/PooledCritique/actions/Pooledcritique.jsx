import values from 'lodash/values';
import { executePrivateGql } from '../../../GqlClients';
import { savePooledCritiqueMutation } from './gql/mutations';
import { pooledCritiqueQuery } from './gql/queries';
import { commentOnCritiqueMutation } from '../../PooledResume/actions/gql/mutations';


export const loadPooledCritique = () => ({
  type: 'LOAD_POOLED_CRITIQUE',
});

export const setPooledCritique = pooledCritique => ({
  type: 'SET_POOLED_CRITIQUE',
  pooledCritique,
});

export const updateSummary = summary => ({
  type: 'UPDATE_SUMMARY',
  summary,
});

export const resetEdit = () => ({
  type: 'RESET_EDIT',
});

export const editErrored = error => ({
  type: 'EDIT_ERRORED',
  error,
});

export const editSaved = () => ({
  type: 'EDIT_SAVED',
});

export const addCommentViaPooledCritique = comment => ({
  type: 'COMMENT_VIA_POOLED_CRITIQUE',
  comment,
});

export function fetchPooledCritique(id, pool) {
  return (dispatch) => {
    dispatch(loadPooledCritique());
    executePrivateGql({
      query: pooledCritiqueQuery,
      variables: {
        id,
        pool,
      },
    }).then((res) => {
      dispatch(setPooledCritique(res.data.pooledCritique));
    });
  };
}

export function savePooledCritique(submit) {
  return (dispatch, getState) => {
    dispatch(resetEdit());
    let annotations = getState().pdf.undoableAnnotations.present;
    if (getState().pdf.undoableAnnotations.present.length === 0) {
      annotations = getState().pdf.undoableAnnotations.unsavedAnnotations;
    }
    executePrivateGql({
      mutation: savePooledCritiqueMutation,
      variables: {
        annotations: JSON.stringify(annotations),
        id: getState().pooledcritique.pooledCritique.id,
        submit,
        summary: getState().pooledcritique.pooledCritique.summary,
      },
    }).then((res) => {
      if (res.data.savePooledCritique.errors) {
        dispatch(editErrored(values(JSON.parse(res.data.savePooledCritique.errors))[0]));
        return;
      }
      if (submit) {
        dispatch(editSaved());
        window.location.reload();
      } else {
        dispatch(editSaved());
      }
    });
  };
}

export function commentViaPooledCritique(id, comment, privatePool = '') {
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
        dispatch(addCommentViaPooledCritique(commentInfo));
      });
  };
}

export const resetEditPooledCritique = () => (dispatch) => {
  dispatch(resetEdit());
};
