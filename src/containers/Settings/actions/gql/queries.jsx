import gql from 'graphql-tag';

export const profileQuery = gql`
  query profile {
    profile {
      id
      firstName
      lastName
      biography
      email
      unverifiedEmail
      username
      industries
      waterlooId
      facebookId
      googleId
      hasPassword
      emailSubscribed
      avatarDownloadUrl
      avatarUploadInfo
    }
  }
`;

export const avatarUploadInfoQuery = gql`
  query profile {
    profile {
      id
      avatarUploadInfo
    }
  }
`;
