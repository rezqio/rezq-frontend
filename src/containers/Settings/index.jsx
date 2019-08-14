import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Prompt } from 'react-router';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import pickBy from 'lodash/pickBy';
import isString from 'lodash/isString';
import isEqual from 'lodash/isEqual';
import {
  Checkbox,
  ControlLabel,
  Button,
  Form,
  FormControl,
  FormGroup,
  Tabs,
  Tab,
  Alert,
  Glyphicon,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { GoogleLogin } from 'react-google-login';
import ReactMarkdown from 'react-markdown';
import IndustrySelector from '../../components/IndustrySelector';
import './styles/settings.css';
import '../signup.css';
import {
  fetchProfile,
  editProfile,
  editAccount,
  resendVerificationEmail,
  cancelEmailChange,
  deleteProfile,
  linkProfileWithWaterloo,
  linkProfileWithFacebook,
  linkProfileWithGoogle,
  resetProfileFeedback,
  unlinkProfileFromThirdPartyAuth,
  resetMergeAccountModal,
  uploadAvatar,
  removeAvatar,
} from './actions/settings';
import DeleteProfileModal from './DeleteProfile';
import MergeAccountModal from './MergeAccountModal';
import UploadAvatarModal from './UploadAvatarModal';
import {
  FRONTEND_URI,
  UWATERLOO_CAS,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_VERSION,
  GOOGLE_CLIENT_ID,
  THIRD_PARTY_AUTH,
} from '../../constants';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      biography: '',
      email: '',
      emailSubscribed: false,
      googleId: '',
      facebookId: '',
      waterlooId: '',
      username: '',
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      industries: '',
      authErrors: '',
      showDeleteProfileModal: false,
      profileLoaded: false,
      hasUnsavedChanges: false,
      showDivider: window.innerWidth < 1200,
      shouldMergeAccount: false,
      autoLoadFacebook: false,
      autoLoadGoogle: false,
      showUploadAvatarModal: false,
      preview: true,
    };

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchProfile();
    this.setTicket();
    window.addEventListener('resize', this.resize.bind(this));
  }

  componentDidUpdate(prevProps) {
    const { profile } = this.props;

    if (this.state.hasUnsavedChanges) {
      window.onbeforeunload = () => true;
    } else {
      window.onbeforeunload = undefined;
    }

    if (!this.state.profileLoaded || !isEqual(prevProps.profile, profile)) {
      /* eslint-disable */
      const validFields = pickBy(profile, isString);
      this.setState(validFields);

      if (!profile.avatarDownloadUrl) {
        this.setState({ avatarDownloadUrl: null });
      }

      // special case
      if (!profile.email) {
        this.setState({ email: '' });
      }

      this.setState({
        emailSubscribed: profile.emailSubscribed,
        profileLoaded: true
      });
      /* eslint-enable */
    }
  }

  componentWillUnmount() {
    window.onbeforeunload = undefined;
  }

  onChange(event) {
    if (event.target.name === 'emailSubscribed') {
      this.setState(prevState => ({
        emailSubscribed: !prevState.emailSubscribed,
      }));
    } else {
      this.setState({ [event.target.name]: event.target.value });
    }

    if (!this.state.hasUnsavedChanges) {
      this.setState({
        hasUnsavedChanges: true,
      });
    }
  }

  onSaveAccount() {
    const includedFields = new Set(['email', 'currentPassword', 'newPassword', 'username', 'confirmNewPassword', 'emailSubscribed']);
    const editAccountParams = pickBy(this.state, (value, fieldName) => {
      if (includedFields.has(fieldName)) {
        return true;
      }
      return false;
    });
    this.props.editAccount(editAccountParams, this.props.profile.hasPassword);
    this.setState({
      newPassword: '',
      confirmNewPassword: '',
      currentPassword: '',
      hasUnsavedChanges: false,
    });
  }

  onSaveProfile() {
    const editProfileParams = pickBy(this.state, (value, fieldName) => {
      if (fieldName === 'lastName' || fieldName === 'firstName' || fieldName === 'industries' || fieldName === 'biography') {
        return true;
      }
      return false;
    });
    this.props.editProfile(editProfileParams);
    this.setState({
      newPassword: '',
      confirmNewPassword: '',
      currentPassword: '',
      hasUnsavedChanges: false,
      showSetBiography: false,
    });
  }

  onDelete() {
    this.props.deleteProfile();
  }

  onUploadAvatar(avatarDataURL) {
    this.props.uploadAvatar(
      this.state.id,
      avatarDataURL,
    );
  }

  setTicket() {
    const ticket = window.location.search;
    const isTicket = window.location.search.startsWith('?ticket');
    if (isTicket) {
      this.props.linkProfileWithWaterloo(ticket.split('=')[1], this.props.showMergeAccountModal);
      if (this.props.showMergeAccountModal) {
        this.props.resetMergeAccountModal();
      }
    }
  }

  mergeAccount() {
    switch (this.props.mergeAccountType) {
      case 'Waterloo':
        window.location.assign(`${UWATERLOO_CAS + FRONTEND_URI}/settings`);
        break;
      case 'Facebook':
        this.setState({ autoLoadFacebook: true });
        break;
      case 'Google':
        this.setState({ autoLoadGoogle: true });
        break;
      default:
    }
  }

  updateIndustries(industries) {
    this.setState({
      industries,
    });

    if (!this.state.hasUnsavedChanges) {
      this.setState({
        hasUnsavedChanges: true,
      });
    }
  }

  openDeleteProfileModal() {
    this.setState({
      showDeleteProfileModal: true,
    });
  }

  closeDeleteProfileModal() {
    this.setState({
      showDeleteProfileModal: false,
    });

    if (this.props.deleteProfileError) {
      localStorage.clear();
      window.location.href = '/login';
    }

    if (this.props.deleteProfileSuccess) {
      localStorage.clear();
      window.location.href = '/';
    }
  }

  openUploadAvatarModal() {
    this.setState({
      showUploadAvatarModal: true,
    });
  }

  closeUploadAvatarModal() {
    this.setState({
      showUploadAvatarModal: false,
    });
  }

  resize() {
    this.setState({
      showDivider: window.innerWidth < 1200,
    });
  }

  togglePreview() {
    this.setState(prevState => ({
      preview: !prevState.preview,
    }));
  }

  render() {
    const {
      profile,
      loading,
      editProfileSuccess,
      editProfileError,
      verificationEmailSuccess,
      cancelEmailChangeSuccess,
      linkProfileSuccessMessage,
      linkProfileError,
      deleteProfileSuccess,
      deleteProfileError,
      uploadAvatarError,
      removeAvatarError,
    } = this.props;

    const responseFacebook = (response) => {
      if (!response || !response.accessToken) {
        // TODO: propagate error to UI for user
        this.setState({ authErrors: 'Failed to link profile to Facebook', autoLoadFacebook: false });
      }
      this.props.linkProfileWithFacebook(response.accessToken, this.props.showMergeAccountModal);
      if (this.props.showMergeAccountModal) {
        this.props.resetMergeAccountModal();
        this.setState({ autoLoadFacebook: false });
      }
    };

    const responseGoogle = (response) => {
      this.props.linkProfileWithGoogle(response.tokenObj.id_token,
        this.props.showMergeAccountModal);
      if (this.props.showMergeAccountModal) {
        this.props.resetMergeAccountModal();
        this.setState({ autoLoadGoogle: false });
      }
    };
    const responseGoogleFailed = (error) => {
      // TODO: propagate error to UI for user
      this.setState({ authErrors: `Failed to link profile to Google ${error}` });
    };

    if (loading) {
      return <div>Loading...</div>;
    }
    const deleteTooltip = (
      <Tooltip id="delete-account-tooltip">
        <Glyphicon
          glyph="warning-sign"
        />
        {' '}
        You will be unable to recover your account once deleted.
      </Tooltip>
    );

    return (
      <div className="section-container">
        <input type="hidden" value="autocomplete" />
        <Prompt
          when={this.state.hasUnsavedChanges}
          message="You have unsaved changes, are you sure you want to leave the page?"
        />
        <div className="section-body">
          <div className="section-header" />
        </div>
        <div id="section-body">
          <Tabs
            className="settings-tab"
            id="profile-tab-id"
            defaultActiveKey={1}
            onSelect={() => this.props.resetProfileFeedback()}
          >
            <Tab eventKey={1} title="Profile">
              <div className="settingsContainer">
                <div className="settings-dp-container">
                  {(this.state.avatarDownloadUrl)
                    ? (
                      <div role="presentation" onClick={() => this.openUploadAvatarModal()}>
                        <img
                          className="dp custom-dp"
                          src={this.state.avatarDownloadUrl}
                          alt="avatar"
                        />
                      </div>
                    )
                    : (
                      <div className="dp default-dp" role="presentation" onClick={() => this.openUploadAvatarModal()}>
                        <Glyphicon
                          glyph="user"
                        />
                        <div className="coming-soon">
                          Click to change
                        </div>
                      </div>
                    )
                  }
                  <div className="dp-actions">
                    {profile.username
                      ? (
                        <button
                          type="button"
                          className="btn btn-link"
                          onClick={() => { window.location.href = `/profile/${this.state.username}`; }}
                        >
                        View Profile
                        </button>
                      )
                      : (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={(
                            <Tooltip id="profile-view-disabled-tooltip">
                              <div className="tooltip-content">
                            Add a username under the Account tab
                            to enable your public profile page.
                              </div>
                            </Tooltip>
                      )}
                        >
                          <span>View Profile</span>
                        </OverlayTrigger>
                      )
                    }
                    {this.state.avatarDownloadUrl && (
                      <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => this.props.removeAvatar()}
                      >
                        Remove Avatar
                      </button>
                    )}
                    <FormGroup>
                      {removeAvatarError && (
                      <Alert className="alert" bsStyle="danger">
                        {removeAvatarError}
                      </Alert>
                      )}
                    </FormGroup>
                  </div>
                </div>
                <div className="settings">
                  <Form horizontal>
                    <FormGroup controlId="formHorizontalFirstName">
                      <ControlLabel>
                          First Name
                      </ControlLabel>
                      <form
                        autoComplete={false}
                      >
                        <input
                          className="input-box"
                          maxLength="30"
                          name="firstName"
                          type="text"
                          value={this.state.firstName}
                          onChange={this.onChange}
                        />
                      </form>
                    </FormGroup>
                    <FormGroup controlId="formHorizontalLastName">
                      <ControlLabel>
                          Last Name
                      </ControlLabel>
                      <form
                        autoComplete={false}
                      >
                        <input
                          className="input-box"
                          maxLength="150"
                          name="lastName"
                          type="text"
                          value={this.state.lastName}
                          onChange={this.onChange}
                        />
                      </form>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>
                        About Me
                        {!profile.username && (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={(
                            <Tooltip id="profile-biography-tooltip">
                              <div className="tooltip-content">
                                Add a username under the Account tab
                                to enable your public profile page.
                              </div>
                            </Tooltip>
                          )}
                        >
                          <Glyphicon className="biography-question-mark" glyph="question-sign" />
                        </OverlayTrigger>
                        )}
                      </ControlLabel>
                      {
                        this.state.preview
                          ? (
                            <FormControl
                              name="biography"
                              maxLength="1024"
                              componentClass="textarea"
                              value={this.state.biography}
                              onChange={this.onChange}
                              rows="7"
                            />
                          )
                          : (
                            <div
                              className="biography-preview preview-container"
                              rows="7"
                            >
                              <p>
                                <ReactMarkdown source={this.state.biography} />
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
                    </FormGroup>
                    <FormGroup controlId="formHorizontalIndustries">
                      <ControlLabel>
                          Industries
                      </ControlLabel>
                      <IndustrySelector
                        selected={this.state.industries}
                        onChange={industries => this.updateIndustries(industries)}
                        visible
                      />
                    </FormGroup>

                    <FormGroup>
                      <Button
                        className="highlight-btn"
                        onClick={() => this.onSaveProfile()}
                      >
                          Save Changes
                      </Button>
                    </FormGroup>

                    <FormGroup>
                      {editProfileError && (
                      <Alert className="alert" bsStyle="danger">
                        {editProfileError}
                      </Alert>
                      )}
                      {editProfileSuccess && (
                      <Alert className="alert" bsStyle="success">
                            Your changes have been saved.
                      </Alert>
                      )}
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </Tab>
            <Tab eventKey={2} title="Account">
              <div className="settingsContainer">
                <div className="settings">
                  <Form horizontal>
                    <FormGroup controlId="formHorizontalEmail">
                      <ControlLabel>
                          Email
                      </ControlLabel>
                      <form
                        autoComplete={false}
                      >
                        <input
                          className="input-box"
                          maxLength="254"
                          name="email"
                          type="email"
                          value={this.state.email}
                          onChange={this.onChange}
                        />
                      </form>

                      {profile.unverifiedEmail && !cancelEmailChangeSuccess
                      && (
                      <div className="email-notif">
                        <Alert className="alert" bsStyle="warning">
                          <div className="unverified">
                            <span>
                              <Glyphicon
                                glyph="exclamation-sign"
                              />
                              {' '}
                              Awaiting email verification:
                              {' '}
                              {profile.unverifiedEmail}
                            </span>
                            <div>
                              {verificationEmailSuccess
                                ? (
                                  <div className="email-sent">Sent!</div>
                                )
                                : (
                                  <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() => this.props.resendVerificationEmail()}
                                  >
                                  Resend
                                  </button>
                                )
                              }
                              {profile.unverifiedEmail !== profile.email
                                && (
                                  <button
                                    type="button"
                                    className="btn btn-link"
                                    onClick={() => this.props.cancelEmailChange()}
                                  >
                                  Cancel
                                  </button>
                                )
                              }
                            </div>
                          </div>
                        </Alert>
                      </div>
                      )
                    }
                    </FormGroup>

                    <FormGroup controlId="formHorizontalUsername">
                      <ControlLabel>
                        Username
                        {!profile.username && (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={(
                            <Tooltip id="profile-biography-tooltip">
                              <div className="tooltip-content">
                                Add a username to enable your public profile page.
                                You&#39;ll also be able to sign in with your username.
                                <br />
                                <br />
                                You may change your username at any time.
                              </div>
                            </Tooltip>
                          )}
                        >
                          <Glyphicon className="biography-question-mark" glyph="question-sign" />
                        </OverlayTrigger>
                        )}
                      </ControlLabel>
                      <form
                        autoComplete={false}
                      >
                        <input
                          className="input-box"
                          maxLength="150"
                          name="username"
                          type="text"
                          value={this.state.username}
                          onChange={this.onChange}
                        />
                      </form>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalNewPassword">
                      <ControlLabel>
                        New Password
                      </ControlLabel>
                      <form
                        autoComplete={false}
                      >
                        <input
                          className="input-box"
                          maxLength="128"
                          name="newPassword"
                          type="password"
                          value={this.state.newPassword}
                          onChange={this.onChange}
                        />
                      </form>
                    </FormGroup>

                    <FormGroup controlId="formHorizontalConfirmNewPassword">
                      <ControlLabel>
                        Confirm New Password
                      </ControlLabel>
                      <form
                        autoComplete={false}
                      >
                        <input
                          className="input-box"
                          maxLength="128"
                          name="confirmNewPassword"
                          type="password"
                          value={this.state.confirmNewPassword}
                          onChange={this.onChange}
                        />
                      </form>
                    </FormGroup>

                    {profile.hasPassword && (
                      <FormGroup controlId="formHorizontalCurrentPassword">
                        <ControlLabel>
                            Current Password *
                        </ControlLabel>
                        <form
                          autoComplete={false}
                        >
                          <input
                            className="input-box"
                            maxLength="128"
                            name="currentPassword"
                            type="password"
                            value={this.state.currentPassword}
                            onChange={this.onChange}
                          />
                        </form>
                      </FormGroup>
                    )}

                    <FormGroup controlId="formEmailSubscribed">
                      <Checkbox
                        name="emailSubscribed"
                        checked={this.state.emailSubscribed}
                        onChange={this.onChange}
                      >
                        Subscribed to Email Notifications
                      </Checkbox>
                    </FormGroup>

                    <FormGroup>
                      <Button
                        className="highlight-btn"
                        onClick={() => this.onSaveAccount()}
                      >
                          Save Changes
                      </Button>
                    </FormGroup>

                    <FormGroup>
                      {editProfileError && (
                        <Alert className="alert" bsStyle="danger">
                          {editProfileError}
                        </Alert>
                      )}
                      {editProfileSuccess && (
                        <Alert className="alert" bsStyle="success">
                            Your changes have been saved.
                        </Alert>
                      )}
                    </FormGroup>
                  </Form>
                </div>
                {this.state.showDivider
                  && <div className="divider-horizontal" />
                }
                <div className="settings-social">
                  <Form horizontal>
                    <FormGroup>
                      <div className="otherSignup">
                        {profile.waterlooId === null
                          ? (
                            <Button
                              className="signupBtn uwaterloo"
                              onClick={() => {
                                window.location.assign(`${UWATERLOO_CAS + FRONTEND_URI}/settings`);
                              }}
                            >
                            Link to UWaterloo CAS
                            </Button>
                          )
                          : (
                            <Button
                              className="signupBtn uwaterloo"
                              onClick={() => this.props.unlinkProfileFromThirdPartyAuth(
                                THIRD_PARTY_AUTH.UWATERLOO,
                              )}
                            >
                            Unlink from UWaterloo CAS
                            </Button>
                          )
                          }

                        {profile.facebookId === null
                          ? (
                            <FacebookLogin
                              appId={FACEBOOK_APP_ID}
                              autoLoad={this.state.autoLoadFacebook}
                              scope="public_profile"
                              fields="email"
                              version={FACEBOOK_APP_VERSION}
                              callback={responseFacebook}
                              render={renderProps => (
                                <Button
                                  onClick={renderProps.onClick}
                                  className="signupBtn facebook"
                                >
                                Link to Facebook
                                </Button>
                              )}
                            />
                          )
                          : (
                            <Button
                              className="signupBtn facebook"
                              onClick={() => this.props.unlinkProfileFromThirdPartyAuth(
                                THIRD_PARTY_AUTH.FACEBOOK,
                              )}
                            >
                            Unlink from Facebook
                            </Button>
                          )
                        }
                        {this.state.autoLoadGoogle
                          && (
                          <GoogleLogin
                            clientId={GOOGLE_CLIENT_ID}
                            autoLoad
                            onSuccess={responseGoogle}
                            onFailure={responseGoogleFailed}
                            render={renderProps => (
                              <Button
                                onClick={renderProps.onClick}
                                className="signupBtn google"
                              >
                              Link to Google
                              </Button>
                            )}
                          />
                          )
                        }
                        {profile.googleId === null && !this.state.autoLoadGoogle
                          ? (
                            <GoogleLogin
                              clientId={GOOGLE_CLIENT_ID}
                              autoLoad={false}
                              onSuccess={responseGoogle}
                              onFailure={responseGoogleFailed}
                              render={renderProps => (
                                <Button
                                  onClick={renderProps.onClick}
                                  className="signupBtn google"
                                >
                                Link to Google
                                </Button>
                              )}
                            />
                          )
                          : (
                            <Button
                              className="signupBtn google"
                              onClick={() => this.props.unlinkProfileFromThirdPartyAuth(
                                THIRD_PARTY_AUTH.GOOGLE,
                              )}
                            >
                          Unlink from Google
                            </Button>
                          )
                      }
                      </div>
                    </FormGroup>

                    <FormGroup>
                      {linkProfileError && (
                        <Alert className="alert" bsStyle="danger">
                          {linkProfileError}
                        </Alert>
                      )}
                      {linkProfileSuccessMessage && (
                        <Alert className="alert" bsStyle="success">
                          {linkProfileSuccessMessage}
                        </Alert>
                      )}
                    </FormGroup>

                    <FormGroup>
                      <div className="delete-box">
                        <OverlayTrigger placement="bottom" overlay={deleteTooltip}>
                          <Button
                            className="delete-btn"
                            onClick={() => this.openDeleteProfileModal()}
                          >
                          Delete Account
                          </Button>
                        </OverlayTrigger>
                      </div>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        <MergeAccountModal
          title="Merge Accounts"
          showModal={this.props.showMergeAccountModal}
          mergeAccountAndCloseModal={() => this.mergeAccount()}
          accountToMerge={this.props.mergeAccountType}
          closeModal={() => this.props.resetMergeAccountModal()}
        />

        <DeleteProfileModal
          title="Delete Account"
          submit={() => this.onDelete()}
          showModal={this.state.showDeleteProfileModal}
          isError={deleteProfileError}
          isSuccess={deleteProfileSuccess}
          closeModal={() => this.closeDeleteProfileModal()}
        />

        <UploadAvatarModal
          title="Upload Avatar"
          uploadError={uploadAvatarError}
          submit={avatarDataURL => this.onUploadAvatar(avatarDataURL)}
          showModal={this.state.showUploadAvatarModal}
          closeModal={() => this.closeUploadAvatarModal()}
        />

      </div>
    );
  }
}

