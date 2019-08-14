import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import map from 'lodash/map';

import '../footerlinks.css';

const faqList = [
  [
    (<div>What does RezQ mean?</div>),
    (<div>The name comes from Resume Rescue.</div>),
  ],
  [
    (<div>How do I get started?</div>),
    (
      <div>
        <a href="/signup">Create an account</a>
        {' '}
        and get started by uploading
        your resume, or visit the Resume Pool to begin critiquing a resume!
      </div>
    ),
  ],
  [
    (
      <div>
        I uploaded a resume, how long will it take before it gets critiqued?
      </div>
    ),
    (
      <div>
        RezQ is a peer-to-peer service, so it will depend on the number of people
        that are interested in critiquing your resume. Usually, it will take 1-3 days.
      </div>
    ),
  ],
  [
    (
      <div>How can I send my resume directly to my friend for it to be critiqued?</div>
    ),
    (
      <div>
        Upload your resume to RezQ and then enable link sharing (click the Get Critiqued buttone).
        This will generate a unique link which you can share with your friends.
      </div>
    ),
  ],
  [
    (<div>How can I have my resume re-critiqued?</div>),
    (
      <div>
        After updating your resume, you can re-upload the updated version back into our
        system, and then you can request to have it critiqued again.
      </div>
    ),
  ],
  [
    (<div>How is my information secured?</div>),
    (
      <div>
        Resumes uploaded onto our system are stored on AWS S3, encrypted using AES-256.
        Your password is hashed with
        {' '}
        <a href="https://en.wikipedia.org/wiki/Argon2">argon2</a>
        , which was the winner of the Password Hashing Competition in July 2015. Our
        secret keys are rotated occasionally.
      </div>
    ),
  ],
  [
    (<div>How is my information shared?</div>),
    (
      <div>
        Your username and name may be publicly visible; if you wish to be anonymous,
        you may make up a fake name. Your email and 3rd party authentication information
        will not be shared publicly (or with any 3rd party). Your resumes are not shared
        unless you want them to be shared, either through link sharing (we do not publicize
        the links; only you will have them), or through Resume Pool. We (RezQ) do not look at
        your resumes, unless it is shared in Resume Pool or it is reported by someone else.
      </div>
    ),
  ],
  [
    (<div>How do I reset my password?</div>),
    (
      <div>
        Visit
        {' '}
        <a href="/forgot-password">https://rezq.io/forgot-password</a>
      </div>
    ),
  ],
  [
    (<div>How can I delete my data/account?</div>),
    (
      <div>
        You can delete any uploaded resumes through the My Resumes tab. This will
        remove it from S3, as well as all associated critiques and comments for that
        resume. We do not keep a copy - this is permanent.

        You can also delete your account in the Settings tab. This will delete all
        of your resumes and associated critiques (and their comments) permanently.
        However, your past critiques given to others and comments you leave on
        critiques will be kept.
      </div>
    ),
  ],
  [
    (<div>Are there any fees?</div>),
    (<div>Nope, everything is free!</div>),
  ],
  [
    (<div>I have an issue with the site, where can I report it? How can I contact a human?</div>),
    (
      <div>
        If you notice something is off, you can report the issue directly on our website
        through the &#34;Give Feedback&#34; button located at the bottom right.

        GitHub users can file an issue at
        {' '}
        <a href="https://github.com/rezqio/issues/issues">https://github.com/rezqio/issues/issues</a>
        .

        You can also message us directly through email at
        {' '}
        <a href="mailto:support@rezq.io">support@rezq.io</a>
        {' '}
        or
        {' '}
        <a href="mailto:bugs@rezq.io">bugs@rezq.io</a>
        .
      </div>
    ),
  ],
];

class FAQs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: -1,
    };
  }

  onRowClicked(index) {
    this.setState(prevState => ({
      expanded: (prevState.expanded === index) ? -1 : index,
    }));
  }

  render() {
    return (
      <div className="section-container">
        <div className="section-body" style={{ marginBottom: '100px' }}>
          <div className="section-content">

            <h1>Frequently Asked Questions</h1>
            <Divider style={{ marginBottom: '20px' }} />

            {map(faqList, (faq, index) => (
              <ExpansionPanel
                expanded={this.state.expanded === index}
                onChange={() => this.onRowClicked(index)}
              >
                <ExpansionPanelSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <h3>{faq[0]}</h3>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <div className="faq-text">{faq[1]}</div>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ))}

          </div>
        </div>
      </div>
    );
  }
}

export default FAQs;
