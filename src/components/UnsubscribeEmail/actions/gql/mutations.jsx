import gql from 'graphql-tag';

export const unsubscribeEmailMutation = gql`
    mutation unsubscribeEmail(
        $unsubscribeToken: String!) {
        unsubscribeEmail(
            unsubscribeToken: $unsubscribeToken
        ) {
            errors
        }
    }
`;
