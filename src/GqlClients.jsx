import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import moment from 'moment';
import values from 'lodash/values';
import { BACKEND_URI } from './constants';
import { renewTokenMutation } from './containers/Login/actions/gql/mutations';
import getCsrfToken from './utils/csrftoken';

const errorLink = onError((operation) => {
  const { networkError, graphQLErrors } = operation;

  if (networkError) {
    if (networkError.statusCode === 429) {
      // eslint-disable-next-line no-alert
      alert('Too many requests, please try again later.');
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!networkError.statusCode) {
        alert("Couldn't reach the backend. Did you start it?"); // eslint-disable-line no-alert
      } else {
        alert(JSON.stringify(networkError)); // eslint-disable-line no-alert
      }
    }

    if (networkError.statusCode === 401 || networkError.statusCode === 403) {
      localStorage.clear();
      window.location.href = '/login';
    } else {
      window.location.href = '/oops';
    }
  }

  if (graphQLErrors) {
    if (process.env.NODE_ENV !== 'production') {
      alert(JSON.stringify(graphQLErrors)); // eslint-disable-line no-alert
    }

    window.location.href = '/oops';
  }
});

// Public client
const publicHttpLink = new HttpLink({
  uri: `${BACKEND_URI}/v1/public/`,
  credentials: 'include',
});

const publicMiddlewareLink = new ApolloLink((operation, forward) => forward(operation));

const publicClient = new ApolloClient({
  link: ApolloLink.from([errorLink, publicMiddlewareLink, publicHttpLink]),
  cache: new InMemoryCache(),
});

const privateHttpLink = new HttpLink({
  uri: `${BACKEND_URI}/v1/private/`,
  credentials: 'include',
});

const privateMiddlewareLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: ('token' in localStorage) ? `Bearer ${localStorage.token}` : '',
      'X-CSRFToken': getCsrfToken(),
    },
  });
  return forward(operation);
});

const privateClient = new ApolloClient({
  link: ApolloLink.from([errorLink, privateMiddlewareLink, privateHttpLink]),
  cache: new InMemoryCache(),
});

// Helper functions
function executeGql(request, client, throw404) {
  return new Promise((resolve) => {
    if (request.query) {
      if (!request.fetchPolicy) {
        request.fetchPolicy = 'network-only';
      }
      client
        .query(request)
        .then((res) => {
          if (throw404 && !values(res.data)[0]) {
            window.location.href = '/notfound';
          }
          resolve(res);
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== 'production') {
            console.error(err);
          }
          window.location.href = '/oops';
        });
    } else {
      // mutation
      client
        .mutate(request)
        .then((res) => {
          if (process.env.NODE_ENV !== 'production') {
            if (res.errors) {
              console.error(res.errors);
            }
            const mutationErrors = values(res.data)[0].errors;
            if (mutationErrors) {
              console.error(mutationErrors);
            }
          }
          resolve(res);
        })
        .catch((err) => {
          if (process.env.NODE_ENV !== 'production') {
            console.error(err);
          }
          window.location.href = '/oops';
        });
    }
  });
}

function executePublicGql(request, throw404 = true) {
  return executeGql(request, publicClient, throw404);
}

function executePrivateGql(request, throw404 = true) {
  if (
    'expires' in localStorage
    && moment().add(660, 'minutes') > moment(localStorage.expires)
  ) {
    privateClient
      .mutate({
        mutation: renewTokenMutation,
      })
      .then((res) => {
        if (process.env.NODE_ENV !== 'production') {
          if (res.errors) {
            console.error(res.errors);
          }
          if (res.data.renewToken.errors) {
            console.error(res.data.renewToken.errors);
          }
        }
        if (res.errors || res.data.renewToken.errors) {
          return;
        }
        localStorage.setItem('token', res.data.renewToken.token);
        localStorage.setItem('expires', res.data.renewToken.expires);
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error(err);
        }
      });
  }
  return executeGql(request, privateClient, throw404);
}

export {
  publicClient, privateClient, executePublicGql, executePrivateGql,
};
