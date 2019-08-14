import gql from 'graphql-tag';

export const pooledResumeQuery = gql`
  query pooledResume($id: String!, $privatePool: String) {
    pooledResume(id: $id, privatePool: $privatePool) {
      id
      name
      description
      industries
      notesForCritiquer
      pooledcritiqueSet {
        id
        critiquer {
          id
          username
        }
        pooledcritiquecommentSet {
          user {
            id
            username
          }
          comment
          createdOn
        }
        summary
        annotations
        submitted
        submittedOn
        upvotes
      }
      downloadUrl
      uploader {
        id
        username
      }
      pooledCritiquesUserUpvoted
    }
  }
`;
