import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { verifyEmail, setVerifyResult } from './actions/Verifyemail';

class VerifyEmail extends Component {
  componentDidMount() {
    const { search } = this.props.location; // eslint-disable-line react/prop-types
    const params = new URLSearchParams(search);
    const verificationToken = params.get('token');

    if (verificationToken) {
      this.props.verifyEmail(verificationToken);
      return;
    }

    this.props.setVerifyResult('Your verification link is invalid or has expired.');
  }

  render() {
    const { verifyResult } = this.props;
    return (
      <div className="section-container">
        <div className="section-body">
          <div className="section-centered">
            {verifyResult
              ? <div>{verifyResult}</div>
              : <div>Verifying your email ...</div>
                      }
          </div>
        </div>
      </div>
    );
  }
}

VerifyEmail.propTypes = {
  verifyResult: PropTypes.string.isRequired,
  verifyEmail: PropTypes.func.isRequired,
  setVerifyResult: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  verifyResult: state.verifyemail.verifyResult,
});

const mapDispatchToProps = {
  verifyEmail,
  setVerifyResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VerifyEmail);
