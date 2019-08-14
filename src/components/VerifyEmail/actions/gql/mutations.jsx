import gql from 'graphql-tag';

export const verifyEmailMutation = gql`
    mutation verifyEmail(
        $verificationToken: String!) {
        verifyEmail(
            verificationToken: $verificationToken
        ) {
            token
            expires
            errors
        }
    }
`;
