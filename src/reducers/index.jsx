import { combineReducers } from 'redux';
import login from '../containers/Login/reducers/login';
import signup from '../containers/Signup/reducers/signup';
import pdf from '../components/Pdf/reducers/pdf';
import critique from '../components/CritiqueView/reducers/critiqueview';
import sharedcritique from '../components/SharedCritique/reducers/sharedcritique';
import myresumes from '../containers/MyResumes/reducers/myresumes';
import resumeoverview from '../components/ResumeOverview/reducers/resumeoverview';
import sharedresume from '../components/SharedResume/reducers/sharedresume';
import currentcritique from '../components/CurrentCritique/reducers/currentcritique';
import pastcritiques from '../components/PastCritiques/reducers/pastcritiques';
import settings from '../containers/Settings/reducers/settings';
import verifyemail from '../components/VerifyEmail/reducers/verifyemail';
import unsubscribeemail from '../components/UnsubscribeEmail/reducers/unsubscribeemail';
import forgotpassword from '../containers/ForgotPassword/reducers/forgotpassword';
import resetpassword from '../containers/ResetPassword/reducers/resetpassword';
import publicpool from '../containers/PublicPool/reducers/publicpool';
import publicprofile from '../components/PublicProfile/reducers/publicprofile';
import pooledresume from '../components/PooledResume/reducers/pooledresume';
import pooledcritique from '../components/PooledCritique/reducers/pooledcritique';
import reportmodal from '../components/ReportModal/reducers/reportmodal';

export default combineReducers({
  login,
  signup,
  reportmodal,
  pdf,
  critique,
  myresumes,
  resumeoverview,
  sharedresume,
  sharedcritique,
  currentcritique,
  pastcritiques,
  settings,
  verifyemail,
  unsubscribeemail,
  forgotpassword,
  resetpassword,
  publicpool,
  publicprofile,
  pooledresume,
  pooledcritique,
});
