import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, FormGroup, ControlLabel,
} from 'react-bootstrap';
import RezModal from '../../components/Modal';

class DeleteProfile extends Component {
  onSubmit() {
    this.props.submit();
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>
            Are you sure you want to delete your account?
          </ControlLabel>
          <Button
            className="highlight-btn"
            disabled={this.props.isError || this.props.isSuccess}
            onClick={() => this.onSubmit()}
          >
            Delete Permanently
          </Button>
          <p>{' '}</p>
          {this.props.isError && (
            <Alert className="alert" bsStyle="danger">
              Oops, something went wrong when deleting your account.
              Try to log in again. If you cannot, then the delete was successful.
              Closing this popup will redirect you to the login page.
            </Alert>
          )}
          {this.props.isSuccess && (
            <Alert className="alert" bsStyle="success">
              Your account was successfully deleted.
              Closing this popup will redirect you to the landing page.
            </Alert>
          )}
        </FormGroup>
      </div>
    );
  }
}

DeleteProfile.propTypes = {
  submit: PropTypes.func.isRequired,
  isError: PropTypes.bool.isRequired,
  isSuccess: PropTypes.bool.isRequired,
};

export default RezModal(DeleteProfile);
