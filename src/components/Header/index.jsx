import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Nav, Navbar, NavItem, Glyphicon,
} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { logoutUser } from '../../containers/Login/actions/sessionActions';
import HeaderLogoImg from '../../assets/logo.png';
import { PATHS } from '../../constants';
import './header.css';

const Header = (props) => {
  /*eslint-disable */
  const loggedIn = localStorage.getItem("token") && props.isLoggedIn;
  /* eslint-enable */
  return (
    <div>
      <Navbar fluid collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <LinkContainer exact to="/">
              <img className="clickable" alt="rezq logo" src={HeaderLogoImg} />
            </LinkContainer>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <div>
            <Nav>
              { loggedIn
                  && (
                  <LinkContainer exact to={PATHS.RESUMES}>
                    <NavItem>
                      <span className={(props.location.pathname === PATHS.RESUMES) ? 'nav-header-item' : ''}>My Resumes</span>
                    </NavItem>
                  </LinkContainer>
                  )
                }
              { loggedIn
                  && (
                  <LinkContainer exact to={PATHS.CRITIQUES}>
                    <NavItem>
                      <span className={(props.location.pathname === PATHS.CRITIQUES) ? 'nav-header-item' : ''}>My Critiques</span>
                    </NavItem>
                  </LinkContainer>
                  )
                }

              <LinkContainer exact to={PATHS.PUBLIC_POOL}>
                <NavItem>
                  <span className={(props.location.pathname === PATHS.PUBLIC_POOL) ? 'nav-header-item' : ''}>Resume Pool</span>
                </NavItem>
              </LinkContainer>
            </Nav>
          </div>


          { !loggedIn
            ? (
              <Nav pullRight>
                {
                props.location.pathname === PATHS.LOGIN ? (
                  <LinkContainer exact to={PATHS.SIGNUP}>
                    <NavItem>Sign Up</NavItem>
                  </LinkContainer>
                ) : (
                  <LinkContainer exact to={PATHS.LOGIN}>
                    <NavItem>Sign In</NavItem>
                  </LinkContainer>
                )}
              </Nav>
            )
            : (
              <Nav pullRight>
                <LinkContainer exact to={PATHS.SETTINGS}>
                  <NavItem>
                    <span className={(props.location.pathname === PATHS.SETTINGS) ? 'nav-header-item' : ''}>Settings</span>
                  </NavItem>
                </LinkContainer>
                <NavItem
                  onSelect={
                    () => {
                      const hasUnsavedChanges = (
                        props.hasUnsavedChanges
                        || props.hasUnsavedChangesShared
                        || props.hasUnsavedChangesPooled
                        || props.annotationsEdited
                      );
                      const unsavedState = (
                        props.saved === false
                        && props.savedShared === false
                        && props.savedPooled === false
                      );
                      const showUnsavedChangesPrompt = (hasUnsavedChanges && unsavedState);

                      if (showUnsavedChangesPrompt) { // eslint-disable-next-line no-alert
                        if (window.confirm('You have unsaved changes, are you sure you want to leave the page')) { // eslint-disable-line no-alert
                          props.logoutUser();
                        }
                      } else {
                        props.logoutUser();
                      }
                    }
                  }
                >
                  Sign Out
                </NavItem>
              </Nav>
            )
            }
        </Navbar.Collapse>
      </Navbar>

      {(loggedIn && props.unverifiedEmail)
        && (
        <div className="unverified-email-notice-container">
          <div className="unverified-email-notice">
            <Glyphicon
              glyph="exclamation-sign"
              className="unverified-email-symbol"
            />
        Your email is unverified.
          </div>
        </div>
        )
      }
    </div>
  );
};

Header.defaultProps = {
  unverifiedEmail: null,
};

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  unverifiedEmail: PropTypes.string,
  logoutUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  saved: PropTypes.bool.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  savedShared: PropTypes.bool.isRequired,
  hasUnsavedChangesShared: PropTypes.bool.isRequired,
  savedPooled: PropTypes.bool.isRequired,
  hasUnsavedChangesPooled: PropTypes.bool.isRequired,
  annotationsEdited: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.session,
  unverifiedEmail: state.login.unverifiedEmail,
  saved: state.critique.saved,
  hasUnsavedChanges: state.critique.hasUnsavedChanges,
  savedShared: state.sharedcritique.saved,
  hasUnsavedChangesShared: state.sharedcritique.hasUnsavedChanges,
  savedPooled: state.pooledcritique.saved,
  hasUnsavedChangesPooled: state.pooledcritique.hasUnsavedChanges,
  annotationsEdited: state.pdf.undoableAnnotations.annotationsEdited,
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  {
    pure: false,
  },
)(Header);
