import gql from 'graphql-tag';

export const uploadResumeMutation = gql`
  mutation uploadResume(
    $name: String!
    $description: String
    $industries: String!
    $institutionPool: String
    $privatePool: String
  ) {
    uploadResume(
      name: $name
      description: $description
      industries: $industries
      institutionPool: $institutionPool
      privatePool: $privatePool
    ) {
      uploadInfo
      thumbnailUploadInfo
      resume {
        id
        name
      }
      errors
    }
  }
`;

export const deleteResumesMutation = gql`
  mutation deleteResumes(
    $ids: [String]!
  ) {
    deleteResumes(
      ids: $ids
    ) {
      errors
    }
  }
`;
