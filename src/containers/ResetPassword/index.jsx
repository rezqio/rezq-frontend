import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormGroup,
  FormControl,
} from 'react-bootstrap';
import {
  resetPassword,
  resetPasswordLoad,
} from './actions/Resetpassword';
import '../signup.css';

class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      token: '',
      password: '',
      confirmPassword: '',
      error: '',
      emptyToken: false,
    };
  }

  componentDidMount() {
    const { search } = this.props.location; // eslint-disable-line react/prop-types
    const params = new URLSearchParams(search);
    const token = params.get('token');

    if (!token) {
      this.setState({
        emptyToken: true,
      });
      return;
    }

    this.setState({
      token,
    });

    this.props.resetPasswordLoad();
  }

  onChange(event) {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    const { token, password, confirmPassword } = this.state;

    event.preventDefault();
    this.props.resetPasswordLoad();
    if (!password) {
      this.setState({
        error: 'Please enter a new password.',
      });
      return;
    }
    if (password !== confirmPassword) {
      this.setState({
        error: 'Passwords do not match.',
      });
      return;
    }
    this.setState({
      password: '',
      confirmPassword: '',
      error: '',
    });
    this.props.resetPassword(token, password);
  }

  render() {
    return (
      <div className="splash splash-padded">
        {this.state.emptyToken
          ? <div>Your reset password link is invalid.</div>
          : (
            <div className="signupContainer">
              <div className="signupHeader">Reset your password</div>
              <Form horizontal>
                <fieldset>
                  <FormGroup controlId="formHorizontalPassword">
                    <ControlLabel style={{ marginLeft: '5px' }}>
                    New Password
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
                <fieldset>
                  <FormGroup controlId="formHorizontalConfirmPassword">
                    <ControlLabel style={{ marginLeft: '5px' }}>
                    Confirm New Password
                    </ControlLabel>
                    <FormControl
                      maxLength="128"
                      name="confirmPassword"
                      type="password"
                      value={this.state.confirmPassword}
                      onChange={this.onChange}
                    />
                  </FormGroup>
                </fieldset>

                <fieldset>
                  <FormGroup>
                    <Button
                      className="signupButton"
                      type="submit"
                      onClick={this.onSubmit}
                    >
                                Reset Password
                    </Button>
                  </FormGroup>
                </fieldset>

                <fieldset>
                  <FormGroup>
                    {this.state.error && (
                    <Alert className="alert" bsStyle="danger">
                      {this.state.error}
                    </Alert>
                    )}
                    {this.props.resetPasswordError && (
                    <Alert className="alert" bsStyle="danger">
                      {this.props.resetPasswordError}
                    </Alert>
                    )}
                    {this.props.resetPasswordSuccess && (
                    <Alert className="alert" bsStyle="success">
                                        Password reset successful.
                      {' '}
                      <a href="/login">Sign in here</a>
                    </Alert>
                    )}
                  </FormGroup>
                </fieldset>
              </Form>
            </div>
          )
        }
      </div>
    );
  }
}

ResetPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  resetPasswordLoad: PropTypes.func.isRequired,
  resetPasswordSuccess: PropTypes.bool.isRequired,
  resetPasswordError: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  resetPasswordSuccess: state.resetpassword.resetPasswordSuccess,
  resetPasswordError: state.resetpassword.resetPasswordError,
});

const mapDispatchToProps = {
  resetPassword,
  resetPasswordLoad,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
