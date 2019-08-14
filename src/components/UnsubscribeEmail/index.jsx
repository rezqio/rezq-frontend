import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { unsubscribeEmail, setUnsubscribeResult } from './actions/Unsubscribeemail';

class UnsubscribeEmail extends Component {
  componentDidMount() {
    const { search } = this.props.location; // eslint-disable-line react/prop-types
    const params = new URLSearchParams(search);
    const unsubscribeToken = params.get('token');

    if (unsubscribeToken) {
      this.props.unsubscribeEmail(unsubscribeToken);
      return;
    }

    this.props.setUnsubscribeResult('Your unsubscribe link is invalid or has expired.');
  }

  render() {
    const { unsubscribeResult } = this.props;
    return (
      <div className="section-container">
        <div className="section-body">
          <div className="section-centered">
            {unsubscribeResult
              ? <div>{unsubscribeResult}</div>
              : <div>Unsubscribing from email notifications ...</div>
                      }
          </div>
        </div>
      </div>
    );
  }
}

UnsubscribeEmail.propTypes = {
  unsubscribeResult: PropTypes.string.isRequired,
  unsubscribeEmail: PropTypes.func.isRequired,
  setUnsubscribeResult: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  unsubscribeResult: state.unsubscribeemail.unsubscribeResult,
});

const mapDispatchToProps = {
  unsubscribeEmail,
  setUnsubscribeResult,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UnsubscribeEmail);
