import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { connect } from 'react-redux';

const AuthRoute = ({ component, ...props }) => {
  if (localStorage.getItem('token') && props.authenticated) {
    return <Route {...props} component={component} />;
  }
  return <Redirect to="/login" />;
};

AuthRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  authenticated: PropTypes.bool.isRequired,
  path: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  authenticated: state.login.session,
});

export default connect(mapStateToProps)(AuthRoute);
