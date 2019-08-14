import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
  FormGroup,
  ControlLabel,
  Button,
  FormControl,
  Glyphicon,
  InputGroup,
} from 'react-bootstrap';
import Switch from 'react-bootstrap-switch';
import RezModal from '../Modal';
import {
  PUBLIC, PRIVATE, UWATERLOO_DOMAIN,
} from '../../constants';

import '../../../node_modules/react-bootstrap-switch/dist/css/bootstrap3/react-bootstrap-switch.min.css';

const { FRONTEND_URI } = process.env;


class ShareResumeModal extends React.Component {
  constructor(props) {
    super(props);

    const isPrivatePool = !(props.pool === PUBLIC || props.pool === UWATERLOO_DOMAIN || props.pool === '');

    this.state = {
      notes: props.notesForCritiquer,
      pool: isPrivatePool ? PRIVATE : props.pool,
      privatePool: isPrivatePool ? props.pool : '',
    };

    this.sharedResumeUrl = React.createRef();
    this.props.clearPoolChangeError();
  }

  copyToClipboard() {
    this.sharedResumeUrl.select();
    document.execCommand('copy');
  }

  selectLink() {
    this.sharedResumeUrl.select();
  }

  editPool() {
    const pool = this.state.pool === PRIVATE ? this.state.privatePool : this.state.pool;
    const poolIsInstitution = !(this.state.pool === PRIVATE || this.state.pool === PUBLIC);
    this.props.editPool(pool, poolIsInstitution);
  }

  updatePool(pool) {
    this.setState({
      pool,
      privatePool: '',
    });
  }

  updatePrivatePool(privatePool) {
    this.setState({
      privatePool,
    });
  }

  render() {
    const isPrevPrivate = !(
      this.props.pool === PUBLIC
      || this.props.pool === UWATERLOO_DOMAIN
      || this.props.pool === ''
    );
    const isCurrPrivate = this.state.pool === PRIVATE;

    return (
      <div>
        <FormGroup>
          <ControlLabel>Leave a note for your critiquer!</ControlLabel>
          <FormControl
            maxLength="1024"
            componentClass="textarea"
            value={this.state.notes}
            onChange={e => this.setState({
              notes: e.target.value,
            })
            }
          />
          {this.props.notesForCritiquer !== this.state.notes
              && (
              <Button
                className="highlight-btn"
                onClick={() => this.props.updateNotes(this.state.notes)}
              >
                  Update Notes
              </Button>
              )
          }
        </FormGroup>

        <FormGroup>
          <ControlLabel>Show My Resume to</ControlLabel>
          <select
            className="form-control pool-selector"
            onChange={e => this.updatePool(e.target.value)}
            value={this.state.pool}
          >
            <option value={PUBLIC}>The entire world</option>
            {this.props.institutions.includes(UWATERLOO_DOMAIN)
            && <option value={UWATERLOO_DOMAIN}>UWaterloo students only</option>
            }
            <option value="">Nobody</option>
            <option value={PRIVATE}>A private group</option>
          </select>
          {this.state.pool === PRIVATE
            && (
            <div className="link-sharing">
              <ControlLabel>Private Group ID</ControlLabel>
              <FormControl
                type="text"
                maxLength="253"
                value={this.state.privatePool}
                onChange={e => this.updatePrivatePool(e.target.value)}
              />
            </div>
            )
          }
          {(
            (isPrevPrivate && !isCurrPrivate)
            || (!isPrevPrivate && isCurrPrivate && this.state.privatePool !== '')
            || (isPrevPrivate && isCurrPrivate && this.state.privatePool !== this.props.pool
              && this.state.privatePool !== '')
            || (!isPrevPrivate && !isCurrPrivate && this.state.pool !== this.props.pool)
          )
            && (
            <Button
              className="highlight-btn"
              onClick={() => this.editPool()}
            >
                Update Pool Visibility
            </Button>
            )
          }
        </FormGroup>

        {this.props.poolChangeError && (
          <Alert className="alert" bsStyle="danger">
            {this.props.poolChangeError}
          </Alert>
        )}

        <FormGroup className="resume-sharing-toggle">
          <div className="resume-sharing-toggle-text">Enable Link Sharing</div>
          <Switch
            name="linkToggle"
            onColor="rezq-on"
            offColor="rezq-off"
            defaultValue={this.props.isLinkSharingEnabled}
            onChange={(_, on) => {
              if (on) {
                this.props.enableLinkSharing(this.state);
              } else {
                this.props.disableLinkSharing();
              }
            }}
          />
        </FormGroup>

        {this.props.isLinkSharingEnabled
          && document.queryCommandSupported('copy') && (
            <FormGroup>
              <div className="link-sharing">
                <ControlLabel>
                  Give this link to someone you want a critique from!
                </ControlLabel>
                <InputGroup>
                  <FormControl
                    readOnly
                    type="text"
                    inputRef={(ref) => { this.sharedResumeUrl = ref; }}
                    onClick={() => this.selectLink()}
                    value={`${FRONTEND_URI}/shared-resume/${this.props.resumeToken}`}
                  />
                  <InputGroup.Button>
                    <Button
                      onClick={() => this.copyToClipboard()}
                    >
                      <Glyphicon glyph="copy" />
                    </Button>
                  </InputGroup.Button>
                </InputGroup>
              </div>
            </FormGroup>
        )
        }
      </div>
    );
  }
}

ShareResumeModal.defaultProps = {
  resumeToken: '',
  poolChangeError: null,
};

ShareResumeModal.propTypes = {
  resumeToken: PropTypes.string,
  notesForCritiquer: PropTypes.string.isRequired,
  isLinkSharingEnabled: PropTypes.bool.isRequired,
  pool: PropTypes.string.isRequired,
  institutions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  updateNotes: PropTypes.func.isRequired,
  enableLinkSharing: PropTypes.func.isRequired,
  disableLinkSharing: PropTypes.func.isRequired,
  editPool: PropTypes.func.isRequired,
  clearPoolChangeError: PropTypes.func.isRequired,
  poolChangeError: PropTypes.string,
};

export default RezModal(ShareResumeModal);
