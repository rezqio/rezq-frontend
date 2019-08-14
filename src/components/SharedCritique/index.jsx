import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt, Redirect } from 'react-router';
import {
  Alert, Button, Glyphicon, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Chip from '@material-ui/core/Chip';
import map from 'lodash/map';
import {
  fetchLinkedCritique,
  saveLinkedCritique,
  updateSummary,
  resetEditLinkedCritique,
} from './actions/SharedCritique';
import Pdf from '../Pdf/index';
import { PATHS, TAGS } from '../../constants';
import SharedCritiqueUrlModal from './SharedCritiqueUrlModal';
import '../resumeoverview.css';
import ReportModal from '../ReportModal';
import { getProfileLinkOrAnimal } from '../../utils/animals';

const { FRONTEND_URI } = process.env;

class SharedCritique extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canShowAlert: false,
      preview: true,
      showSharedCritiqueUrlModal: false,
      showReportModal: false,
    };
  }

  componentWillMount() {
    const { critiqueToken } = this.props.match.params; // eslint-disable-line react/prop-types
    this.props.fetchLinkedCritique(critiqueToken);
    this.setState({
      showSharedCritiqueUrlModal: this.props.linkedCritiqueCreated,
    });
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
    this.props.resetEditLinkedCritique();
    window.onbeforeunload = undefined;
  }

  onSaveCritique(submit) {
    const { isLoggedIn } = this.props;
    this.props.saveLinkedCritique(isLoggedIn, submit);
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

  closeSharedCritiqueUrlModal() {
    this.setState({
      showSharedCritiqueUrlModal: false,
    });
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

  copyToClipboard() {
    this.sharedCritiqueUrl.select();
    document.execCommand('copy');
  }

  selectLink() {
    this.sharedCritiqueUrl.select();
  }

  togglePreview() {
    this.setState(prevState => ({
      preview: !prevState.preview,
    }));
  }

  render() {
    const {
      uploaderView, linkedCritique, loading, error, saved,
      hasUnsavedChanges, annotationsEdited,
    } = this.props;

    const showUnsavedChangesPrompt = (hasUnsavedChanges || annotationsEdited) && saved === false;

    if (loading === false && !linkedCritique) {
      return <Redirect to={PATHS.NOT_FOUND} />;
    }

    const readOnly = uploaderView || linkedCritique.submitted === true;

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
                  filePath={this.props.linkedCritique.resume.downloadUrl}
                  annotations={this.props.linkedCritique.annotations}
                />
              </div>
              <div className="resume-panel">
                <div className="resume-details-box">
                  <div className="resume-details-title">
                    Critique of
                    {' '}
                    {linkedCritique.resume.name}
                  </div>
                  <div className="resume-details-upload">
                    Uploaded by:&nbsp;
                    {getProfileLinkOrAnimal(linkedCritique.resume.uploader)}
                  </div>
                  <div className="resume-details-description">
                    <div>
                      {map(linkedCritique.resume.industries.split(','), industry => (
                        <Chip
                          className="chip selected"
                          color="primary"
                          label={TAGS[industry]}
                        />
                      ))
                    }
                    </div>
                    <p>{linkedCritique.resume.description}</p>
                  </div>
                </div>
                {linkedCritique.resume.notesForCritiquer && (
                  <div className="resume-critiques-container">
                    <div className="resume-critiques-header">Notes for Critiquer</div>
                    {linkedCritique.resume.notesForCritiquer}
                  </div>
                )}
                {readOnly ? (
                  <div className="critiques-container">
                    <div className="resume-critiques-container">
                      <div className="resume-critiques-header">Comments</div>
                      <div className="resume-summary-panel">
                        <p>
                          <ReactMarkdown source={linkedCritique.summary} />
                        </p>
                      </div>
                    </div>
                    <div className="resume-critiques-container">
                      <div className="resume-critiques-header">
                        Share
                      </div>
                      <div className="resume-summary-panel">
                        <ControlLabel>
                          Give this link to someone you want to see this critique!
                        </ControlLabel>
                        <FormGroup>
                          <FormControl
                            readOnly
                            type="text"
                            inputRef={(ref) => { this.sharedCritiqueUrl = ref; }}
                            onClick={() => this.selectLink()}
                            value={`${FRONTEND_URI}/shared-critique/${linkedCritique.token}`}
                          />
                          {document.queryCommandSupported('copy') && (
                            <Button
                              className="resume-copy"
                              onClick={() => this.copyToClipboard()}
                            >
                              <Glyphicon glyph="copy" />
                            </Button>
                          )}
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <form>
                      <div className="resume-critiques-container">
                        <div className="resume-critiques-header">Comments</div>
                        {this.state.preview
                          ? (
                            <textarea
                              className="resume-critique-summary"
                              rows="10"
                              value={linkedCritique.summary}
                              onChange={e => this.props.updateSummary(e.target.value)}
                            />
                          ) : (
                            <div
                              className="resume-critique-summary preview-container"
                              rows="10"
                            >
                              <p>
                                <ReactMarkdown source={linkedCritique.summary} />
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
              <SharedCritiqueUrlModal
                title="New Critique Created"
                critiqueToken={linkedCritique.token}
                closeModal={() => this.closeSharedCritiqueUrlModal()}
                showModal={this.state.showSharedCritiqueUrlModal}
              />
              <ReportModal
                title="Give Feedback"
                showModal={this.state.showReportModal}
                closeModal={() => this.closeReportModal()}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

SharedCritique.defaultProps = {
  critiqueToken: '',
  uploaderView: false,
  error: null,
  linkedCritiqueCreated: false,
};

SharedCritique.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  critiqueToken: PropTypes.string,
  uploaderView: PropTypes.bool,
  fetchLinkedCritique: PropTypes.func.isRequired,
  saveLinkedCritique: PropTypes.func.isRequired,
  linkedCritique: PropTypes.shape({
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
  resetEditLinkedCritique: PropTypes.func.isRequired,
  annotationsEdited: PropTypes.bool.isRequired,
  linkedCritiqueCreated: PropTypes.bool,
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.session,
  linkedCritique: state.sharedcritique.linkedCritique,
  annotations: state.pdf.undoableAnnotations.present,
  loading: state.sharedcritique.loading,
  error: state.sharedcritique.error,
  saved: state.sharedcritique.saved,
  hasUnsavedChanges: state.sharedcritique.hasUnsavedChanges,
  annotationsEdited: state.pdf.undoableAnnotations.annotationsEdited,
  linkedCritiqueCreated: state.sharedresume.linkedCritiqueCreated,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchLinkedCritique,
    saveLinkedCritique,
    updateSummary,
    resetEditLinkedCritique,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SharedCritique);
