import gql from 'graphql-tag';

export const critiqueQuery = gql`
  query critique($id: String!) {
    critique(id: $id) {
      id
      resume {
        id
        name
        industries
        description
        downloadUrl
        notesForCritiquer
        uploader {
          id
          username
        }
      }
      submitted
      summary
      annotations
    }
  }
`;
