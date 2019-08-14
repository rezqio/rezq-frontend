import gql from 'graphql-tag';

export const pooledCritiqueQuery = gql`
  query pooledCritique($id: String!, $privatePool: String) {
    pooledCritique(id: $id, privatePool: $privatePool) {
      id
      critiquer {
        id
      }
      pooledcritiquecommentSet {
        user {
          id
          username
        }
        comment
        createdOn
      }
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
