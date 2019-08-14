import gql from 'graphql-tag';

export const saveCritiqueMutation = gql`
  mutation saveCritique(
    $id: String!
    $submit: Boolean!
    $annotations: String
    $summary: String
  ) {
    saveCritique(
      id: $id
      submit: $submit
      annotations: $annotations
      summary: $summary
    ) {
      errors
    }
  }
`;
