import gql from 'graphql-tag';

export const publicProfileQuery = gql`
  query profile($username: String!) {
    profile(username: $username) {
      id
      firstName
      lastName
      username
      dateJoined
      industries
      isVerified
      isPremium
      biography
      pooledcritiqueSet {
        id
        resume {
          id
          name
          thumbnailDownloadUrl
        }
        summary
        submitted
        submittedOn
        upvotes
      }
      avatarDownloadUrl
    }
  }
`;
