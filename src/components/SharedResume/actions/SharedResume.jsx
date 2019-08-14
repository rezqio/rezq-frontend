import { executePublicGql, executePrivateGql } from '../../../GqlClients';
import { linkSharedResumeQuery } from './gql/queries';
import { createLinkedCritiqueMutation } from './gql/mutations';

export const loadResume = () => ({
  type: 'LOAD_LINKED_RESUME',
});

export const setResume = resume => ({
  type: 'SET_LINKED_RESUME',
  resume,
});

export const setLinkedCritiqueCreated = critiqueCreated => ({
  type: 'SET_LINKED_CRITIQUE_CREATED',
  critiqueCreated,
});

export const unsetLinkedCritiqueCreated = () => ({
  type: 'UNSET_LINKED_CRITIQUE_CREATED',
});

export const fetchSharedResume = token => (dispatch) => {
  dispatch(loadResume());
  executePublicGql({
    query: linkSharedResumeQuery,
    variables: {
      token,
    },
  }).then((res) => {
    dispatch(setResume(res.data.resume));
  });
};

export const createLinkedCritique = (isLoggedIn, resumeToken) => (dispatch) => {
  (isLoggedIn ? executePrivateGql : executePublicGql)({
    mutation: createLinkedCritiqueMutation,
    variables: {
      resumeToken,
    },
  }).then((res) => {
    // TODO: error handling
    if (res.data.createLinkedCritique.errors) {
      return;
    }
    dispatch(setLinkedCritiqueCreated(res.data.createLinkedCritique.critiqueCreated));
    window.location.href = `/shared-critique/${res.data.createLinkedCritique.critique.token}`;
  });
};
