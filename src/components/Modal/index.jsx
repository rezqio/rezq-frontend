import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import './modal.css';

const RezModal = (WrappedComponent) => {
  const WrappedModal = (props) => {
    const inner = (
      <div className="modalWrapper">
        <Modal.Header closeButton bsClass="modalHeader">
          <Modal.Title bsClass="modalTitle">{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modalBody">
          <WrappedComponent {...props} />
        </Modal.Body>
      </div>
    );
    return (props.bsSize) ? (
      <Modal
        show={props.showModal}
        onHide={() => props.closeModal()}
        dialogClassName={props.rezModalClass}
        bsSize={props.bsSize}
      >
        {inner}
      </Modal>
    ) : (
      <Modal
        show={props.showModal}
        onHide={() => props.closeModal()}
        dialogClassName={props.rezModalClass}
      >
        {inner}
      </Modal>
    );
  };

  WrappedModal.defaultProps = {
    rezModalClass: '',
    bsSize: null,
  };

  WrappedModal.propTypes = {
    showModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    rezModalClass: PropTypes.string,
    bsSize: PropTypes.string,
    title: PropTypes.string.isRequired,
  };
  return WrappedModal;
};

export default RezModal;
