import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Glyphicon } from 'react-bootstrap';
import {
  fetchCurrentCritique,
  checkIsCritiquerRequestQueued,
  startCritique,
  cancelCritiqueRequest,
  fetchProfileIndustries,
} from './actions/Currentcritique';
import StartCritiqueModal from '../StartCritique';

import './styles/currentcritique.css';

class CurrentCritique extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showStartCritiqueModal: false,
    };
  }

  componentDidMount() {
    this.props.fetchCurrentCritique();
    this.props.fetchProfileIndustries();
    this.props.checkIsCritiquerRequestQueued();
  }

  onStartCritique(modalState) {
    this.props.startCritique(modalState.critiqueIndustries);
    this.closeStartCritiqueModal();
  }

  openStartCritiqueModal() {
    this.setState({
      showStartCritiqueModal: true,
    });
  }

  closeStartCritiqueModal() {
    this.setState({
      showStartCritiqueModal: false,
    });
  }

  render() {
    const { loading, currentCritique, isCritiquerRequestQueued } = this.props;

    return (
      <div className="section-body">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="action-box">
            {currentCritique ? (
              <div>
                <div className="action-message">
                  You currently have a critique in progress.
                </div>
                <Button
                  className="light-btn"
                  href={`/critiques/${currentCritique}`}
                >
                  <Glyphicon glyph="arrow-right" />
                  {' '}
                  Continue Critiquing
                </Button>
              </div>
            ) : (
              <div>
                {isCritiquerRequestQueued ? (
                  <div>
                    <div className="action-message">
                      Hang tight while we match you to a resume.
                    </div>
                    <Button
                      className="light-btn"
                      onClick={() => this.props.cancelCritiqueRequest()}
                    >
                      <Glyphicon glyph="exclamation-sign" />
                      {' '}
                      Cancel Request
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="action-message">
                      You have no critiques in progress.
                    </div>
                    <Button
                      className="light-btn"
                      onClick={() => this.openStartCritiqueModal()}
                    >
                      <Glyphicon glyph="pencil" />
                      {' '}
                      Start a Critique
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <StartCritiqueModal
          title="Start a Critique"
          action="Start"
          submit={state => this.onStartCritique(state)}
          showModal={this.state.showStartCritiqueModal}
          closeModal={() => this.closeStartCritiqueModal()}
          industries={this.props.profileIndustries}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  loading: state.currentcritique.loading,
  currentCritique: state.currentcritique.currentCritique,
  profileIndustries: state.currentcritique.profileIndustries,
  isCritiquerRequestQueued: state.currentcritique.isCritiquerRequestQueued,
});

const mapDispatchToProps = {
  fetchCurrentCritique,
  checkIsCritiquerRequestQueued,
  startCritique,
  fetchProfileIndustries,
  cancelCritiqueRequest,
};

CurrentCritique.propTypes = {
  fetchCurrentCritique: PropTypes.func.isRequired,
  checkIsCritiquerRequestQueued: PropTypes.func.isRequired,
  startCritique: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  currentCritique: PropTypes.string.isRequired,
  fetchProfileIndustries: PropTypes.func.isRequired,
  profileIndustries: PropTypes.string.isRequired,
  cancelCritiqueRequest: PropTypes.func.isRequired,
  isCritiquerRequestQueued: PropTypes.bool.isRequired,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CurrentCritique),
);
