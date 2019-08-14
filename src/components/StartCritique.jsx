import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, FormGroup, ControlLabel,
} from 'react-bootstrap';
import RezModal from './Modal';
import IndustrySelector from './IndustrySelector';

class StartCritique extends Component {
  constructor(props) {
    super(props);

    this.state = {
      critiqueIndustries: props.industries,
      submitError: null,
    };
  }

  onSubmit() {
    if (this.state.critiqueIndustries.length === 0) {
      this.setState({
        submitError: 'You must enter at least one industry.',
      });
    } else { // change to conditional clause when we have more options
      this.setState({
        submitError: null,
      });
      this.props.submit(this.state);
    }
  }

  updateIndustries(industries) {
    this.setState({
      critiqueIndustries: industries,
    });
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>Industries</ControlLabel>
          <IndustrySelector
            selected={this.props.industries}
            onChange={industries => this.updateIndustries(industries)}
          />
        </FormGroup>
        {this.state.submitError && (
          <Alert className="alert" bsStyle="danger">
            {this.state.submitError}
          </Alert>
        )}
        <Button
          className="highlight-btn"
          onClick={() => this.onSubmit()}
        >
          {this.props.action}
        </Button>
      </div>
    );
  }
}

StartCritique.propTypes = {
  industries: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  action: PropTypes.string.isRequired,
};

export default RezModal(StartCritique);
