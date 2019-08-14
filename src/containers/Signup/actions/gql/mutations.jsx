import gql from 'graphql-tag';

export const createProfileMutation = gql`
  mutation createProfile(
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    createProfile(
      email: $email
      password: $password
      firstName: $firstName
      lastName: $lastName
    ) {
      token
      expires
      profileCreated
      profile {
        unverifiedEmail
      }
      errors
    }
  }
`;

export const createProfileWithWaterlooMutation = gql`
  mutation createProfileWithWaterloo($ticket: String!) {
    createProfileWithWaterloo(ticket: $ticket) {
      token
      expires
      profileCreated
      profile {
        unverifiedEmail
      }
      errors
    }
  }
`;

export const createProfileWithFacebookMutation = gql`
  mutation createProfileWithFacebook($token: String!) {
    createProfileWithFacebook(token: $token) {
      token
      expires
      profileCreated
      profile {
        unverifiedEmail
      }
      errors
    }
  }
`;

export const createProfileWithGoogleMutation = gql`
  mutation createProfileWithGoogle($token: String!) {
    createProfileWithGoogle(token: $token) {
      token
      expires
      profileCreated
      profile {
        unverifiedEmail
      }
      errors
    }
  }
`;
