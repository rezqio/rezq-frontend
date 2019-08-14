import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, FormGroup, ControlLabel,
} from 'react-bootstrap';
import RezModal from '../../components/Modal';

const DeleteResumesModal = props => (
  <div>
    <FormGroup>
      <ControlLabel>
        The selected resume(s) and associated critiques will be permanently deleted.
      </ControlLabel>
      <ControlLabel>
        Are you sure you want to do this?
      </ControlLabel>
      <Button
        className="highlight-btn"
        onClick={() => props.deleteResumesAndCloseModal()}
      >
        Delete Selected Resume(s)
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

DeleteResumesModal.propTypes = {
  deleteResumesAndCloseModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default RezModal(DeleteResumesModal);
