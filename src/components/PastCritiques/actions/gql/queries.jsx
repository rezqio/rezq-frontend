import gql from 'graphql-tag';

export const critiquesQuery = gql`
  query profile {
    profile {
      id
      matchedcritiqueSet {
        id
        resume {
          name
          description
          industries
          thumbnailDownloadUrl
        }
        submitted
        submittedOn
      }
      pooledcritiqueSet {
        id
        resume {
          name
          description
          industries
          thumbnailDownloadUrl
        }
        submitted
        submittedOn
      }
      linkedcritiqueSet {
        id
        resume {
          name
          description
          industries
          thumbnailDownloadUrl
        }
        submitted
        submittedOn
        token
      }
    }
  }
`;
