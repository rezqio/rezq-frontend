import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import {
  Alert,
  Button,
  FormControl,
  Glyphicon,
  OverlayTrigger,
  Tooltip,
  InputGroup,
} from 'react-bootstrap';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import map from 'lodash/map';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import Pdf from '../Pdf/index';
import ShareResumeModal from './ShareResumeModal';
import ReportModal from '../ReportModal';
import {
  PATHS, TAGS, CRITIQUE_TYPES,
} from '../../constants';
import DeleteResumeModal from './DeleteResumeModal';
import EditResumeModal from './EditResumeModal';
import {
  fetchResume,
  requestCritique,
  updateNotes,
  enableLinkSharing,
  editPool,
  deleteResume,
  editResume,
  cancelCritiqueRequest,
  commentViaResumeOverview,
  voteViaResumeOverview,
  fetchProfileInstitutionsViaResumeOverview,
  clearPoolError,
} from './actions/Resumeoverview';
import { getProfileLinkOrAnimal } from '../../utils/animals';

import '../resumeoverview.css';

class ResumeOverview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteResumeModal: false,
      showEditResumeModal: false,
      showShareResumeModal: false,
      showReportModal: false,
      annotations: '',
      expandedMatched: -1,
      expandedPooled: -1,
      expandedLinked: -1,
      currentComment: '',
      canShowAlert: false,
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params; // eslint-disable-line react/prop-types
    if (id.length !== 36) {
      window.location.href = '/notfound';
    }
    this.props.fetchResume(id);
    this.props.fetchProfileInstitutionsViaResumeOverview();
  }

  onResumeEdit(modelState) {
    // Only send the mutation if user has actually changed anything
    if (this.props.resume.name !== modelState.newResumeName
      || this.props.resume.description !== modelState.newResumeDescription
      || this.props.resume.industries !== modelState.newResumeIndustries) {
      this.props.editResume(
        this.props.resume.id,
        modelState.newResumeName,
        modelState.newResumeDescription,
        modelState.newResumeIndustries,
      );
      // TODO: These's a small race condition of the error flashing here
      // But who cares...
      this.setState({
        canShowAlert: true,
      });
    }

    this.closeEditResumeModal();
  }

  onCritiqueRowClick(annotations, submitted, index, critiqueType) {
    if (!submitted) return;
    switch (critiqueType) {
      case CRITIQUE_TYPES.MATCHED:
        if (this.state.expandedMatched === index) {
          this.setState({
            annotations: '',
            expandedMatched: -1,
          });
        } else {
          this.setState({
            annotations,
            expandedMatched: index,
          });
        }
        break;
      case CRITIQUE_TYPES.POOLED:
        if (this.state.expandedPooled === index) {
          this.setState({
            annotations: '',
            expandedPooled: -1,
          });
        } else {
          this.setState({
            annotations,
            expandedPooled: index,
          });
        }
        break;
      case CRITIQUE_TYPES.LINKED:
        if (this.state.expandedLinked === index) {
          this.setState({
            annotations: '',
            expandedLinked: -1,
          });
        } else {
          this.setState({
            annotations,
            expandedLinked: index,
          });
        }
        break;
      default:
    }
    this.setState({
      currentComment: '',
    });
  }

  onRequestCritique(resumeId) {
    // validate input
    this.props.requestCritique(resumeId);

    this.closeShareResumeModal();
  }

  onUpvoteClicked(id, userVotedMap) {
    // User is upvoting but they previously upvoted - clear it
    if (userVotedMap[id] === true) {
      this.props.voteViaResumeOverview(id, null);
      return;
    }
    this.props.voteViaResumeOverview(id, true);
  }

  onDownvoteClicked(id, userVotedMap) {
    // User is downvoting but they previously downvoted - clear it
    if (userVotedMap[id] === false) {
      this.props.voteViaResumeOverview(id, null);
      return;
    }
    this.props.voteViaResumeOverview(id, false);
  }

  getRequestedId() {
    const critiques = this.props.resume.matchedcritiqueSet;

    if (!critiques) {
      return '';
    }

    for (let i = 0; i < critiques.length; i += 1) {
      const critique = Object.values(critiques)[i];
      if (!critique.submitted) {
        return critique.id;
      }
    }
    return '';
  }

  setComment(comment) {
    this.setState({
      currentComment: comment,
    });
  }

  handleAlertDismiss() {
    this.setState({
      canShowAlert: false,
    });
  }

  updateCommentsForCritique(critiqueId) {
    if (this.state.currentComment) {
      this.props.commentViaResumeOverview(critiqueId, this.state.currentComment);
      this.setState({
        currentComment: '',
      });
    }
  }

  enableLinkSharing() {
    this.props.enableLinkSharing(
      this.props.resume.id,
      true,
    );
  }

  disableLinkSharing() {
    this.props.enableLinkSharing(
      this.props.resume.id,
      false,
    );
  }

  updateNotes(notes) {
    this.props.updateNotes(
      this.props.resume.id,
      notes,
    );
  }

  editPool(pool, poolIsInstitution) {
    this.props.editPool(
      this.props.resume.id,
      pool,
      poolIsInstitution,
    );
  }

  cancelRequest(id) {
    this.props.cancelCritiqueRequest(id, this.props.resume.id);
  }

  openShareResumeModal() {
    this.setState({
      showShareResumeModal: true,
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

  closeShareResumeModal() {
    this.setState({
      showShareResumeModal: false,
    });
    if (localStorage.getItem('feedbackSubmitted') === null
      || (localStorage.getItem('feedbackSubmitted') === 'false' && Math.random() < 0.3)) {
      this.openReportModal();
    }
  }

  openDeleteResumeModal() {
    this.setState({
      showDeleteResumeModal: true,
    });
  }

  deleteResumeAndCloseModal() {
    const resumeId = this.props.resume.id;
    this.props.deleteResume(resumeId);

    this.setState({
      showDeleteResumeModal: false,
    });
  }

  closeDeleteResumeModal() {
    this.setState({
      showDeleteResumeModal: false,
    });
  }

  openEditResumeModal() {
    this.setState({
      showEditResumeModal: true,
    });
  }

  closeEditResumeModal() {
    this.setState({
      showEditResumeModal: false,
    });
  }

  renderCritiqueSection(critiqueType, critiqueSet, resumeUploader, resumeId, userUpvoted) {
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

    if (!critiqueSet || critiqueSet.length === 0) return null;
    let expanded;
    let header;
    switch (critiqueType) {
      case CRITIQUE_TYPES.MATCHED:
        expanded = this.state.expandedMatched;
        header = 'Matched Critiques';
        break;
      case CRITIQUE_TYPES.POOLED:
        expanded = this.state.expandedPooled;
        header = 'Pooled Critiques';
        break;
      case CRITIQUE_TYPES.LINKED:
        expanded = this.state.expandedLinked;
        header = 'Linked Critiques';
        break;
      default:
        expanded = -1;
        header = '';
    }
    return (
      <div>
        <div className="resume-critiques-header">{header}</div>
        <div className="resume-critiques-list">
          {map(critiqueSet, (critique, index) => (
            <ExpansionPanel
              expanded={expanded === index}
              onChange={() => this.onCritiqueRowClick(
                critique.annotations,
                critique.submitted,
                index,
                critiqueType,
              )}
            >
              <ExpansionPanelSummary
                expandIcon={critique.submitted ? <ExpandMoreIcon /> : null}
              >
                {critiqueType === CRITIQUE_TYPES.POOLED
                  && critique.submitted
                  && this.state.expandedPooled !== index
                  && (
                    <div className="resume-critique-upvote-card">
                      {critique.upvotes > 0 && '+'}
                      {critique.upvotes}
                    </div>
                  )
              }
                {critique.submitted
                  ? (
                    <div className={expanded === index ? '' : 'resume-critique-card'}>
                      {moment(critique.submittedOn).format('MMMM D [at] h:mm a')}
                    </div>
                  )
                  : (
                    <div className={expanded === index ? '' : 'resume-critique-card'}>
                      This critique is in progress
                    </div>
                  )
            }
              </ExpansionPanelSummary>
              {critique.critiquer
                && (
                <ExpansionPanelDetails>
                  Critiqued by:&nbsp;
                  {getProfileLinkOrAnimal(critique.critiquer)}
                </ExpansionPanelDetails>
                )
              }
              <ExpansionPanelDetails>
                <div className="critique"><ReactMarkdown source={critique.summary} /></div>
              </ExpansionPanelDetails>
              {critiqueType === CRITIQUE_TYPES.POOLED && (
              <div>
                <ExpansionPanelDetails>
                  <span className={(userUpvoted[critique.id] === true) ? 'upvote' : 'novote'}>
                    <Button
                      value
                      className="btn btn-link glyphicon glyphicon-arrow-up"
                      data-toggle
                      onClick={() => this.onUpvoteClicked(
                        critique.id,
                        userUpvoted,
                      )}
                    />
                  </span>
                  <span className="vote-container">
                    {critique.upvotes}
                  </span>
                  <span className={(userUpvoted[critique.id] === false) ? 'downvote' : 'novote'}>
                    <Button
                      value={false}
                      className="btn btn-link glyphicon glyphicon-arrow-down"
                      data-toggle={false}
                      onClick={() => this.onDownvoteClicked(
                        critique.id,
                        userUpvoted,
                      )}
                    />
                  </span>
                </ExpansionPanelDetails>
                <div>
                  {map(orderBy(critique.pooledcritiquecommentSet, ['createdOn']), comment => (
                    <div>
                      <Divider />
                      <ExpansionPanelDetails className="comment-box">
                        <div className="comment-header">
                          {comment.user ? (
                            <div className="commenter">
                              {(resumeUploader && resumeUploader.id === comment.user.id)
                              && (
                              <OverlayTrigger placement="bottom" overlay={resumeOwnerTooltip}>
                                <div className="glyphicon glyphicon-star comments-resume-owner">
                                  {' '}
                                </div>
                              </OverlayTrigger>
                              )
                            }
                              {(critique.critiquer
                              && critique.critiquer.id === comment.user.id)
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
                            )}
                          {moment(comment.createdOn).fromNow()}
                        </div>
                        <div className="comment">{comment.comment}</div>
                      </ExpansionPanelDetails>
                    </div>
                  ))}
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
                              this.updateCommentsForCritique(critique.id);
                            }
                          }}
                        />
                        <InputGroup.Button>
                          <Button
                            onClick={() => this.updateCommentsForCritique(critique.id)}
                          >
                            <Glyphicon glyph="send" />
                          </Button>
                        </InputGroup.Button>
                      </InputGroup>
                    </div>
                  </div>
                </div>
              </div>
              )}
            </ExpansionPanel>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const {
      resume, loading, resumeToken, editResumeError, institutions, poolChangeError,
    } = this.props;

    if (loading === false && !resume) {
      return <Redirect to={PATHS.NOT_FOUND} />;
    }

    let linkedCritiques = [];
    let pooledCritiques = [];

    if (resume) {
      linkedCritiques = filter(resume.linkedcritiqueSet, c => c.submitted === true);
      pooledCritiques = resume.pooledcritiqueSet;
    }

    const userUpvoted = (resume && resume.pooledCritiquesUserUpvoted)
      ? resume.pooledCritiquesUserUpvoted
      : {};

    const showFirstDivider = resume
    && (resume.matchedcritiqueSet && resume.matchedcritiqueSet.length > 0)
    && (pooledCritiques.length > 0 || linkedCritiques.length > 0);

    const showSecondDivider = resume
    && linkedCritiques.length > 0
    && pooledCritiques.length > 0;

    return (
      <div className="section-body">
        <div className="section-centered">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="resume-container">
              <Pdf
                canWrite={false}
                filePath={resume.downloadUrl}
                annotations={this.state.annotations}
              />
              <div className="resume-panel">
                <div className="resume-details-box">
                  <div className="resume-details-title">
                    {resume.name}
                  </div>
                  <div className="resume-details-description">
                    <div>
                      {map(resume.industries.split(','), industry => (
                        <Chip
                          className="chip selected"
                          color="primary"
                          label={TAGS[industry]}
                        />
                      ))
                    }
                    </div>
                    {resume.description.length > 0 && <p>{resume.description}</p>}
                    <div className="resume-action-box">
                      <Button
                        className="light-btn"
                        onClick={() => window.open(resume.downloadUrl)}
                      >
                        <Glyphicon glyph="download" />
                        {' '}
                        Download
                      </Button>
                      <Button
                        className="light-btn"
                        onClick={() => this.openDeleteResumeModal()}
                      >
                        <Glyphicon glyph="trash" />
                        {' '}
                        Delete
                      </Button>
                      <Button
                        className="light-btn"
                        onClick={() => this.openEditResumeModal()}
                      >
                        <Glyphicon glyph="pencil" />
                        {' '}
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>

                {this.state.canShowAlert && editResumeError && (
                  <Alert
                    className="alert"
                    bsStyle="danger"
                    onDismiss={() => this.handleAlertDismiss()}
                  >
                    {editResumeError}
                  </Alert>
                )}

                <div className="resume-action-box">
                  <Button
                    className="highlight-btn"
                    onClick={() => this.openShareResumeModal()}
                  >
                    Get Critiqued
                  </Button>
                </div>

                {this.props.pdfLoaded
                && (
                <div className="resume-critiques-container">
                  {(!resume.matchedCritiqueSet || resume.matchedcritiqueSet.length === 0)
                    && linkedCritiques.length === 0
                    && pooledCritiques.length === 0
                    && (
                    <div>
                      <div className="resume-critiques-header">Critiques</div>
                      <div className="no-content-description">You currently do not have any critiques.</div>
                    </div>
                    )
                  }
                  {this.renderCritiqueSection(
                    CRITIQUE_TYPES.MATCHED,
                    resume.matchedcritiqueSet,
                    resume.uploader,
                    resume.id,
                    userUpvoted,
                  )}
                  {showFirstDivider
                  && <Divider className="resume-critique-divider" />
                }
                  {this.renderCritiqueSection(
                    CRITIQUE_TYPES.POOLED,
                    pooledCritiques,
                    resume.uploader,
                    resume.id,
                    userUpvoted,
                  )}
                  {showSecondDivider
                    && <Divider className="resume-critique-divider" />
                  }
                  {this.renderCritiqueSection(
                    CRITIQUE_TYPES.LINKED,
                    linkedCritiques,
                    resume.uploader,
                    resume.id,
                    userUpvoted,
                  )}
                </div>
                )}
              </div>

              <ShareResumeModal
                title="Get Your Resume Critiqued"
                resumeToken={resumeToken}
                notesForCritiquer={resume.notesForCritiquer}
                isLinkSharingEnabled={resume.linkEnabled}
                pool={resume.pool ? resume.pool.id : ''}
                institutions={institutions}
                updateNotes={notes => this.updateNotes(notes)}
                enableLinkSharing={() => this.enableLinkSharing()}
                disableLinkSharing={() => this.disableLinkSharing()}
                editPool={(pool, poolIsInstitution) => this.editPool(pool, poolIsInstitution)}
                poolChangeError={poolChangeError}
                clearPoolChangeError={() => this.props.clearPoolError()}
                showModal={this.state.showShareResumeModal}
                closeModal={() => this.closeShareResumeModal()}
              />

              <DeleteResumeModal
                title="Confirmation"
                showModal={this.state.showDeleteResumeModal}
                closeModal={() => this.closeDeleteResumeModal()}
                deleteResumeAndCloseModal={() => this.deleteResumeAndCloseModal()}
              />

              <EditResumeModal
                title="Edit Resume"
                showModal={this.state.showEditResumeModal}
                closeModal={() => this.closeEditResumeModal()}
                submit={state => this.onResumeEdit(state)}
                currentResumeName={resume.name}
                currentResumeDescription={resume.description}
                currentResumeIndustries={resume.industries}
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

ResumeOverview.defaultProps = {
  resume: null,
  resumeToken: null,
  editResumeError: null,
  poolChangeError: null,
};

ResumeOverview.propTypes = {
  fetchResume: PropTypes.func.isRequired,
  requestCritique: PropTypes.func.isRequired,
  updateNotes: PropTypes.func.isRequired,
  enableLinkSharing: PropTypes.func.isRequired,
  editPool: PropTypes.func.isRequired,
  clearPoolError: PropTypes.func.isRequired,
  deleteResume: PropTypes.func.isRequired,
  editResume: PropTypes.func.isRequired,
  resume: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  resumeToken: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  cancelCritiqueRequest: PropTypes.func.isRequired,
  voteViaResumeOverview: PropTypes.func.isRequired,
  commentViaResumeOverview: PropTypes.func.isRequired,
  fetchProfileInstitutionsViaResumeOverview: PropTypes.func.isRequired,
  editResumeError: PropTypes.string,
  poolChangeError: PropTypes.string,
  pdfLoaded: PropTypes.bool.isRequired,
  institutions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  resume: state.resumeoverview.resume,
  resumeToken: state.resumeoverview.resumeToken,
  loading: state.resumeoverview.loading,
  editResumeError: state.resumeoverview.editResumeError,
  poolChangeError: state.resumeoverview.poolChangeError,
  institutions: state.resumeoverview.institutions,
  pdfLoaded: state.pdf.pdf.pdfLoaded,
});

const mapDispatchToProps = {
  fetchResume,
  requestCritique,
  updateNotes,
  enableLinkSharing,
  editPool,
  clearPoolError,
  deleteResume,
  editResume,
  cancelCritiqueRequest,
  voteViaResumeOverview,
  commentViaResumeOverview,
  fetchProfileInstitutionsViaResumeOverview,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResumeOverview);
