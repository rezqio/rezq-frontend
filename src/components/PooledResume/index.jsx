import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import Divider from '@material-ui/core/Divider';
import {
  Alert,
  Button,
  FormControl,
  OverlayTrigger,
  Tooltip,
  Glyphicon,
  InputGroup,
} from 'react-bootstrap';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import filter from 'lodash/filter';
import map from 'lodash/map';
import ReactMarkdown from 'react-markdown';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import Pdf from '../Pdf/index';
import { TAGS } from '../../constants';
import {
  fetchPooledResume,
  createPooledResumeCritique,
  votePooledResumeCritique,
  commentViaPooledResume,
} from './actions/Pooledresume';
import { getProfileLinkOrAnimal } from '../../utils/animals';

import '../resumeoverview.css';

class PooledResume extends Component {
  constructor(props) {
    super(props);

    this.state = {
      annotations: '',
      expanded: -1,
      canShowAlert: false,
      currentComment: '',
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params; // eslint-disable-line react/prop-types
    if (id.length !== 36) {
      window.location.href = '/notfound';
    }
    const pool = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : '';
    this.props.fetchPooledResume(this.props.isLoggedIn, id, pool);
  }

  onCritiqueRowClick(annotations, index) {
    if (this.state.expanded === index) {
      this.setState({
        annotations: '',
        expanded: -1,
      });
    } else {
      this.setState({
        annotations,
        expanded: index,
      });
    }
    this.setState({
      currentComment: '',
    });
  }

  onUpvoteClicked(id, userVotedMap) {
    // User is upvoting but they previously upvoted - clear it
    if (userVotedMap[id] === true) {
      this.props.votePooledResumeCritique(id, null);
      return;
    }
    this.props.votePooledResumeCritique(id, true);
  }

  onDownvoteClicked(id, userVotedMap) {
    // User is downvoting but they previously downvoted - clear it
    if (userVotedMap[id] === false) {
      this.props.votePooledResumeCritique(id, null);
      return;
    }
    this.props.votePooledResumeCritique(id, false);
  }

  setComment(comment) {
    this.setState({
      currentComment: comment,
    });
  }

  updateCommentsForCritique(critiqueId) {
    if (this.state.currentComment) {
      const pool = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : '';
      this.props.commentViaPooledResume(critiqueId, this.state.currentComment, pool);
      this.setState({
        currentComment: '',
      });
    }
  }

  createPooledCritique() {
    const { id } = this.props.match.params; // eslint-disable-line react/prop-types
    this.setState({
      canShowAlert: true,
    });
    const pool = window.location.href.split('?')[1] ? window.location.href.split('?')[1] : '';
    this.props.createPooledResumeCritique(id, pool);
  }

  handleAlertDismiss() {
    this.setState({
      canShowAlert: false,
    });
  }

  render() {
    const { pooledResume, loading, error } = this.props;

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

    const pooledCritiqueSet = pooledResume ? pooledResume.pooledcritiqueSet : [];

    const userUpvoted = (pooledResume && pooledResume.pooledCritiquesUserUpvoted)
      ? pooledResume.pooledCritiquesUserUpvoted
      : {};

    return (
      <div className="section-body">
        <div className="section-centered">
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="resume-container">
              <Pdf
                canWrite={false}
                filePath={pooledResume.downloadUrl}
                annotations={this.state.annotations}
              />
              <div className="resume-panel">
                <div className="resume-details-box">
                  <div className="resume-details-title">
                    {pooledResume.name}
                  </div>
                  <div className="resume-details-upload">
                    Uploaded by:&nbsp;
                    {getProfileLinkOrAnimal(pooledResume.uploader)}
                  </div>
                  <div className="resume-details-description">
                    <div>
                      {map(pooledResume.industries.split(','), industry => (
                        <Chip
                          className="chip selected"
                          color="primary"
                          label={TAGS[industry]}
                        />
                      ))
                    }
                    </div>
                    {pooledResume.description.length > 0 && <p>{pooledResume.description}</p>}
                  </div>
                </div>

                {pooledResume.notesForCritiquer && (
                  <div className="resume-critiques-container">
                    <div className="resume-critiques-header">Notes for Critiquer</div>
                    {pooledResume.notesForCritiquer}
                  </div>
                )}
                <div className="resume-action-box">
                  {this.props.isLoggedIn
                    ? (
                      <Button
                        className="highlight-btn"
                        onClick={() => this.createPooledCritique()}
                      >
                      Critique This Resume
                      </Button>
                    )
                    : (
                      <Button
                        className="highlight-btn"
                        onClick={() => { window.location.href = '/login'; }}
                      >
                      Sign In to Critique This Resume
                      </Button>
                    )
                  }

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
                  </div>
                )}

                {this.props.pdfLoaded
                && (
                <div className="resume-critiques-container">
                  <div className="resume-critiques-header">Critiques</div>
                  {
                    (pooledCritiqueSet && pooledCritiqueSet.length === 0)
                    && <div>This resume has not yet been critiqued.</div>
                  }
                  <div className="resume-critiques-list">
                    {map(pooledCritiqueSet, (critique, index) => (
                      <ExpansionPanel
                        className={(index === pooledCritiqueSet.length - 1) ? 'last-panel' : ''}
                        expanded={this.state.expanded === index}
                        onChange={() => this.onCritiqueRowClick(
                          critique.annotations,
                          index,
                        )}
                      >
                        <ExpansionPanelSummary
                          expandIcon={<ExpandMoreIcon />}
                        >
                          {this.state.expanded !== index
                            && (
                              <div className="resume-critique-upvote-card">
                                {critique.upvotes > 0 && '+'}
                                {critique.upvotes}
                              </div>
                            )
                          }
                          <div className={this.state.expanded === index ? '' : 'resume-critique-card'}>
                            {moment(critique.submittedOn).format('MMMM D [at] h:mm a')}
                          </div>
                        </ExpansionPanelSummary>
                        {critique.critiquer && (
                        <ExpansionPanelDetails>
                          Critiqued by:&nbsp;
                          {getProfileLinkOrAnimal(critique.critiquer)}
                        </ExpansionPanelDetails>
                        )}
                        <ExpansionPanelDetails>
                          <div className="critique"><ReactMarkdown source={critique.summary} /></div>
                        </ExpansionPanelDetails>

                        {this.props.isLoggedIn && (
                        <div className="vote-panel">
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
                        </div>
                        )}

                        <div>
                          {map(orderBy(filter(critique.pooledcritiquecommentSet, c => c), ['createdOn']), comment => (
                            <div>
                              <Divider />
                              <ExpansionPanelDetails className="comment-box">
                                <div className="comment-header">
                                  {comment.user
                                    ? (
                                      <div className="commenter">
                                        {(pooledResume.uploader
                                        && pooledResume.uploader.id === comment.user.id)
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
                                    )
                                  }
                                  {moment(comment.createdOn).fromNow()}
                                </div>
                                <div className="comment">{comment.comment}</div>
                              </ExpansionPanelDetails>
                            </div>
                          ))}
                        </div>

                        {this.props.isLoggedIn
                          && (
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
                          )
                        }
                      </ExpansionPanel>
                    ))}
                  </div>
                </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

PooledResume.defaultProps = {
  pooledResume: null,
  error: null,
};

PooledResume.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  fetchPooledResume: PropTypes.func.isRequired,
  createPooledResumeCritique: PropTypes.func.isRequired,
  votePooledResumeCritique: PropTypes.func.isRequired,
  commentViaPooledResume: PropTypes.func.isRequired,
  pooledResume: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  pdfLoaded: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.session,
  pooledResume: state.pooledresume.pooledResume,
  loading: state.pooledresume.loading,
  error: state.pooledresume.error,
  pdfLoaded: state.pdf.pdf.pdfLoaded,
});

const mapDispatchToProps = {
  fetchPooledResume,
  createPooledResumeCritique,
  votePooledResumeCritique,
  commentViaPooledResume,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PooledResume);
