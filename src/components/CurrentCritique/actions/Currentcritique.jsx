import { executePrivateGql } from '../../../GqlClients';
import { currentlyCritiquingQuery, isCritiquerRequestQueuedQuery, profileIndustriesQuery } from './gql/queries';
import { requestToCritiqueMutation, cancelRequestToCritiqueMutation } from './gql/mutations';

export const loadCurrentCritique = () => ({
  type: 'LOAD_CURRENT_CRITIQUE',
});

export const setCurrentCritique = id => ({
  type: 'SET_CURRENT_CRITIQUE',
  id,
});

export const setProfileIndustries = industries => ({
  type: 'SET_PROFILE_INDUSTRIES',
  industries,
});

export const setCritiquerRequestQueued = queued => ({
  type: 'SET_CRITIQUER_REQUEST_QUEUED',
  queued,
});

export const fetchCurrentCritique = () => (dispatch) => {
  dispatch(loadCurrentCritique());
  executePrivateGql({
    query: currentlyCritiquingQuery,
  }, false).then((res) => {
    if (res.data.currentlyCritiquing) {
      dispatch(setCurrentCritique(res.data.currentlyCritiquing.id));
    } else {
      dispatch(setCurrentCritique(''));
    }
  });
};

export const checkIsCritiquerRequestQueued = () => (dispatch) => {
  executePrivateGql({
    query: isCritiquerRequestQueuedQuery,
  }, false).then((res) => {
    if (res.data.isCritiquerRequestQueued) {
      dispatch(setCritiquerRequestQueued(true));
    } else {
      dispatch(setCritiquerRequestQueued(false));
    }
  });
};

export const startCritique = industries => (dispatch) => {
  executePrivateGql({
    mutation: requestToCritiqueMutation,
    variables: {
      industries,
    },
  }).then(() => {
    dispatch(fetchCurrentCritique());
    dispatch(checkIsCritiquerRequestQueued());
  });
};

export const cancelCritiqueRequest = () => (dispatch) => {
  executePrivateGql({
    mutation: cancelRequestToCritiqueMutation,
  }).then(() => {
    dispatch(checkIsCritiquerRequestQueued());
  });
};

export const fetchProfileIndustries = () => (dispatch) => {
  executePrivateGql({
    query: profileIndustriesQuery,
  }).then((res) => {
    dispatch(setProfileIndustries(res.data.profile.industries));
  });
};
