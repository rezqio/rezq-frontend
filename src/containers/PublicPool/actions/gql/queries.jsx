import gql from 'graphql-tag';

export const pooledResumesQuery = gql`
  query pooledResumes($industries: String, $first: Int, $offset: Int, $privatePool: String) {
    pooledResumes(industries: $industries, first: $first, offset: $offset, privatePool: $privatePool) {
      resumes {
        id
        name
        description
        industries
        createdOn
        thumbnailDownloadUrl
        pooledcritiqueSet {
          submitted
        }
      }
      totalCount
    }
  }
`;
