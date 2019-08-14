import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Alert, Button, FormGroup, FormControl, ControlLabel, Glyphicon,
} from 'react-bootstrap';
import map from 'lodash/map';
import RezModal from '../Modal';
import { reportPage, resetReportModal } from './actions/Reportmodal';
import './styles/reportmodal.css';

class ReportModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stars: 0,
      starHovered: null,
      message: '',
      replyTo: '',
    };
  }

  componentWillMount() {
    this.props.resetReportModal();
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel>
            {'How\'s your experience?'}
          </ControlLabel>
          <div className="stars">
            {map([...Array(5).keys()], i => (
              <Glyphicon
                // eslint-disable-next-line no-nested-ternary
                glyph={(this.state.starHovered === null) ? (
                  (i < this.state.stars) ? 'star' : 'star-empty'
                ) : (
                  (i < this.state.starHovered && i < this.state.stars) ? 'star' : 'star-empty'
                )}
                className={(i < (this.state.starHovered || this.state.stars)) ? 'starSelected' : 'starUnselected'}
                onMouseEnter={() => this.setState({ starHovered: i + 1 })}
                onMouseLeave={() => this.setState({ starHovered: null })}
                onClick={() => this.setState({ stars: i + 1 })}
                key={`star-${i}`}
              />
            ))}
          </div>
          <ControlLabel>
            {'What\'s up?'}
          </ControlLabel>
          <br />
          <textarea
            maxLength="1024"
            rows="4"
            value={this.state.message}
            placeholder="Describe your problem or suggestion"
            onChange={e => this.setState({
              message: e.target.value,
            })}
            className="message-box"
          />
          <br />
          <ControlLabel>
            {'Enter your email if you\'re interested in a follow-up'}
          </ControlLabel>
          <FormControl
            maxLength="254"
            type="email"
            value={this.state.replyTo}
            placeholder="Optional"
            onChange={e => this.setState({
              replyTo: e.target.value,
            })
            }
          />
          {this.props.reportError && (
            <Alert className="alert report-message" bsStyle="danger">
              {this.props.reportError}
            </Alert>
          )}
          {this.props.reportSuccess && (
            <Alert className="alert report-message" bsStyle="success">
              Thanks for letting us know!
            </Alert>
          )}
          <br />
          <Button
            className="highlight-btn"
            onClick={() => {
              this.props.reportPage(
                this.props.isLoggedIn,
                window.location.pathname,
                window.location.search,
                this.state.stars,
                this.state.message,
                this.state.replyTo,
              );
            }}
            disabled={this.props.reportSuccess}
          >
            Send Message
          </Button>
          <Button
            className="light-extended-btn"
            onClick={() => this.props.closeModal()}
          >
            {this.props.reportSuccess ? 'Close' : 'Never Mind'}
          </Button>
        </FormGroup>
      </div>
    );
  }
}

ReportModal.defaultProps = {
  reportSuccess: false,
  reportError: null,
};

ReportModal.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  reportSuccess: PropTypes.bool,
  reportError: PropTypes.string,
  closeModal: PropTypes.func.isRequired,
  reportPage: PropTypes.func.isRequired,
  resetReportModal: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.session,
  reportSuccess: state.reportmodal.reportSuccess,
  reportError: state.reportmodal.reportError,
});

const mapDispatchToProps = {
  reportPage,
  resetReportModal,
};

export default RezModal(connect(
  mapStateToProps,
  mapDispatchToProps,
)(ReportModal));
