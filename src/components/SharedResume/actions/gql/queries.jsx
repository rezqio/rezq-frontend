import gql from 'graphql-tag';

export const linkSharedResumeQuery = gql`
  query resume(
    $token: String!
  ) {
    resume (
      token: $token
    ) {
      id
      uploader {
        id
        username
      }
      name
      description
      industries
      notesForCritiquer
      downloadUrl
    }
  }
`;