Settings.propTypes = {
  fetchProfile: PropTypes.func.isRequired,
  editProfile: PropTypes.func.isRequired,
  editAccount: PropTypes.func.isRequired,
  resendVerificationEmail: PropTypes.func.isRequired,
  cancelEmailChange: PropTypes.func.isRequired,
  deleteProfile: PropTypes.func.isRequired,
  linkProfileWithWaterloo: PropTypes.func.isRequired,
  linkProfileWithFacebook: PropTypes.func.isRequired,
  linkProfileWithGoogle: PropTypes.func.isRequired,
  resetProfileFeedback: PropTypes.func.isRequired,
  unlinkProfileFromThirdPartyAuth: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  loading: PropTypes.bool.isRequired,
  editProfileSuccess: PropTypes.bool.isRequired,
  editProfileError: PropTypes.string.isRequired,
  verificationEmailSuccess: PropTypes.bool.isRequired,
  cancelEmailChangeSuccess: PropTypes.bool.isRequired,
  linkProfileSuccessMessage: PropTypes.string.isRequired,
  linkProfileError: PropTypes.string.isRequired,
  deleteProfileSuccess: PropTypes.bool.isRequired,
  deleteProfileError: PropTypes.bool.isRequired,
  resetMergeAccountModal: PropTypes.func.isRequired,
  showMergeAccountModal: PropTypes.bool.isRequired,
  mergeAccountType: PropTypes.string.isRequired,
  uploadAvatar: PropTypes.func.isRequired,
  removeAvatar: PropTypes.func.isRequired,
  uploadAvatarError: PropTypes.string.isRequired,
  removeAvatarError: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  profile: state.settings.profile,
  loading: state.settings.loading,
  editProfileSuccess: state.settings.editProfileSuccess,
  editProfileError: state.settings.editProfileError,
  verificationEmailSuccess: state.settings.verificationEmailSuccess,
  cancelEmailChangeSuccess: state.settings.cancelEmailChangeSuccess,
  linkProfileSuccessMessage: state.settings.linkProfileSuccessMessage,
  linkProfileError: state.settings.linkProfileError,
  deleteProfileSuccess: state.settings.deleteProfileSuccess,
  deleteProfileError: state.settings.deleteProfileError,
  showMergeAccountModal: state.settings.showMergeAccountModal,
  mergeAccountType: state.settings.mergeAccountType,
  uploadAvatarError: state.settings.uploadAvatarError,
  removeAvatarError: state.settings.removeAvatarError,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    fetchProfile,
    editProfile,
    editAccount,
    resendVerificationEmail,
    cancelEmailChange,
    deleteProfile,
    linkProfileWithWaterloo,
    linkProfileWithFacebook,
    linkProfileWithGoogle,
    resetProfileFeedback,
    unlinkProfileFromThirdPartyAuth,
    resetMergeAccountModal,
    uploadAvatar,
    removeAvatar,
  },
  dispatch,
);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Settings),
);
