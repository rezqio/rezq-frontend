import gql from 'graphql-tag';

export const saveLinkedCritiqueMutation = gql`
  mutation saveLinkedCritique(
    $token: String!
    $submit: Boolean
    $annotations: String
    $summary: String
  ) {
    saveLinkedCritique(
      token: $token
      submit: $submit
      annotations: $annotations
      summary: $summary
    ) {
      critique {
        id
        token
      }
      errors
    }
  }
`;
