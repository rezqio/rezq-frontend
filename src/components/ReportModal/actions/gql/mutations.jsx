import gql from 'graphql-tag';

export const reportPageMutation = gql`
  mutation reportPage(
    $pathname: String!
    $search: String
    $stars: Int
    $message: String
    $replyTo: String
  ) {
    reportPage(
      pathname: $pathname
      search: $search
      stars: $stars
      message: $message
      replyTo: $replyTo
    ) {
      errors
    }
  }
`;
