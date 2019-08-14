import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import RezModal from '../../components/Modal';

class ChangePoolModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      poolToQuery: '',
    };
  }

  searchPools() {
    this.props.changePool(this.state.poolToQuery);
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>Secret Pool ID</ControlLabel>
          <FormControl
            type="text"
            maxLength="253"
            value={this.state.poolToQuery}
            onChange={e => this.setState({ poolToQuery: e.target.value })}
          />
          <Button
            className="highlight-btn"
            onClick={() => this.searchPools()}
          >
              Search
          </Button>
        </FormGroup>
      </div>
    );
  }
}

ChangePoolModal.propTypes = {
  changePool: PropTypes.func.isRequired,
};

export default RezModal(ChangePoolModal);
