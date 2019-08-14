import gql from 'graphql-tag';

export const editProfileMutation = gql`
  mutation editProfile(
    $firstName: String
    $lastName: String
    $industries: String
    $biography: String
  ) {
    editProfile(
      firstName: $firstName
      lastName: $lastName
      industries: $industries
      biography: $biography
    ) {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const editAccountMutation = gql`
  mutation editProfile(
    $email: String
    $currentPassword: String
    $newPassword: String
    $username: String
    $emailSubscribed: Boolean
  ) {
    editProfile(
      email: $email
      currentPassword: $currentPassword
      newPassword: $newPassword
      username: $username
      emailSubscribed: $emailSubscribed
    ) {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const resendVerificationEmailMutation = gql`
  mutation resendVerificationEmail {
    resendVerificationEmail {
      errors
    }
  }
`;

export const cancelEmailChangeMutation = gql`
  mutation cancelEmailChange {
    cancelEmailChange {
      errors
    }
  }
`;

export const deleteProfileMutation = gql`
  mutation deleteProfile {
    deleteProfile {
      errors
    }
  }
`;

export const linkProfileWithWaterlooMutation = gql`
  mutation linkProfileWithWaterloo($ticket: String!, $linkExistingAccount: Boolean) {
    linkProfileWithWaterloo(ticket: $ticket, linkExistingAccount: $linkExistingAccount) {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const linkProfileWithFacebookMutation = gql`
  mutation linkProfileWithFacebook($token: String!, $linkExistingAccount: Boolean) {
    linkProfileWithFacebook(token: $token, linkExistingAccount: $linkExistingAccount) {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const linkProfileWithGoogleMutation = gql`
  mutation linkProfileWithGoogle($token: String!, $linkExistingAccount: Boolean) {
    linkProfileWithGoogle(token: $token, linkExistingAccount: $linkExistingAccount) {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const unlinkProfileWithWaterlooMutation = gql`
  mutation unlinkProfileWithWaterloo {
    unlinkProfileWithWaterloo {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const unlinkProfileWithFacebookMutation = gql`
  mutation unlinkProfileWithFacebook {
    unlinkProfileWithFacebook {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const unlinkProfileWithGoogleMutation = gql`
  mutation unlinkProfileWithGoogle {
    unlinkProfileWithGoogle {
      profile {
        firstName
        lastName
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
      }
      errors
    }
  }
`;

export const removeAvatarMutation = gql`
  mutation removeAvatar {
    removeAvatar {
      errors
    }
  }
`;
