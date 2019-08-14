import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, ControlLabel, Button,
} from 'react-bootstrap';
import RezModal from '../../components/Modal';

const MergeAccountModal = props => (
  <div>
    <FormGroup>
      <ControlLabel>
        Your
        {' '}
        {props.accountToMerge}
        {' '}
account is already linked with another account.
        Would you like to merge these two accounts?
      </ControlLabel>
      <Button
        className="highlight-btn"
        onClick={() => props.mergeAccountAndCloseModal()}
      >
        Yes
      </Button>
      <Button
        className="light-extended-btn"
        onClick={() => props.closeModal()}
      >
        No
      </Button>
    </FormGroup>
  </div>
);

MergeAccountModal.propTypes = {
  accountToMerge: PropTypes.string.isRequired,
  mergeAccountAndCloseModal: PropTypes.func.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default RezModal(MergeAccountModal);
