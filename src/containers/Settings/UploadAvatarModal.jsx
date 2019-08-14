import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import Slider from '@material-ui/lab/Slider';
import throttle from 'lodash/throttle';
import RezModal from '../../components/Modal';
import { MY_RESUME_LIMITS } from '../../constants';
import './styles/settings.css';

class UploadAvatarModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avatar: null,
      dropzoneError: false,
      zoomLevel: 1.25,
    };
    this.editor = null;
    this.dropzoneRef = null;
    this.uploadAvatar = throttle(this.uploadAvatar, 2000);
  }

  onDropAccepted() {
    this.setState({
      dropzoneError: false,
    });
  }

  onDropRejected() {
    this.setState({
      dropzoneError: true,
    });
  }

  onDropFile(files) {
    this.setState({
      avatar: files[0],
    });
  }

  onChangeZoom(zoomLevel) {
    this.setState({
      zoomLevel,
    });
  }

  uploadAvatar() {
    if (!this.state.avatar || !this.state.avatar.name) {
      this.props.submit(null);
      return;
    }
    const canvas = this.editor.getImageScaledToCanvas();
    const dataURL = canvas.toDataURL();
    this.props.submit(dataURL);
  }

  render() {
    this.uploadAvatar.cancel();
    return (
      <div>
        <Dropzone
          ref={(node) => {
            this.dropzoneRef = node;
          }}
          className="dropzone"
          accept="image/jpeg, image/png"
          multiple={false}
          maxSize={MY_RESUME_LIMITS.MAX_UPLOAD_FILE_SIZE}
          onDrop={files => this.onDropFile(files)}
          onDropAccepted={() => this.onDropAccepted()}
          onDropRejected={() => this.onDropRejected()}
        >
          {this.state.avatar ? (
            <div>
              <p><i>{this.state.avatar.name}</i></p>
              <p>
                Drag &amp; drop a new file or&nbsp;
                <span role="link" className="link-span">click to change</span>
              </p>
            </div>
          ) : (
            <div>
              <p>
                Drag &amp; drop file or&nbsp;
                <span role="link" className="link-span">click to choose file</span>
              </p>
              <p>(Only .jpeg and .png files are accepted)</p>
            </div>
          )}
        </Dropzone>
        <div className="dp-preview">
          <AvatarEditor
            ref={(ref) => {
              this.editor = ref;
            }}
            image={this.state.avatar}
            width={250}
            height={250}
            border={10}
            scale={this.state.zoomLevel}
          />
        </div>
        <div className="dp-zoom">
          Zoom:
          <Slider
            min={0.5}
            max={2}
            step={0.05}
            value={this.state.zoomLevel}
            onChange={(e, val) => this.onChangeZoom(val)}
          />
        </div>
        {this.props.uploadError && (
          <Alert className="alert" bsStyle="danger">
            {this.props.uploadError}
          </Alert>
        )}
        {this.state.dropzoneError && (
          <Alert className="alert" bsStyle="danger">
            Only .jpeg and .png files are accepted
          </Alert>
        )}
        <Button
          className="highlight-btn"
          onClick={() => this.uploadAvatar()}
        >
          Crop and Upload
        </Button>
      </div>
    );
  }
}

UploadAvatarModal.defaultProps = {
  uploadError: null,
};

UploadAvatarModal.propTypes = {
  submit: PropTypes.func.isRequired,
  uploadError: PropTypes.string,
};

export default RezModal(UploadAvatarModal);
