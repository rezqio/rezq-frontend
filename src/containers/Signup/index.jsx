import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
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
import * as signupActions from './actions/signupActions';
import {
  FRONTEND_URI,
  UWATERLOO_CAS,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_VERSION,
  GOOGLE_CLIENT_ID,
} from '../../constants';
import '../signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);

    // TODO: Remove useless fields
    this.state = {
      email: '',
      password: '',
      confirmPassword: '',
    };
  }

  componentDidMount() {
    this.setTicket();
  }

  onSave(event) {
    this.props.createProfile(this.state);
    this.setState({
      password: '',
      confirmPassword: '',
    });
    event.preventDefault();
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  setTicket() {
    if (localStorage.getItem('token')) {
      return;
    }

    const { createProfileWithWaterloo } = this.props;
    const ticket = window.location.search;
    const isTicket = ticket.startsWith('?ticket');
    if (isTicket) {
      const ticketObject = { ticket: ticket.split('=')[1] };
      createProfileWithWaterloo(ticketObject);
    }
  }

  render() {
    if (localStorage.getItem('token') && this.props.isLoggedIn) {
      return <Redirect to="/resumes" />;
    }
    const {
      succ, fail, loading, errorMsg,
    } = this.props;

    const responseFacebook = (response) => {
      // TODO: propagate error to UI for user
      if (!response || !response.accessToken) {
        console.error('Error authenticating with Facebook.');
      }
      const { createProfileWithFacebook } = this.props;
      const accessToken = { token: response.accessToken };
      createProfileWithFacebook(accessToken);
    };

    const responseGoogle = (response) => {
      const { createProfileWithGoogle } = this.props;
      const accessToken = { token: response.tokenObj.id_token };
      createProfileWithGoogle(accessToken);
    };

    const responseGoogleFailed = (error) => {
      // TODO: propagate error to UI for user
      console.error(error);
    };

    return (
      <div className="splash splash-padded">
        <div className="signupContainer">
          <div className="signupHeader">Create Your Account</div>

          <Form horizontal>
            <fieldset disabled={succ}>
              <FormGroup controlId="formHorizontalEmail">
                <ControlLabel style={{ marginLeft: '5px' }}>Email</ControlLabel>
                <FormControl
                  maxLength="254"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                />
              </FormGroup>
            </fieldset>
            <fieldset disabled={succ}>
              <FormGroup controlId="formHorizontalPassword">
                <ControlLabel style={{ marginLeft: '5px' }}>
                  Password
                </ControlLabel>
                <FormControl
                  maxLength="128"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                />
              </FormGroup>
            </fieldset>
            <fieldset disabled={succ}>
              <FormGroup controlId="formHorizontalPassword">
                <ControlLabel style={{ marginLeft: '5px' }}>
                  Confirm Password
                </ControlLabel>
                <FormControl
                  maxLength="128"
                  name="confirmPassword"
                  type="password"
                  value={this.state.confirmPassword}
                  onChange={this.onChange}
                  autoComplete="nope"
                />
              </FormGroup>
            </fieldset>

            <fieldset disabled={succ || loading}>
              <FormGroup>
                {loading && (
                  <Alert className="alert" bsStyle="info">
                    {'Creating you a brand new RezQ account...'}
                  </Alert>
                )}
                {fail && (
                  <Alert className="alert" bsStyle="danger">
                    {errorMsg}
                  </Alert>
                )}
                {succ && (
                  <Alert className="alert" bsStyle="success">
                    {'Sign up successful! Signing in to your new RezQ account...'}
                  </Alert>
                )}
                <div className="termsOfUse">
                  {'By signing up, you agree to our '}
                  <a href="/terms">Terms of Use</a>
                  {' and that you have read our '}
                  <a href="/privacy">Privacy Policy</a>
                  {', including our use of cookies.'}
                </div>
                <Button
                  className="signupButton"
                  type="submit"
                  onClick={this.onSave}
                >
                  Create your RezQ Account
                </Button>
              </FormGroup>
            </fieldset>

          </Form>

          <div className="otherSignup">
            <div className="divider-horizontal" />
            <Button
              className="signupBtn uwaterloo"
              onClick={() => {
                window.location.assign(
                  `${UWATERLOO_CAS + FRONTEND_URI}/signup`,
                );
              }}
              disabled={succ || loading}
            >
              Sign up with UWaterloo CAS
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
                  disabled={succ || loading}
                >
                  Sign up with Facebook
                </Button>
              )}
            />
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              autoLoad={false}
              onSuccess={responseGoogle}
              onFailure={responseGoogleFailed}
              className="signupBtn signup--google"
              render={renderProps => (
                <Button
                  onClick={renderProps.onClick}
                  className="signupBtn google"
                  disabled={succ || loading}
                >
                  Sign up with Google
                </Button>
              )}
            />
          </div>

          <div className="haveAccount">
            {'Already have an account? '}
            <a href="/login">Sign in here</a>
          </div>
        </div>
      </div>
    );
  }
}

Signup.propTypes = {
  createProfile: PropTypes.func.isRequired,
  createProfileWithWaterloo: PropTypes.func.isRequired,
  createProfileWithFacebook: PropTypes.func.isRequired,
  createProfileWithGoogle: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  succ: PropTypes.bool.isRequired,
  fail: PropTypes.bool.isRequired,
  errorMsg: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  loading: state.signup.loading,
  succ: state.signup.succ,
  fail: state.signup.fail,
  errorMsg: state.signup.errorMsg,
  isLoggedIn: state.login.session,
});

const mapDispatchToProps = dispatch => ({
  createProfile: credentials => dispatch(signupActions.createProfile(credentials)),
  createProfileWithWaterloo: ticket => dispatch(signupActions.createProfileWithWaterloo(ticket)),
  createProfileWithFacebook: token => dispatch(signupActions.createProfileWithFacebook(token)),
  createProfileWithGoogle: token => dispatch(signupActions.createProfileWithGoogle(token)),
});

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Signup),
);
