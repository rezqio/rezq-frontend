import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router';
import { Button } from 'react-bootstrap';
import Chip from '@material-ui/core/Chip';
import map from 'lodash/map';
import Pdf from '../Pdf/index';
import { PATHS, TAGS } from '../../constants';
import { fetchSharedResume, createLinkedCritique } from './actions/SharedResume';
import { getProfileLinkOrAnimal } from '../../utils/animals';

import '../resumeoverview.css';

class SharedResume extends Component {
  componentDidMount() {
    const { resumeToken } = this.props.match.params; // eslint-disable-line react/prop-types
    this.props.fetchSharedResume(resumeToken);
  }

  createLinkedCritique() {
    const { isLoggedIn } = this.props;
    const { resumeToken } = this.props.match.params; // eslint-disable-line react/prop-types
    this.props.createLinkedCritique(isLoggedIn, resumeToken);
  }

  render() {
    const { resume, loading } = this.props; // eslint-disable-line no-unused-vars

    if (loading === false && !resume) {
      return <Redirect to={PATHS.NOT_FOUND} />;
    }

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
              />
              <div className="resume-panel">
                <div className="resume-details-box">
                  <div className="resume-details-title">
                    {resume.name}
                  </div>
                  <div className="resume-details-upload">
                    Uploaded by:&nbsp;
                    {getProfileLinkOrAnimal(resume.uploader)}
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
                    <p>{resume.description}</p>
                  </div>
                </div>
                {resume.notesForCritiquer && (
                  <div className="resume-critiques-container">
                    <div className="resume-critiques-header">Notes for Critiquer</div>
                    {resume.notesForCritiquer}
                  </div>
                )}
                <div className="resume-action-box">
                  <Button
                    className="highlight-btn"
                    onClick={() => this.createLinkedCritique()}
                  >
                    Critique This Resume
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

SharedResume.defaultProps = {
  resume: null,
};

SharedResume.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  fetchSharedResume: PropTypes.func.isRequired,
  createLinkedCritique: PropTypes.func.isRequired,
  resume: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.session,
  resume: state.sharedresume.resume,
  loading: state.sharedresume.loading,
});

const mapDispatchToProps = {
  fetchSharedResume,
  createLinkedCritique,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SharedResume);
