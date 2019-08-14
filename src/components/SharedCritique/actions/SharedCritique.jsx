import values from 'lodash/values';
import { executePublicGql, executePrivateGql } from '../../../GqlClients';
import { linkedCritiqueQuery } from './gql/queries';
import { saveLinkedCritiqueMutation } from './gql/mutations';
import { unsetLinkedCritiqueCreated } from '../../SharedResume/actions/SharedResume';


export const loadCritique = () => ({
  type: 'LOAD_CRITIQUE',
});

export const setCritique = linkedCritique => ({
  type: 'SET_CRITIQUE',
  linkedCritique,
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

export function fetchLinkedCritique(critiqueToken) {
  return (dispatch) => {
    dispatch(loadCritique());
    executePublicGql({
      query: linkedCritiqueQuery,
      variables: {
        token: critiqueToken,
      },
    }).then((res) => {
      dispatch(unsetLinkedCritiqueCreated());
      dispatch(setCritique(res.data.linkedCritique));
    });
  };
}

export function saveLinkedCritique(isLoggedIn, submit) {
  return (dispatch, getState) => {
    dispatch(resetEdit());
    let annotations = getState().pdf.undoableAnnotations.present;
    if (getState().pdf.undoableAnnotations.present.length === 0) {
      annotations = getState().pdf.undoableAnnotations.unsavedAnnotations;
    }
    (isLoggedIn ? executePrivateGql : executePublicGql)({
      mutation: saveLinkedCritiqueMutation,
      variables: {
        token: getState().sharedcritique.linkedCritique.token,
        submit,
        annotations: JSON.stringify(annotations),
        summary: getState().sharedcritique.linkedCritique.summary,
      },
    }).then((res) => {
      if (res.data.saveLinkedCritique.errors) {
        dispatch(editErrored(values(JSON.parse(res.data.saveLinkedCritique.errors))[0]));
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

export const resetEditLinkedCritique = () => (dispatch) => {
  dispatch(resetEdit());
};
