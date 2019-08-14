import React from 'react';
import ReactGA from 'react-ga';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { BrowserRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, autoRehydrate } from 'redux-persist';
import { ApolloProvider } from 'react-apollo';
import moment from 'moment';
import { privateClient } from './GqlClients';
import rootReducer from './reducers';
import App from './containers/App';
import { logoutUser } from './containers/Login/actions/sessionActions';

import '../node_modules/bootstrap/dist/css/bootstrap.css';

let middleware = [thunk];

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line no-console
  console.log('RUNNING IN DEVELOPMENT MODE');
  // eslint-disable-next-line global-require
  const { logger } = require('redux-logger');
  middleware = [...middleware, logger];
} else {
  ReactGA.initialize('UA-65322336-2');
  ReactGA.pageview(window.location.pathname);
}

const store = createStore(
  rootReducer,
  undefined,
  composeWithDevTools(applyMiddleware(...middleware), autoRehydrate()),
);

if (
  'expires' in localStorage
  && moment(localStorage.expires) < moment()
) {
  store.dispatch(logoutUser());
}

persistStore(store, {}, () => {
  render(
    <ApolloProvider client={privateClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root'),
  );
});

if (module.hot) {
  module.hot.accept('./containers/App', () => {
    render(App);
  });
}

export default store;
