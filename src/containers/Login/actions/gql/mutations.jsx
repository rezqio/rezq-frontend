import gql from 'graphql-tag';

export const createTokenMutation = gql`
  mutation createToken($email: String!, $password: String!) {
    createToken(email: $email, password: $password) {
      token
      expires
      profileCreated
      unverifiedEmail
      errors
    }
  }
`;

export const createTokenWithWaterlooMutation = gql`
  mutation createTokenWithWaterloo($ticket: String!) {
    createTokenWithWaterloo(ticket: $ticket) {
      token
      expires
      profileCreated
      unverifiedEmail
      errors
    }
  }
`;

export const createTokenWithFacebookMutation = gql`
  mutation createTokenWithFacebook($token: String!) {
    createTokenWithFacebook(token: $token) {
      token
      expires
      profileCreated
      unverifiedEmail
      errors
    }
  }
`;

export const createTokenWithGoogleMutation = gql`
  mutation createTokenWithGoogle($token: String!) {
    createTokenWithGoogle(token: $token) {
      token
      expires
      profileCreated
      unverifiedEmail
      errors
    }
  }
`;

export const renewTokenMutation = gql`
  mutation renewToken {
    renewToken {
      token
      expires
      errors
    }
  }
`;
