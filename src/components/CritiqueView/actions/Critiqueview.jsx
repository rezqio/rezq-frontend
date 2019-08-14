import values from 'lodash/values';
import { executePrivateGql } from '../../../GqlClients';
import { critiqueQuery } from './gql/queries';
import { saveCritiqueMutation } from './gql/mutations';


export const loadCritique = () => ({
  type: 'LOAD_CRITIQUE',
});

export const setCritique = critique => ({
  type: 'SET_CRITIQUE',
  critique,
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

export function fetchCritique(critiqueId) {
  return (dispatch) => {
    dispatch(loadCritique());
    executePrivateGql({
      query: critiqueQuery,
      variables: {
        id: critiqueId,
      },
    }).then((res) => {
      dispatch(setCritique(res.data.critique));
    });
  };
}

export function saveCritique(submit) {
  return (dispatch, getState) => {
    dispatch(resetEdit());
    let annotations = getState().pdf.undoableAnnotations.present;
    if (getState().pdf.undoableAnnotations.present.length === 0) {
      annotations = getState().pdf.undoableAnnotations.unsavedAnnotations;
    }
    executePrivateGql({
      mutation: saveCritiqueMutation,
      variables: {
        id: getState().critique.critique.id,
        submit,
        annotations: JSON.stringify(annotations),
        summary: getState().critique.critique.summary,
      },
    }).then((res) => {
      if (res.data.saveCritique.errors) {
        dispatch(editErrored(values(JSON.parse(res.data.saveCritique.errors))[0]));
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

export const resetEditCritique = () => (dispatch) => {
  dispatch(resetEdit());
};
