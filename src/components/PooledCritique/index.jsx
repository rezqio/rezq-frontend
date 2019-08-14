import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Prompt, Redirect } from 'react-router';
import {
  Alert,
  Button,
  FormControl,
  OverlayTrigger,
  Tooltip,
  Glyphicon,
  InputGroup,
} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import filter from 'lodash/filter';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import {
  fetchPooledCritique,
  savePooledCritique,
  updateSummary,
  commentViaPooledCritique,
  resetEditPooledCritique,
} from './actions/Pooledcritique';
import Pdf from '../Pdf/index';
import { PATHS, TAGS } from '../../constants';
import { getProfileLinkOrAnimal } from '../../utils/animals';
import ReportModal from '../ReportModal';

import '../resumeoverview.css';

class PooledCritique extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canShowAlert: false,
      preview: true,
      currentComment: '',
      showReportModal: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params; // eslint-disable-line react/prop-types
    if (id.length !== 36) {
      window.location.href = '/notfound';
    }
    const pool = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : '';
    this.props.fetchPooledCritique(id, pool);
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
    this.props.resetEditPooledCritique();
    window.onbeforeunload = undefined;
  }

  onSaveCritique(submit) {
    this.props.savePooledCritique(submit);
    this.setState({
      canShowAlert: true,
    });
    if (submit === false && (localStorage.getItem('feedbackSubmitted') === null
      || (localStorage.getItem('feedbackSubmitted') === 'false' && Math.random() < 0.3))) {
      this.openReportModal();
    }
  }

  setComment(comment) {
    this.setState({
      currentComment: comment,
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

  updateCommentsForCritique(critiqueId) {
    if (this.state.currentComment) {
      const pool = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : '';
      this.props.commentViaPooledCritique(critiqueId, this.state.currentComment, pool);
      this.setState({
        currentComment: '',
      });
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

  render() {
    const {
      pooledCritique, loading, error, saved, hasUnsavedChanges, annotationsEdited,
    } = this.props;
    if (loading === false && !pooledCritique) {
      return <Redirect to={PATHS.NOT_FOUND} />;
    }

    const readOnly = pooledCritique.submitted === true;
    const showUnsavedChangesPrompt = (hasUnsavedChanges || annotationsEdited) && saved === false;

    const resumeOwnerTooltip = (
      <Tooltip id="resume-owner-tooltip">
        This is the Resume Uploader.
      </Tooltip>
    );

    const resumeCritiquerTooltip = (
      <Tooltip id="resume-critiquer-tooltip">
        This is the Critiquer.
      </Tooltip>
    );

    return (
      <div className="section-body">
        <Prompt
          when={showUnsavedChangesPrompt}
          message="You have unsaved changes, are you sure you want to leave the page?"
        />
        <div className="section-centered">
          {this.props.loading ? (
            <div>Loading...</div>
          ) : (
            <div className="resume-container">
              <div className="resume-annotator">
                <Pdf
                  canWrite={!readOnly}
                  filePath={this.props.pooledCritique.resume.downloadUrl}
                  annotations={this.props.pooledCritique.annotations}
                />
              </div>
              <div className="resume-panel">
                <div className="resume-details-box">
                  <div className="resume-details-title">
                    Critique of
                    {' '}
                    {pooledCritique.resume.name}
                  </div>
                  <div className="resume-details-upload">
                    Uploaded by:&nbsp;
                    {getProfileLinkOrAnimal(pooledCritique.resume.uploader)}
                  </div>
                  <div className="resume-details-description">
                    <div>
                      {map(pooledCritique.resume.industries.split(','), industry => (
                        <Chip
                          className="chip selected"
                          color="primary"
                          label={TAGS[industry]}
                        />
                      ))
                    }
                    </div>
                    {
                      pooledCritique.resume.description.length > 0
                      && <p>{pooledCritique.resume.description}</p>
                    }
                  </div>
                  {pooledCritique.resume.notesForCritiquer && (
                    <div className="resume-critiques-container">
                      <div className="resume-critiques-header">Notes for Critiquer</div>
                      {pooledCritique.resume.notesForCritiquer}
                    </div>
                  )}
                </div>
                <p />
                {readOnly ? (
                  <div className="critiques-container">
                    <div className="resume-critiques-container">
                      <div className="resume-critiques-header">Comments</div>
                      <div className="resume-summary-panel">
                        <p>
                          <ReactMarkdown source={pooledCritique.summary} />
                        </p>
                      </div>
                    </div>
                    <div className="resume-critiques-container">
                      <div className="resume-critiques-header">Discussion</div>
                      <div className="resume-summary-panel">
                        <div>
                          {map(orderBy(filter(pooledCritique.pooledcritiquecommentSet, c => c), ['createdOn']), comment => (
                            <div>
                              <Divider />
                              <ExpansionPanelDetails className="comment-box">
                                <div className="comment-header">
                                  {comment.user
                                    ? (
                                      <div className="commenter">
                                        {(pooledCritique.resume.uploader
                                        && pooledCritique.resume.uploader.id === comment.user.id)
                                        && (
                                        <OverlayTrigger placement="bottom" overlay={resumeOwnerTooltip}>
                                          <div className="glyphicon glyphicon-star comments-resume-owner">
                                            {' '}
                                          </div>
                                        </OverlayTrigger>
                                        )
                                      }
                                        {(pooledCritique.critiquer
                                        && pooledCritique.critiquer.id === comment.user.id)
                                        && (
                                        <OverlayTrigger placement="bottom" overlay={resumeCritiquerTooltip}>
                                          <div className="glyphicon glyphicon-star comments-critique-owner">
                                            {' '}
                                          </div>
                                        </OverlayTrigger>
                                        )
                                      }
                                        {getProfileLinkOrAnimal(comment.user)}
                                      </div>
                                    )
                                    : (
                                      <div className="commenter">
                                        <i>unknown</i>
                                      </div>
                                    )
                                  }
                                  {moment(comment.createdOn).fromNow()}
                                </div>
                                <div className="comment">{comment.comment}</div>
                              </ExpansionPanelDetails>
                            </div>
                          ))}
                        </div>
                        <div>
                          <Divider />
                          <div className="add-comment-box">
                            <InputGroup>
                              <FormControl
                                maxLength="1024"
                                value={this.state.currentComment}
                                placeholder="Add a comment"
                                onChange={e => this.setComment(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    this.updateCommentsForCritique(pooledCritique.id);
                                  }
                                }}
                              />
                              <InputGroup.Button>
                                <Button
                                  onClick={() => this.updateCommentsForCritique(pooledCritique.id)}
                                >
                                  <Glyphicon glyph="send" />
                                </Button>
                              </InputGroup.Button>
                            </InputGroup>
                          </div>
                        </div>
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
                              value={pooledCritique.summary}
                              onChange={e => this.props.updateSummary(e.target.value)}
                            />
                          ) : (
                            <div
                              className="resume-critique-summary preview-container"
                              rows="10"
                            >
                              <p>
                                <ReactMarkdown source={pooledCritique.summary} />
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

PooledCritique.defaultProps = {
  error: null,
};

PooledCritique.propTypes = {
  fetchPooledCritique: PropTypes.func.isRequired,
  savePooledCritique: PropTypes.func.isRequired,
  pooledCritique: PropTypes.shape({
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
  commentViaPooledCritique: PropTypes.func.isRequired,
  resetEditPooledCritique: PropTypes.func.isRequired,
  annotationsEdited: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  pooledCritique: state.pooledcritique.pooledCritique,
  loading: state.pooledcritique.loading,
  error: state.pooledcritique.error,
  saved: state.pooledcritique.saved,
  hasUnsavedChanges: state.pooledcritique.hasUnsavedChanges,
  annotationsEdited: state.pdf.undoableAnnotations.annotationsEdited,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchPooledCritique,
    savePooledCritique,
    updateSummary,
    commentViaPooledCritique,
    resetEditPooledCritique,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PooledCritique);
