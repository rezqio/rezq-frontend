import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import PropTypes from 'prop-types';
import {
  Button,
  Checkbox,
  Glyphicon,
  Table,
} from 'react-bootstrap';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import './styles/myresumes.css';
import moment from 'moment';
import UploadResumeModal from './UploadResume';
import UploadAlertModal from './UploadAlertModal';
import DeleteResumesModal from './DeleteResumesModal';
import WelcomeModal from './WelcomeModal';
import {
  fetchMyIndustries,
  fetchMyResumes,
  uploadResume,
  deleteResumes,
  clearUploadError,
} from './actions/Myresumes';

import {
  MY_RESUME_LIMITS, TAGS, PUBLIC, PRIVATE,
} from '../../constants';

const getTotalNumberCritiques = (matchedcritiqueSet, linkedcritiqueSet, pooledcritiqueSet) => {
  let total = 0;

  forEach(matchedcritiqueSet, (c) => {
    if (c.submitted) {
      total += 1;
    }
  });

  forEach(linkedcritiqueSet, (c) => {
    if (c.submitted) {
      total += 1;
    }
  });

  forEach(pooledcritiqueSet, (c) => {
    if (c.submitted) {
      total += 1;
    }
  });

  return total;
};

class MyResumes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showWelcomeModal: false,
      showUploadModal: false,
      showUploadAlertModal: false,
      showDeleteResumesModal: false,
      checked: new Set(),
      showGridView: true,
    };
  }

  componentDidMount() {
    this.props.fetchMyIndustries();
    this.props.fetchMyResumes();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isFirstLogin && this.props.isFirstLogin) {
      /* eslint-disable react/no-did-update-set-state */
      this.setState({
        showWelcomeModal: true,
      });
      /* eslint-disable react/no-did-update-set-state */
    }
  }

  onUpload(modalState) {
    this.props.uploadResume(
      modalState.resumeName,
      modalState.resumeDescription,
      modalState.pool === PRIVATE ? modalState.privatePool : modalState.pool,
      !(modalState.pool === PRIVATE || modalState.pool === PUBLIC),
      modalState.resumeIndustries,
      modalState.resumeFile,
      modalState.resumeThumbnail,
    );
  }

  onToggleView() {
    this.setState(prevState => ({
      showGridView: !prevState.showGridView,
    }));
  }

  removeResumeFromProps(resumeId) {
    this.props.resumes.splice(this.props.resumes.findIndex(resume => resume.id === resumeId), 1);
  }

  closeWelcomeModal() {
    this.setState({
      showWelcomeModal: false,
    });
  }

  openUploadModal(numResumes) {
    if (numResumes && numResumes >= MY_RESUME_LIMITS.MAX_RESUMES) {
      this.setState({
        showUploadAlertModal: true,
      });
      return;
    }

    this.setState({
      showUploadModal: true,
    });
  }

  closeUploadModal() {
    if (this.props.uploadError) {
      this.props.clearUploadError();
    }
    this.setState({
      showUploadModal: false,
    });
  }

  closeUploadAlertModal() {
    this.setState({
      showUploadAlertModal: false,
    });
  }

  addChecked(resumeId) {
    this.setState(({ checked }) => ({
      checked: new Set(checked.add(resumeId)),
    }));
  }

  removeChecked(resumeId) {
    this.setState(({ checked }) => {
      checked.delete(resumeId);
      return {
        checked: new Set(checked),
      };
    });
  }

  fillChecked() {
    this.setState(() => ({
      checked: new Set(this.props.resumes.map(x => x.id)),
    }));
  }

  emptyChecked() {
    this.setState(() => ({
      checked: new Set(),
    }));
  }

  openDeleteResumesModal() {
    if (this.state.checked.size === 0) {
      return;
    }
    this.setState({
      showDeleteResumesModal: true,
    });
  }

  deleteResumesAndCloseModal() {
    const idArr = [...this.state.checked];

    forEach(idArr, (resumeId) => {
      this.removeResumeFromProps(resumeId);
    });

    this.props.deleteResumes(idArr);
    this.emptyChecked();

    this.setState({
      showDeleteResumesModal: false,
    });
  }

  closeDeleteResumesModal() {
    this.setState({
      showDeleteResumesModal: false,
    });
  }

  renderNoResumesView() {
    return (
      <div className="no-content-container">
        <div className="no-content-title">You currently do not have any resumes.</div>
        <div className="no-content-description">
          Upload a resume below to get started.
          <br />
          <br />
          <Button
            className="highlight-btn-small"
            onClick={() => this.openUploadModal(0)}
          >
            <Glyphicon glyph="plus" />
            {' '}
            Upload
          </Button>
        </div>
      </div>
    );
  }

  render() {
    const {
      resumes,
      industries,
      institutions,
      history, // eslint-disable-line react/prop-types
      uploadError,
      uploadingResume,
    } = this.props;

    return (
      <div className="section-container">
        <div className="section-body">
          <div className="section-header" />
        </div>
        {this.props.loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {!resumes || resumes.length === 0
              ? this.renderNoResumesView()
              : (
                <div>
                  <div className="action-bar">
                    <div>
                      <Button
                        className="light-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (resumes && this.state.checked.size !== resumes.length) {
                            this.fillChecked();
                          } else {
                            this.emptyChecked();
                          }
                        }}
                      >
                        <span className="header-check-box">
                          <input
                            type="checkbox"
                            checked={resumes && this.state.checked.size === resumes.length}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (e.target.checked) {
                                this.fillChecked();
                              } else {
                                this.emptyChecked();
                              }
                            }}
                          />
                        </span>
                        {' '}
                        Select All
                      </Button>
                      <Button
                        className="light-btn"
                        onClick={() => this.openUploadModal(resumes.length)}
                      >
                        <Glyphicon glyph="plus" />
                        {' '}
    Upload
                      </Button>
                      <Button
                        className="light-btn"
                        disabled={this.state.checked.size === 0}
                        onClick={() => this.openDeleteResumesModal()}
                      >
                        <Glyphicon glyph="trash" />
                        {' '}
    Delete
                      </Button>
                    </div>
                    <div>
                      <Button
                        className="light-btn"
                        onClick={() => this.onToggleView()}
                      >
                        <Glyphicon
                          glyph={this.state.showGridView ? 'th-list' : 'th-large'}
                        />
                        {' '}
                        Toggle View
                      </Button>
                    </div>
                  </div>
                  {this.state.showGridView
                    ? (
                      <div className="grid-container">
                        <Grid className="resume-grid-view" container justify="space-evenly" alignItems="center">
                          {resumes && resumes.map(resume => (
                            <Grid
                              key={resume.id}
                              item
                              className="resume-grid-item"
                              onClick={() => {
                                history.push(`/resumes/${resume.id}`);
                              }}
                            >
                              <div className="resume-thumbnail-container cursor-pointer">
                                <div className="resume-checkbox">
                                  <Checkbox
                                    className="grid-item-check-box"
                                    checked={this.state.checked.has(resume.id)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (e.target.checked) {
                                        this.addChecked(resume.id);
                                      } else {
                                        this.removeChecked(resume.id);
                                      }
                                    }}
                                  />
                                </div>
                                {resume.thumbnailDownloadUrl
                                  ? (
                                    <img
                                      className="resume-thumbnail-img"
                                      src={resume.thumbnailDownloadUrl}
                                      alt="resume thumbnail"
                                    />
                                  )
                                  : <span className="resume-thumbnail-placeholder"><Glyphicon glyph="file" /></span>
                              }

                                <div className="resume-thumbnail-overlay">
                                  <div className="resume-thumbnail-description">{resume.description}</div>
                                  <div className="resume-thumbnail-industries">
                                    {map(resume.industries.split(','), industry => (
                                      <Chip
                                        className="chip selected"
                                        color="primary"
                                        label={TAGS[industry]}
                                      />
                                    ))
                        }
                                  </div>
                                  <div className="resume-thumbnail-info">
                                    {getTotalNumberCritiques(
                                      resume.matchedcritiqueSet,
                                      resume.linkedcritiqueSet,
                                      resume.pooledcritiqueSet,
                                    )}
                                    {' '}
critiques
                                  </div>
                                  <div className="resume-thumbnail-info">
                                    {moment(resume.createdOn).local().format('YYYY-MM-DD')}
                                  </div>
                                </div>
                              </div>
                              <div className="resume-thumbnail-name cursor-pointer">{resume.name}</div>
                            </Grid>
                          ))}
                        </Grid>
                      </div>
                    )
                    : (
                      <Table responsive>
                        <thead className="table-header">
                          <tr className="table-row">
                            <th className="table-col-header" />
                            <th className="table-col-header">Name</th>
                            <th className="table-col-header">Description</th>
                            <th className="table-col-header">Industries</th>
                            <th className="table-col-header">Critiques</th>
                            <th className="table-col-header">Uploaded</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resumes
                  && resumes.map(row => (
                    <tr
                      className="entry"
                      key={row.id}
                      onClick={() => {
                        history.push(`/resumes/${row.id}`);
                      }}
                    >
                      <td className="fixed-col">
                        <Checkbox
                          className="check-box"
                          checked={this.state.checked.has(row.id)}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (e.target.checked) {
                              this.addChecked(row.id);
                            } else {
                              this.removeChecked(row.id);
                            }
                          }}
                        />
                      </td>
                      <td><span>{row.name}</span></td>
                      <td><span>{row.description}</span></td>
                      <td>
                        <span>
                          {map(
                            row.industries.split(','),
                            i => TAGS[i],
                          ).join(', ')
                      }
                        </span>
                      </td>
                      <td>
                        {getTotalNumberCritiques(
                          row.matchedcritiqueSet,
                          row.linkedcritiqueSet,
                          row.pooledcritiqueSet,
                        )}
                      </td>
                      <td className="short-col">
                        {moment(row.createdOn).local().format('YYYY-MM-DD')}
                      </td>
                    </tr>
                  ))}
                        </tbody>
                      </Table>
                    )}
                </div>
              )
                                    }
          </div>
        )}

        <WelcomeModal
          title="Welcome to RezQ"
          showModal={this.state.showWelcomeModal}
          closeModal={() => this.closeWelcomeModal()}
        />

        <UploadResumeModal
          title="Upload a Resume"
          submit={state => this.onUpload(state)}
          showModal={this.state.showUploadModal}
          closeModal={() => this.closeUploadModal()}
          uploadError={uploadError}
          defaultIndustries={industries}
          institutions={institutions}
          uploadingResume={uploadingResume}
        />

        <UploadAlertModal
          title="Error"
          showModal={this.state.showUploadAlertModal}
          closeModal={() => this.closeUploadAlertModal()}
        />

        <DeleteResumesModal
          title="Confirmation"
          showModal={this.state.showDeleteResumesModal}
          closeModal={() => this.closeDeleteResumesModal()}
          deleteResumesAndCloseModal={() => this.deleteResumesAndCloseModal()}
        />
      </div>
    );
  }
}

MyResumes.defaultProps = {
  uploadError: null,
  isFirstLogin: false,
};

MyResumes.propTypes = {
  fetchMyIndustries: PropTypes.func.isRequired,
  fetchMyResumes: PropTypes.func.isRequired,
  uploadResume: PropTypes.func.isRequired,
  deleteResumes: PropTypes.func.isRequired,
  clearUploadError: PropTypes.func.isRequired,
  resumes: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  industries: PropTypes.string.isRequired,
  institutions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
  uploadError: PropTypes.string,
  isFirstLogin: PropTypes.bool,
  uploadingResume: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  resumes: state.myresumes.resumes,
  industries: state.myresumes.industries,
  institutions: state.myresumes.institutions,
  loading: state.myresumes.loading,
  uploadError: state.myresumes.uploadError,
  isFirstLogin: state.login.isFirstLogin,
  uploadingResume: state.myresumes.uploadingResume,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchMyIndustries,
    fetchMyResumes,
    uploadResume,
    deleteResumes,
    clearUploadError,
  },
  dispatch,
);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(MyResumes),
);
