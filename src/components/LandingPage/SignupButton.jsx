import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import { PATHS } from '../../constants';
import './buttons.css';

const SignupButton = props => (
  <Button href={(props.isLoggedIn) ? PATHS.RESUMES : PATHS.SIGNUP} className="landingPageButton">
    {(props.isLoggedIn) ? 'Upload a Resume' : 'Get Started'}
  </Button>
);

SignupButton.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default SignupButton;
