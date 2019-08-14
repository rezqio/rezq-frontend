import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, withRouter } from 'react-router-dom';

import AuthRoute from '../AuthRoute';

import Login from './Login';
import Signup from './Signup';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LandingPage from '../components/LandingPage';
/*eslint-disable */
/* Import profile before MyResumes since it messes stylesheet*/
import Settings from "./Settings";
import MyResumes from "./MyResumes";
import PublicPool from "./PublicPool";
import PublicProfile from "../components/PublicProfile";
import PooledResume from "../components/PooledResume";
import PooledCritique from "../components/PooledCritique";
import ResumeOverview from '../components/ResumeOverview';
import SharedResume from '../components/SharedResume';
import SharedCritique from '../components/SharedCritique';
import CritiqueDetail from "./MyCritiques/CritiqueDetail";
/* eslint-enable */
import CritiqueOthers from './MyCritiques/CritiqueOthers';
import NotFound from './NotFound';
import InternalServerError from './InternalServerError';
import VerifyEmail from '../components/VerifyEmail';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import About from './About';
import FAQs from './FAQs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';

import { PATHS } from '../constants';

import '../shared/global.css';
import UnsubscribeEmail from '../components/UnsubscribeEmail';

const App = props => (
  <div className="mainWrapper">
    <Header location={props.location} />
    <div className="mainBody">
      <Switch>
        <Route component={Login} exact path={PATHS.LOGIN} />
        <Route component={Signup} exact path={PATHS.SIGNUP} />
        <Route component={LandingPage} exact path={PATHS.HOME} />
        <Route component={SharedResume} exact path={PATHS.SHARED_RESUME} />
        <Route component={SharedCritique} exact path={PATHS.SHARED_CRITIQUE} />
        <Route component={PublicProfile} exact path={PATHS.PUBLIC_PROFILE} />
        <AuthRoute component={MyResumes} exact path={PATHS.RESUMES} />
        <AuthRoute
          component={ResumeOverview}
          exact
          path={PATHS.RESUME_OVERVIEW}
        />
        <Route component={PublicPool} exact path={PATHS.PUBLIC_POOL} />
        <Route
          component={PooledResume}
          exact
          path={PATHS.POOLED_RESUME}
        />
        <AuthRoute
          component={PooledCritique}
          exact
          path={PATHS.POOLED_CRITIQUE}
        />
        <AuthRoute component={CritiqueOthers} exact path={PATHS.CRITIQUES} />
        <AuthRoute
          component={CritiqueDetail}
          exact
          path={PATHS.CRITIQUE_DETAIL}
        />
        <AuthRoute location={props.location} component={Settings} exact path={PATHS.SETTINGS} />
        <Route component={VerifyEmail} exact path={PATHS.VERIFY_EMAIL} />
        <Route component={UnsubscribeEmail} exact path={PATHS.UNSUBSCRIBE_EMAIL} />
        <Route component={ForgotPassword} exact path={PATHS.FORGOT_PASSWORD} />
        <Route component={ResetPassword} exact path={PATHS.RESET_PASSWORD} />
        <Route component={About} exact path={PATHS.ABOUT} />
        <Route component={FAQs} exact path={PATHS.FAQS} />
        <Route component={TermsAndConditions} exact path={PATHS.TERMS_AND_CONDITIONS} />
        <Route component={PrivacyPolicy} exact path={PATHS.PRIVACY_POLICY} />
        <Route
          component={InternalServerError}
          exact
          path={PATHS.SERVER_ERROR}
        />
        <Route component={NotFound} path="*" />
      </Switch>
    </div>
    <Footer />
  </div>
);

App.propTypes = {
  location: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default withRouter(App);
