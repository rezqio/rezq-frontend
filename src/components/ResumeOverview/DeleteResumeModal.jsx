import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, FormGroup, ControlLabel,
} from 'react-bootstrap';
import RezModal from '../Modal';

const DeleteResumeModal = props => (
  <div>
    <FormGroup>
      <ControlLabel>
        Your resume and associated critiques will be permanently deleted.
      </ControlLabel>
      <ControlLabel>
        Are you sure you want to do this?
      </ControlLabel>
      <Button
        className="highlight-btn"
        onClick={() => props.deleteResumeAndCloseModal()}
      >
        Delete Resume
      </Button>
      <Button
        className="light-extended-btn"
        onClick={() => props.closeModal()}
      >
        Never Mind
      </Button>
    </FormGroup>
  </div>
);

DeleteResumeModal.propTypes = {
  deleteResumeAndCloseModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default RezModal(DeleteResumeModal);
