import gql from 'graphql-tag';

export const resumesQuery = gql`
  query resumes {
    resumes {
      id
      name
      description
      industries
      createdOn
      thumbnailDownloadUrl
      matchedcritiqueSet{
        submitted
      }
      linkedcritiqueSet{
        submitted
      }
      pooledcritiqueSet{
        submitted
      }
    }
  }
`;

export const profileIndustriesQuery = gql`
  query profile {
    profile {
      id
      industries
      institutions
    }
  }
`;
