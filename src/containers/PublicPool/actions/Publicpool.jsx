import { executePublicGql, executePrivateGql } from '../../../GqlClients';
import {
  pooledResumesQuery,
} from './gql/queries';

export const setPublicResumes = pooledResumes => ({
  type: 'SET_POOLED_RESUMES',
  pooledResumes,
});

export function fetchPublicResumes(isLoggedIn, industries = '', first = 3, offset = 0, privatePool = '') {
  return (dispatch) => {
    (isLoggedIn ? executePrivateGql : executePublicGql)({
      query: pooledResumesQuery,
      variables: {
        industries, first, offset, privatePool,
      },
    }).then((res) => {
      dispatch(setPublicResumes(res.data.pooledResumes));
    });
  };
}
