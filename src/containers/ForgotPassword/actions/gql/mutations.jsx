import gql from 'graphql-tag';

export const createPasswordResetTokenMutation = gql`
    mutation createPasswordResetToken($email: String!) {
        createPasswordResetToken(
            email: $email
        ) {
            errors
        }
    }
`;
