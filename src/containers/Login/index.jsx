import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import * as sessionActions from './actions/sessionActions';
import {
  FRONTEND_URI,
  UWATERLOO_CAS,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_VERSION,
  GOOGLE_CLIENT_ID,
  PATHS,
} from '../../constants';
import '../signup.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);

    this.state = {
      credentials: {
        email: '',
        password: '',
      },
    };
  }

  componentWillMount() {
    if (!this.props.authenticated) {
      this.props.loginRequest();
    }
  }

  componentDidMount() {
    this.setTicket();
  }

  onSave(event) {
    event.preventDefault();
    const { credentials } = this.state;
    const { createToken } = this.props;
    createToken(credentials);
    this.setState({
      credentials: {
        email: credentials.email,
        password: '',
      },
    });
  }

  onChange(event) {
    const field = event.target.name;
    const { credentials } = this.state;
    credentials[field] = event.target.value;
    this.setState({ credentials });
  }

  setTicket() {
    if (localStorage.getItem('token')) {
      return;
    }
    const { createTokenWithWaterloo } = this.props;
    const ticket = window.location.search;
    const isTicket = ticket.startsWith('?ticket');
    if (isTicket) {
      const ticketObject = { ticket: ticket.split('=')[1] };
      createTokenWithWaterloo(ticketObject);
    }
  }

  render() {
    const { authenticated } = this.props;
    const { credentials } = this.state;
    const { loginError } = this.props;
    const responseFacebook = (response) => {
      // TODO: propagate error to UI for user
      if (!response || !response.accessToken) {
        console.error('Error authenticating with Facebook.');
      }
      const { createTokenWithFacebook } = this.props;
      const accessToken = { token: response.accessToken };
      createTokenWithFacebook(accessToken);
    };

    const responseGoogle = (response) => {
      const { createTokenWithGoogle } = this.props;
      const accessToken = { token: response.tokenObj.id_token };
      createTokenWithGoogle(accessToken);
    };

    const responseGoogleFailed = (error) => {
      // TODO: propagate error to UI for user
      console.error(error);
    };

    if (localStorage.getItem('token') && authenticated) {
      return <Redirect to={PATHS.RESUMES} />;
    }

    return (
      <div className="splash splash-padded">
        <div className="signupContainer">
          <div className="signupHeader">Sign in to RezQ</div>
          <Form horizontal>
            <fieldset>
              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel style={{ marginLeft: '5px' }}>Email or Username</ControlLabel>
                <FormControl
                  maxLength="254"
                  name="email"
                  value={credentials.email}
                  onChange={this.onChange}
                />
              </FormGroup>
            </fieldset>
            <fieldset>
              <FormGroup controlId="formHorizontalPassword">
                <ControlLabel style={{ marginLeft: '5px' }}>
                  Password
                </ControlLabel>
                <a href={PATHS.FORGOT_PASSWORD} className="forgotPassword" tabIndex={-1}>
                  Forgot your password?
                </a>
                <FormControl
                  maxLength="128"
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={this.onChange}
                />
              </FormGroup>
            </fieldset>

            <fieldset>
              <FormGroup>
                {loginError && (
                  <Alert className="alert" bsStyle="danger">
                    {loginError}
                  </Alert>
                )}
                <Button
                  className="signupButton"
                  type="submit"
                  onClick={this.onSave}
                >
                  Sign in
                </Button>
              </FormGroup>
            </fieldset>
          </Form>

          <div className="otherSignup">
            <div className="divider-horizontal" />
            <Button
              className="signupBtn uwaterloo"
              onClick={() => {
                window.location.assign(`${UWATERLOO_CAS + FRONTEND_URI}/login`);
              }}
            >
              Sign in with UWaterloo CAS
            </Button>
            <FacebookLogin
              appId={FACEBOOK_APP_ID}
              scope="public_profile"
              fields="email"
              version={FACEBOOK_APP_VERSION}
              callback={responseFacebook}
              render={renderProps => (
                <Button
                  onClick={renderProps.onClick}
                  className="signupBtn facebook"
                >
                  Sign in with Facebook
                </Button>
              )}
            />
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              autoLoad={false}
              onSuccess={responseGoogle}
              onFailure={responseGoogleFailed}
              className="signupBtn google"
              render={renderProps => (
                <Button
                  onClick={renderProps.onClick}
                  className="signupBtn google"
                >
                  Sign in with Google
                </Button>
              )}
            />
          </div>

          <div className="haveAccount">
            {"Don't have an account? "}
            <a href={PATHS.SIGNUP}>Create one here</a>
          </div>
        </div>
      </div>
    );
  }
}

Login.defaultProps = {
  loginError: null,
};

Login.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  loginRequest: PropTypes.func.isRequired,
  createToken: PropTypes.func.isRequired,
  createTokenWithWaterloo: PropTypes.func.isRequired,
  createTokenWithFacebook: PropTypes.func.isRequired,
  createTokenWithGoogle: PropTypes.func.isRequired,
  loginError: PropTypes.string,
};

const mapStateToProps = state => ({
  authenticated: state.login.session,
  loginError: state.login.loginError,
});

const mapDispatchToProps = dispatch => ({
  loginRequest: () => dispatch(sessionActions.loginRequest()),
  createToken: credentials => dispatch(sessionActions.createToken(credentials)),
  createTokenWithWaterloo: ticket => dispatch(sessionActions.createTokenWithWaterloo(ticket)),
  createTokenWithFacebook: token => dispatch(sessionActions.createTokenWithFacebook(token)),
  createTokenWithGoogle: token => dispatch(sessionActions.createTokenWithGoogle(token)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Login),
);
