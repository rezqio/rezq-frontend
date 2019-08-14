import { executePublicGql } from '../../../GqlClients';
import { publicProfileQuery } from './gql/queries';

export const loadPublicProfile = () => ({
  type: 'LOAD_PUBLIC_PROFILE',
});

export const setPublicProfile = profile => ({
  type: 'SET_PUBLIC_PROFILE',
  profile,
});

export const setPublicProfileError = error => ({
  type: 'SET_PUBLIC_PROFILE_ERROR',
  error,
});

export const fetchPublicProfile = username => (dispatch) => {
  dispatch(loadPublicProfile());
  executePublicGql({
    query: publicProfileQuery,
    variables: {
      username,
    },
  })
    .then((res) => {
      dispatch(setPublicProfile(res.data.profile));
    });
};
