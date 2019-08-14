import gql from 'graphql-tag';

export const createPooledCritiqueMutation = gql`
  mutation createPooledCritique($privatePool: String, $resumeId: String!) {
    createPooledCritique(privatePool: $privatePool, resumeId: $resumeId) {
      errors
      critique {
        id
      }
    }
  }
`;

export const votePooledCritiqueMutation = gql`
  mutation votePooledCritique(
    $id: String!
    $isUpvote: Boolean
  ) {
    votePooledCritique(
      id: $id
      isUpvote: $isUpvote
    ) {
      errors
      result
    }
  }
`;

export const commentOnCritiqueMutation = gql`
  mutation commentPooledCritique(
    $comment: String!
    $critiqueId: String!
    $privatePool: String
  ) {
    commentPooledCritique(
      comment: $comment
      critiqueId: $critiqueId
      privatePool: $privatePool
    ) {
      comment {
        user {
          id
          username
        }
        comment
        createdOn
      }
      errors
    }
  }
`;
