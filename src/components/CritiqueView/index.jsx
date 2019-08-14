import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt, Redirect } from 'react-router';
import { Alert, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Chip from '@material-ui/core/Chip';
import map from 'lodash/map';
import {
  fetchCritique,
  saveCritique,
  updateSummary,
  resetEditCritique,
} from './actions/Critiqueview';
import Pdf from '../Pdf/index';
import { PATHS, TAGS } from '../../constants';
import ReportModal from '../ReportModal';
import { getProfileLinkOrAnimal } from '../../utils/animals';

import '../resumeoverview.css';

class CritiqueView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canShowAlert: false,
      preview: true,
      showReportModal: false,
    };
  }

  componentWillMount() {
    this.props.fetchCritique(this.props.critiqueId);
  }

  componentDidUpdate() {
    const hasUnsavedChanges = (this.props.hasUnsavedChanges || this.props.annotationsEdited);
    const showUnsavedChangesPrompt = (hasUnsavedChanges && this.props.saved === false);
    if (showUnsavedChangesPrompt) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }
  }

  componentWillUnmount() {
    this.props.resetEditCritique();
    window.onbeforeunload = undefined;
  }

  onSaveCritique(submit) {
    this.props.saveCritique(submit);
    this.setState({
      canShowAlert: true,
    });
    if (submit === false && (localStorage.getItem('feedbackSubmitted') === null
      || (localStorage.getItem('feedbackSubmitted') === 'false' && Math.random() < 0.3))) {
      this.openReportModal();
    }
  }

  handleAlertDismiss() {
    this.setState({
      canShowAlert: false,
    });
  }

  togglePreview() {
    this.setState(prevState => ({
      preview: !prevState.preview,
    }));
  }

  openReportModal() {
    if (localStorage.getItem('feedbackSubmitted') === null) {
      localStorage.setItem('feedbackSubmitted', 'false');
    }
    this.setState({
      showReportModal: true,
    });
  }

  closeReportModal() {
    this.setState({
      showReportModal: false,
    });
  }

  render() {
    const {
      uploaderView, critique, loading, error, saved, hasUnsavedChanges, annotationsEdited,
    } = this.props;

    const showUnsavedChangesPrompt = (hasUnsavedChanges || annotationsEdited) && saved === false;

    if (loading === false && !critique) {
      return <Redirect to={PATHS.NOT_FOUND} />;
    }

    const readOnly = uploaderView || critique.submitted === true;

    return (
      <div className="section-body">
        <Prompt
          when={showUnsavedChangesPrompt}
          message="You have unsaved changes, are you sure you want to leave the page?"
        />
        <div className="section-centered">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="resume-container">
              <div className="resume-annotator">
                <Pdf
                  canWrite={!readOnly}
                  filePath={this.props.critique.resume.downloadUrl}
                  annotations={this.props.critique.annotations}
                />
              </div>
              <div className="resume-panel">
                <div className="resume-details-title">
                  Critique of
                  {' '}
                  {critique.resume.name}
                </div>
                <div className="resume-details-upload">
                  Uploaded by:&nbsp;
                  {getProfileLinkOrAnimal(critique.resume.uploader)}
                </div>
                <div className="resume-details-description">
                  <div>
                    {map(critique.resume.industries.split(','), industry => (
                      <Chip
                        className="chip selected"
                        color="primary"
                        label={TAGS[industry]}
                      />
                    ))
                  }
                  </div>
                  <p>{critique.resume.description}</p>
                </div>
                {critique.resume.notesForCritiquer && (
                  <div className="resume-critiques-container">
                    <div className="resume-critiques-header">Notes for Critiquer</div>
                    {critique.resume.notesForCritiquer}
                  </div>
                )}
                {readOnly ? (
                  <div>
                    <div className="resume-critiques-container">
                      <div className="resume-critiques-header">Comments</div>
                      <div className="resume-summary-panel">
                        <p>
                          <ReactMarkdown source={critique.summary} />
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <form>
                      <div className="resume-details-box">
                        <div className="resume-critiques-container">Comments</div>
                        {this.state.preview
                          ? (
                            <textarea
                              className="resume-critique-summary"
                              rows="10"
                              value={critique.summary}
                              onChange={e => this.props.updateSummary(e.target.value)}
                            />
                          ) : (
                            <div
                              className="resume-critique-summary preview-container"
                              rows="10"
                            >
                              <p>
                                <ReactMarkdown source={critique.summary} />
                              </p>
                            </div>
                          )
                        }
                        <div className="markdown-container">
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={() => this.togglePreview()}
                            onKeyDown={() => this.togglePreview()}
                          >
                            { this.state.preview
                              ? (<span>Preview</span>)
                              : (<span>Edit</span>)
                            }
                          </button>
                          <div className="markdown-note">
                            <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet" target="_blank" rel="noopener noreferrer">
                              Markdown Help
                            </a>
                          </div>
                        </div>
                      </div>
                    </form>
                    <div className="critique-action-box">
                      <Button
                        className="dark-btn"
                        onClick={() => this.onSaveCritique(false)}
                      >
                        Save
                      </Button>
                      <Button
                        className="dark-btn"
                        onClick={() => this.onSaveCritique(true)}
                      >
                        Submit
                      </Button>
                    </div>
                    {this.state.canShowAlert && (
                      <div className="resume-edit-alert">
                        {error && (
                          <Alert
                            className="alert"
                            bsStyle="danger"
                            onDismiss={() => this.handleAlertDismiss()}
                          >
                            {error}
                          </Alert>
                        )}
                        {saved && (
                          <Alert
                            className="alert"
                            bsStyle="success"
                            onDismiss={() => this.handleAlertDismiss()}
                          >
                            Your changes have been saved.
                          </Alert>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <ReportModal
            title="Give Feedback"
            showModal={this.state.showReportModal}
            closeModal={() => this.closeReportModal()}
          />
        </div>
      </div>
    );
  }
}

CritiqueView.defaultProps = {
  critiqueId: '',
  uploaderView: false,
  error: null,
};

CritiqueView.propTypes = {
  critiqueId: PropTypes.string,
  uploaderView: PropTypes.bool,
  fetchCritique: PropTypes.func.isRequired,
  saveCritique: PropTypes.func.isRequired,
  critique: PropTypes.shape({
    submitted: PropTypes.bool.isRequired,
    resume: PropTypes.shape({
      description: PropTypes.string.isRequired,
      downloadUrl: PropTypes.string.isRequired,
      notesForCritiquer: PropTypes.string.isRequired,
    }).isRequired,
    annotations: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
  }).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  saved: PropTypes.bool.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  updateSummary: PropTypes.func.isRequired,
  resetEditCritique: PropTypes.func.isRequired,
  annotationsEdited: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  critique: state.critique.critique,
  annotations: state.pdf.undoableAnnotations.present,
  loading: state.critique.loading,
  error: state.critique.error,
  saved: state.critique.saved,
  hasUnsavedChanges: state.critique.hasUnsavedChanges,
  annotationsEdited: state.pdf.undoableAnnotations.annotationsEdited,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchCritique,
    saveCritique,
    updateSummary,
    resetEditCritique,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CritiqueView);
