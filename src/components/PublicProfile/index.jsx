import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chip from '@material-ui/core/Chip';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Glyphicon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import Divider from '@material-ui/core/Divider';
import map from 'lodash/map';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import moment from 'moment';
import { fetchPublicProfile } from './actions/Publicprofile';
import { TAGS } from '../../constants';

import '../resumeoverview.css';
import './publicprofile.css';

class PublicProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    const { id } = this.props.match.params; // eslint-disable-line react/prop-types
    this.props.fetchPublicProfile(id);
  }

  render() {
    const verifiedTooltip = (
      <Tooltip id="verified-tooltip">
        This user is verified
      </Tooltip>
    );
    const premiumTooltip = (
      <Tooltip id="premium-tooltip">
        This user is a premium member
      </Tooltip>
    );

    const {
      publicProfile,
      loading,
      error,
    } = this.props;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>Something went wrong fetching user profile</div>;
    }

    const submittedCritiques = orderBy(
      filter(publicProfile.pooledcritiqueSet, c => c.submitted),
      ['submittedOn'], ['desc'],
    );

    return (
      <div className="section-container">
        <div id="section-body">
          <div className="profileContainer">
            <div className="detailsContainer">
              <div className="profile-dp-container">
                {(publicProfile.avatarDownloadUrl)
                  ? (
                    <img
                      className="profile-dp"
                      src={publicProfile.avatarDownloadUrl}
                      alt="avatar"
                    />
                  )
                  : (
                    <div className="default-profile-dp">
                      <Glyphicon glyph="user" />
                      <div className="coming-soon">
                      No profile picture set.
                      </div>
                    </div>
                  )
              }
                <div className="profile-stats">
                  <div className="profile-badges">
                    {publicProfile.isVerified && (
                    <OverlayTrigger placement="bottom" overlay={verifiedTooltip}>
                      <Glyphicon glyph="ok-sign" />
                    </OverlayTrigger>
                    )}
                    {' '}
                    {publicProfile.isPremium && (
                    <OverlayTrigger placement="bottom" overlay={premiumTooltip}>
                      <Glyphicon glyph="flash" />
                    </OverlayTrigger>
                    )}
                  </div>
                  <div>
                    {submittedCritiques.length !== 0
                  && (
                  <span>
                    {submittedCritiques.length}
                    {' '}
                    {submittedCritiques.length === 1 ? 'Critique' : 'Critiques'}
                    {' '}
                  Given
                  </span>
                  )}
                  </div>
                  <div>
Joined
                    {' '}
                    {moment(publicProfile.dateJoined).format('YYYY-MM-DD')}
                  </div>
                </div>
              </div>

              <div className="profile-details">
                <h3>
                  {(publicProfile.firstName)
                    ? <div>{`${publicProfile.firstName} ${publicProfile.lastName} (${publicProfile.username})`}</div>
                    : <div>{publicProfile.username}</div>
                }
                </h3>
                <div className="profile-biography">
                  <div className="profile-subtitle">About Me</div>
                  <ReactMarkdown source={publicProfile.biography} />
                </div>
                {publicProfile.industries && (
                <div className="profile-industries">
                  <div className="profile-subtitle">Industries</div>
                  {map(publicProfile.industries.split(','), industry => (
                    <Chip
                      className="chip selected"
                      color="primary"
                      label={TAGS[industry]}
                    />
                  ))
              }
                </div>
                )}
              </div>

            </div>

            <div className="recentsContainer">
              <h3>
  Recent Critiques
              </h3>
              {(submittedCritiques.length === 0) && (
              <div>
                The user has not critiqued any resumes yet.
              </div>
              )}

              {map(submittedCritiques.slice(0, 8), row => (
                <div>
                  <Divider />
                  <div className="recent-critique-panel">
                    <div
                      role="link"
                      tabIndex={0}
                      onClick={() => {
                        window.location.href = `/pooled-resume/${row.resume.id}`;
                      }}
                      className="recent-critique-thumbnail"
                    >
                      <img
                        className="resume-thumbnail-img"
                        src={row.resume.thumbnailDownloadUrl}
                        alt="resume thumbnail"
                      />
                    </div>
                    <div className="recent-critique-details">
                      <div
                        role="link"
                        tabIndex={0}
                        onClick={() => {
                          window.location.href = `/pooled-resume/${row.resume.id}`;
                        }}
                        className="recent-critique-resume-name"
                      >
                        {row.resume.name}
                      </div>
                      <div className="recent-critique-submitted-on">
                        Submitted
                        {' '}
                        {moment(row.submittedOn).local().format('YYYY-MM-DD')}
                      </div>
                      <ReactMarkdown source={row.summary} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PublicProfile.defaultProps = {
  publicProfile: null,
  error: '',
};

PublicProfile.propTypes = {
  fetchPublicProfile: PropTypes.func.isRequired,
  publicProfile: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

const mapStateToProps = state => ({
  publicProfile: state.publicprofile.publicprofile,
  loading: state.publicprofile.loading,
  error: state.publicprofile.error,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchPublicProfile,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PublicProfile);
