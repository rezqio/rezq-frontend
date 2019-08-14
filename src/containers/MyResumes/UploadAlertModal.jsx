import React from 'react';
import {
  FormGroup, ControlLabel,
} from 'react-bootstrap';
import RezModal from '../../components/Modal';
import { MY_RESUME_LIMITS } from '../../constants';

const UploadAlertModal = () => (
  <div>
    <FormGroup>
      <ControlLabel>
          You currently have too many resumes uploaded
          (max
        {' '}
        {MY_RESUME_LIMITS.MAX_RESUMES}
          ).
      </ControlLabel>
      <ControlLabel>
          Please delete a resume before uploading another resume.
      </ControlLabel>
    </FormGroup>
  </div>
);

export default RezModal(UploadAlertModal);
