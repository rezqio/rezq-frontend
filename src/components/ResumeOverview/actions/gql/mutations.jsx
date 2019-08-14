import gql from 'graphql-tag';

export const requestCritiqueMutation = gql`
    mutation requestCritique($id: String!) {
        requestCritique(
            resumeId: $id
        ) {
            errors
        }
    }
`;

export const cancelRequestForCritiqueMutation = gql`
  mutation deleteCritiqueRequest($id: String!) {
    deleteCritiqueRequest (
      id: $id
    ) {
      errors
    }
  }
`;

export const updateNotesMutation = gql`
    mutation editResume($id: String!, $notes: String) {
        editResume(
            id: $id
            notesForCritiquer: $notes
        ) {
            errors
            resume {
                notesForCritiquer
            }
        }
    }
`;

export const enableLinkSharingMutation = gql`
    mutation editResume($id: String!, $linkEnabled: Boolean!) {
        editResume(
            id: $id
            linkEnabled: $linkEnabled
        ) {
            errors
            resume {
              token
              linkEnabled
              downloadUrl
            }
        }
    }
`;

export const editPoolMutation = gql`
    mutation editResume(
      $id: String!,
      $institutionPool: String
      $privatePool: String
    ) {
        editResume(
          id: $id
          institutionPool: $institutionPool
          privatePool: $privatePool
        ) {
            errors
            resume {
              token
              pool {
                id
              }
              downloadUrl
            }
        }
    }
`;

export const deleteResumeMutation = gql`
  mutation deleteResume(
    $id: String!
  ) {
    deleteResume(
      id: $id
    ) {
      errors
    }
  }
`;

export const editResumeMutation = gql`
  mutation editResume(
    $id: String!,
    $name: String,
    $description: String,
    $industries: String
  ) {
    editResume(
      id: $id,
      name: $name,
      description: $description,
      industries: $industries
    ) {
      errors
    }
  }
`;
