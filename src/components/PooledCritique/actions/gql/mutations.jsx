import gql from 'graphql-tag';

export const savePooledCritiqueMutation = gql`
  mutation savePooledCritique(
    $annotations: String
    $id: String!
    $submit: Boolean
    $summary: String
  ) {
    savePooledCritique(
      annotations: $annotations
      id: $id
      submit: $submit
      summary: $summary
    ) {
      errors
      critique {
        id
      }
    }
  }
`;
