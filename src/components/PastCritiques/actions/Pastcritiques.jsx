import { executePrivateGql } from '../../../GqlClients';
import { critiquesQuery } from './gql/queries';

export const loadCritiques = () => ({
  type: 'LOAD_CRITIQUES',
});

export const setCritiques = profile => ({
  type: 'SET_CRITIQUES',
  profile,
});

export const fetchCritiques = () => (dispatch) => {
  dispatch(loadCritiques());
  executePrivateGql({
    query: critiquesQuery,
  }).then((res) => {
    dispatch(setCritiques(res.data.profile));
  });
};
