import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Alert,
  Button,
  Form,
  FormGroup,
  FormControl,
  HelpBlock,
} from 'react-bootstrap';
import {
  requestPasswordReset,
  resetRequestPasswordResetCompleted,
} from './actions/Forgotpassword';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      email: '',
      error: '',
    };
  }

  componentDidMount() {
    this.props.resetRequestPasswordResetCompleted();
  }

  onChange(event) {
    event.preventDefault();
    this.setState({
      email: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.resetRequestPasswordResetCompleted();
    this.setState({
      email: '',
      error: '',
    });
    if (!this.state.email) {
      this.setState({
        error: 'Please enter an email address.',
      });
      return;
    }
    this.props.requestPasswordReset(this.state.email);
  }

  render() {
    return (
      <div className="splash">
        <div className="signupContainer">
          <div className="signupHeader">Forgot your password?</div>
          <Form horizontal>
            <fieldset>
              <FormGroup controlId="formHorizontalEmail">
                <HelpBlock style={{ marginTop: '10px' }}>
                  {'Please enter the email address associated with your RezQ account. '}
                  {'We will email you instructions on how to reset your password.'}
                </HelpBlock>
                <FormControl
                  maxLength="254"
                  name="email"
                  type="email"
                  value={this.state.email}
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
                                Send Password Reset Link
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
                {this.props.requestPasswordResetCompleted && (
                <Alert className="alert" bsStyle="success">
                  {'Password reset link sent. '}
                  {'If you don\'t receive any emails, please contact support@rezq.io.'}
                </Alert>
                )}
              </FormGroup>
            </fieldset>
          </Form>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  requestPasswordReset: PropTypes.func.isRequired,
  resetRequestPasswordResetCompleted: PropTypes.func.isRequired,
  requestPasswordResetCompleted: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  requestPasswordResetCompleted: state.forgotpassword.requestPasswordResetCompleted,
});

const mapDispatchToProps = {
  requestPasswordReset,
  resetRequestPasswordResetCompleted,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
