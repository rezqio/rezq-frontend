import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Glyphicon } from 'react-bootstrap';
import SignupButton from './SignupButton';
// import Landing1 from '../../assets/landing/1.svg';
// import Landing2 from '../../assets/landing/2.svg';
import Landing3 from '../../assets/landing/3.svg';
import LandingShowcase1 from '../../assets/landing/LandingShowcase1.png';
import LandingShowcase2 from '../../assets/landing/LandingShowcase2.png';
import LandingShowcase3 from '../../assets/landing/LandingShowcase3.png';
import './main.css';

const H1 = styled.h1`
  font-size: 30px;
  text-align: center;
  color: #292929;
  padding-top: 10px;
`;

class LandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.splash = React.createRef();

    this.splashes = [];
    for (let i = 0; i < 4; i += 1) {
      this.splashes.push(React.createRef());
    }

    this.state = {
      scrolled: 0,
    };
  }

  getScroll(i) {
    return this.splashes[i] && this.splashes[i].current
      && this.splashes[i].current.offsetTop > this.state.scrolled;
  }

  setScroll() {
    const y = this.splash.current.scrollTop;
    this.setState({
      scrolled: y,
    });
  }

  scrolledToEnd() {
    return this.splash && this.splash.current
      && this.state.scrolled
      === this.splash.current.scrollHeight - this.splash.current.clientHeight;
  }

  render() {
    return (
      <div className="splash splash-padded pos-abs" ref={this.splash} onScroll={() => this.setScroll()}>
        <div className="cover-card">
          <div className="bubble">
            <H1>
        Everything you need
              <br />
        to perfect a resume.
            </H1>
            <div className="underline" />
            <p>

    RezQ is a community dedicated to making resume critiques easier and more effective!
            Sign up and upload your resume to get started.
            </p>
            <SignupButton isLoggedIn={this.props.isLoggedIn} />
            <div className="landing-float">
              <img className="landing" src={Landing3} alt="pencil" />
            </div>
          </div>
        </div>
        <div className="landing-card" ref={this.splashes[0]}>
          <div className="landing-content">
            <div className="landing-img">
              <img className="showcase-img" src={LandingShowcase1} alt="rezq showcase resume upload" />
            </div>
            <div className="landing-space" />
            <div className="landing-text">
              <div className="landing-header">
                {'Make your resume'}
                <br />
                {'the best it can be'}
              </div>
              <div className="landing-description">
                {'Iterate and improve your resume by uploading up to five different versions. Tag them by industry to receive specialized feedback.'}
              </div>
            </div>
          </div>
        </div>
        <div className="landing-card" ref={this.splashes[1]}>
          <div className="landing-content">
            <div className="landing-text">
              <div className="landing-header">
                {'Take advantage of our powerful and easy-to-use annotation suite'}
              </div>
              <div className="landing-description">
                {'RezQ currently supports comments, highlighting, free draw, and other features to make critiquing fast and effective.'}
              </div>
            </div>
            <div className="landing-space" />
            <div className="landing-img">
              <img className="showcase-img" src={LandingShowcase2} alt="rezq showcase annotation" />
            </div>
          </div>
        </div>
        <div className="landing-card" ref={this.splashes[2]}>
          <div className="landing-content">
            <div className="landing-img">
              <img className="showcase-img" src={LandingShowcase3} alt="rezq showcase pool critiques" />
            </div>
            <div className="landing-space" />
            <div className="landing-text">
              <div className="landing-header">
                {'Build the best resume possible with our'}
                <br />
                {'public resume pool'}
              </div>
              <div className="landing-description">
                {'We believe fostering a collaborative community is key towards professional development. That is why every RezQ user has access to critiques and feedback.'}
              </div>
            </div>
          </div>
        </div>
        <div className="back-card" ref={this.splashes[3]}>
          <H1 className="back-card-text">
      What are you waiting for?
            <br />
            <br />
      Join now and be a part of our community!
            <br />
          </H1>
          <SignupButton isLoggedIn={this.props.isLoggedIn} />
        </div>
        <div className="scroll-arrow">
          <button
            type="button"
            className="btn btn-link"
            onClick={() => {
              if (this.scrolledToEnd()) {
                this.splash.current.scrollTop = 0;
                return;
              }
              for (let i = 0; i < 4; i += 1) {
                if (this.getScroll(i)) {
                  this.splashes[i].current.scrollIntoView();
                  break;
                }
              }
            }}
          >
            <Glyphicon
              glyph="chevron-down"
              className={this.scrolledToEnd() ? 'scroll-arrow-glyphicon-rotated' : 'scroll-arrow-glyphicon'}
            />
          </button>
        </div>
      </div>

    );
  }
}

LandingPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.login.session,
});

export default connect(mapStateToProps)(LandingPage);
