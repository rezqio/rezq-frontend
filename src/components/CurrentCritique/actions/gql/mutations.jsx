import gql from 'graphql-tag';

export const requestToCritiqueMutation = gql`
  mutation requestToCritique($industries: String!) {
    requestToCritique(industries: $industries) {
      critiquerRequest {
        id
      }
      errors
    }
  }
`;

export const cancelRequestToCritiqueMutation = gql`
  mutation cancelRequestToCritique {
    cancelRequestToCritique {
      errors
    }
  }
`;
