import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import RezModal from '../Modal';
import IndustrySelector from '../IndustrySelector';

class EditResumeModal extends Component {
  constructor(props) {
    super(props);

    // set state from props directly
    this.state = {
      newResumeName: props.currentResumeName,
      newResumeDescription: props.currentResumeDescription,
      newResumeIndustries: props.currentResumeIndustries,
    };
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>Resume Name</ControlLabel>
          <FormControl
            type="text"
            maxLength="32"
            value={this.state.newResumeName}
            onChange={e => this.setState({
              newResumeName: e.target.value,
            })
            }
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            type="text"
            maxLength="256"
            value={this.state.newResumeDescription}
            onChange={e => this.setState({
              newResumeDescription: e.target.value,
            })
            }
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Industries</ControlLabel>
          <IndustrySelector
            selected={this.state.newResumeIndustries}
            onChange={industries => this.setState({
              newResumeIndustries: industries,
            })
            }
          />
        </FormGroup>
        <Button
          className="highlight-btn"
          onClick={() => {
            this.props.submit(this.state);
          }}
        >
          Submit Changes
        </Button>
      </div>
    );
  }
}

EditResumeModal.propTypes = {
  submit: PropTypes.func.isRequired,
  currentResumeName: PropTypes.string.isRequired,
  currentResumeDescription: PropTypes.string.isRequired,
  currentResumeIndustries: PropTypes.string.isRequired,
};

export default RezModal(EditResumeModal);
