import React from 'react';
import PropTypes from 'prop-types';
import {
  FormGroup, Button, FormControl, Glyphicon, ControlLabel, InputGroup,
} from 'react-bootstrap';
import RezModal from '../Modal';

const { FRONTEND_URI } = process.env;


class SharedCritiqueUrlModal extends React.Component {
  constructor(props) {
    super(props);
    this.sharedCritiqueUrl = React.createRef();
  }

  copyToClipboard() {
    this.sharedCritiqueUrl.select();
    document.execCommand('copy');
  }

  selectLink() {
    this.sharedCritiqueUrl.select();
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>
            You can always revisit this critique using the link below.
          </ControlLabel>
          <InputGroup>
            <FormControl
              readOnly
              type="text"
              inputRef={(ref) => { this.sharedCritiqueUrl = ref; }}
              onClick={() => this.selectLink()}
              value={`${FRONTEND_URI}/shared-critique/${this.props.critiqueToken}`}
            />
            <InputGroup.Button>
              <Button
                onClick={() => this.copyToClipboard()}
              >
                <Glyphicon glyph="copy" />
              </Button>
            </InputGroup.Button>
          </InputGroup>
          <Button
            className="highlight-btn"
            type="button"
            onClick={() => this.props.closeModal()}
          >
            Ok
          </Button>
        </FormGroup>
      </div>
    );
  }
}

SharedCritiqueUrlModal.propTypes = {
  critiqueToken: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default RezModal(SharedCritiqueUrlModal);
