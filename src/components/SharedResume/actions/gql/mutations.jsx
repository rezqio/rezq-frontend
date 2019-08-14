import gql from 'graphql-tag';

export const createLinkedCritiqueMutation = gql`
    mutation createLinkedCritique(
        $resumeToken: String!) {
        createLinkedCritique(
            resumeToken: $resumeToken
        ) {
            critique {
                id
                token
            }
            critiqueCreated
            errors
        }
    }
`;
