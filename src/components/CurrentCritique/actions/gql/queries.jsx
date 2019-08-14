import gql from 'graphql-tag';

export const currentlyCritiquingQuery = gql`
  query currentlyCritiquing {
    currentlyCritiquing {
      id
    }
  }
`;

export const profileIndustriesQuery = gql`
  query profile {
    profile {
      industries
    }
  }
`;

export const isCritiquerRequestQueuedQuery = gql`
  query isCritiquerRequestQueued {
    isCritiquerRequestQueued
  }
`;
