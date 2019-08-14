import gql from 'graphql-tag';

export const linkedCritiqueQuery = gql`
  query linkedCritique($token: String!) {
    linkedCritique(token: $token) {
      id
      resume {
        id
        uploader {
          id
          username
        }
        name
        industries
        description
        downloadUrl
        notesForCritiquer
      }
      submitted
      summary
      annotations
      token
    }
  }
`;
