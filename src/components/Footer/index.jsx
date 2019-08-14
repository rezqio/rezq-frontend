import React, { Component } from 'react';
import {
  Glyphicon,
} from 'react-bootstrap';
import A from '../A';
import Wrapper from './Wrapper';
import ReportModal from '../ReportModal';
import { PATHS } from '../../constants';

import './footer.css';

class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReportModal: false,
    };
  }

  openReportModal() {
    this.setState({
      showReportModal: true,
    });
  }

  closeReportModal() {
    this.setState({
      showReportModal: false,
    });
  }

  render() {
    return (
      <Wrapper>
        <ReportModal
          title="Give Feedback"
          showModal={this.state.showReportModal}
          closeModal={() => this.closeReportModal()}
        />
        <A href={PATHS.ABOUT}>About</A>
        <A href={PATHS.FAQS}>FAQs</A>
        <A href={PATHS.TERMS_AND_CONDITIONS}>Terms</A>
        <A href={PATHS.PRIVACY_POLICY}>Privacy</A>
        <span
          className="clickable report-button"
          onClick={() => this.openReportModal()}
          role="button"
          tabIndex="0"
        >
          <Glyphicon
            glyph="comment"
          />
          {' '}
          Give Feedback
        </span>
        <span className="copyRight">Copyright &copy; 2019 RezQ.io</span>
      </Wrapper>
    );
  }
}

export default Footer;
