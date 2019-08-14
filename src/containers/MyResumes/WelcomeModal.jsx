import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, FormGroup, ControlLabel,
} from 'react-bootstrap';
import RezModal from '../../components/Modal';

const WelcomeModal = props => (
  <div>
    <FormGroup>
      <ControlLabel>
        We&#39;re glad you&#39;re joining our public beta test.
        Please keep in mind that during this period, your data may be wiped at any time.
        <br />
        <br />
        Please help us out by reporting any issues using the &#34;Give Feedback&#34; button
        located at the bottom right of the website.
        <br />
        <br />
        Subscribe to email notifications to know when someone submits a critique for your resume.
        <br />
      </ControlLabel>
      <Button
        className="highlight-btn"
        onClick={() => props.closeModal()}
      >
        I want my resume critiqued!
      </Button>
      <Button
        className="light-extended-btn"
        onClick={() => { window.location.href = '/pool'; }}
      >
        I want to critique resumes!
      </Button>
    </FormGroup>
  </div>
);

WelcomeModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};

export default RezModal(WelcomeModal);
