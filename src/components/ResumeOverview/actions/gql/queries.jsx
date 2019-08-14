import gql from 'graphql-tag';

export const resumeQuery = gql`
  query resume(
    $id: String!
  ) {
    resume (
      id: $id
    ) {
      id
      name
      description
      industries
      linkEnabled
      pool {
        id
      }
      token
      notesForCritiquer
      matchedcritiqueSet {
        id
        submitted
        submittedOn
        summary
        annotations
      }
      linkedcritiqueSet {
        id
        critiquer {
          id
          username
        }
        submitted
        submittedOn
        summary
        annotations
      }
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
        submitted
        submittedOn
        summary
        annotations
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
