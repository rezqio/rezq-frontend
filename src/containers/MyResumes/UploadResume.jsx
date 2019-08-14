import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Alert, Button, FormGroup, FormControl, ControlLabel,
} from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import RezModal from '../../components/Modal';
import IndustrySelector from '../../components/IndustrySelector';
import {
  MY_RESUME_LIMITS, PUBLIC, PRIVATE, UWATERLOO_DOMAIN,
} from '../../constants';
import './styles/myresumes.css';

class UploadResume extends Component {
  constructor(props) {
    super(props);

    this.state = {
      resumeName: '',
      resumeDescription: '',
      resumeFile: null,
      resumeThumbnail: null,
      resumeIndustries: '',
      dropzoneError: false,
      pool: PUBLIC,
      privatePool: '',
    };
    this.dropzoneRef = null;
    this.defaultIndustries = props.defaultIndustries;
    if (this.defaultIndustries) {
      this.state.resumeIndustries = this.defaultIndustries;
    }
  }

  onDropFile(files) {
    this.setState({
      resumeFile: files[0],
    });

    const blob = new Blob([files[0]]);

    const fileReader = new FileReader();
    fileReader.onload = ((event) => {
      const arrayBuffer = event.target.result;
      const rawData = new Uint8Array(arrayBuffer);

      const loadingTask = PDFJS.getDocument(rawData); // eslint-disable-line no-undef
      loadingTask.promise.then(((pdfDocument) => {
        // Get the first page.
        pdfDocument.getPage(1).then(((page) => {
          // Render the page on a canvas with 100% scale.
          const viewport = page.getViewport(1.0);
          const canvas = document.getElementById('upload-canvas');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          const canvasContext = canvas.getContext('2d');
          const renderContext = {
            canvasContext,
            viewport,
          };

          const renderTask = page.render(renderContext);
          renderTask.promise.then((() => {
            this.setState({
              resumeThumbnail: canvas,
            });
          }));
        }));
      }));
    });
    fileReader.readAsArrayBuffer(blob);
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

  updateIndustries(industries) {
    this.setState({
      resumeIndustries: industries,
    });
  }

  submitResume() {
    this.props.submit(this.state);
  }

  render() {
    const { uploadError } = this.props;

    return (
      <div>
        <FormGroup>
          <ControlLabel>Resume Name</ControlLabel>
          <FormControl
            type="text"
            maxLength="32"
            value={this.state.resumeName}
            onChange={e => this.setState({
              resumeName: e.target.value,
            })
            }
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Description</ControlLabel>
          <FormControl
            type="text"
            maxLength="256"
            value={this.state.resumeDescription}
            onChange={e => this.setState({
              resumeDescription: e.target.value,
            })
            }
          />
        </FormGroup>
        <FormGroup>
          <ControlLabel>Show My Resume to</ControlLabel>
          <select
            className="form-control pool-selector"
            onChange={(e) => {
              this.setState({ pool: e.target.value });
            }}
            value={this.state.pool}
          >
            <option value={PUBLIC}>The entire world</option>
            {this.props.institutions.includes(UWATERLOO_DOMAIN)
            && <option value={UWATERLOO_DOMAIN}>UWaterloo students only</option>
            }
            <option value="">Nobody</option>
            <option value={PRIVATE}>A private group</option>
          </select>
        </FormGroup>
        {this.state.pool === PRIVATE
          && (
          <FormGroup>
            <ControlLabel>Private Group ID</ControlLabel>
            <FormControl
              type="text"
              maxLength="253"
              value={this.state.privatePool}
              onChange={e => this.setState({
                privatePool: e.target.value,
              })
              }
            />
          </FormGroup>
          )
        }
        <FormGroup>
          <ControlLabel>Industries</ControlLabel>
          <IndustrySelector
            selected={this.defaultIndustries}
            onChange={industries => this.updateIndustries(industries)}
          />
        </FormGroup>
        <Dropzone
          ref={(node) => {
            this.dropzoneRef = node;
          }}
          accept="application/pdf"
          multiple={false}
          className="dropzone"
          maxSize={MY_RESUME_LIMITS.MAX_UPLOAD_FILE_SIZE}
          onDrop={files => this.onDropFile(files)}
          onDropAccepted={() => this.onDropAccepted()}
          onDropRejected={() => this.onDropRejected()}
        >
          {this.state.resumeFile ? (
            <div>
              <p><i>{this.state.resumeFile.name}</i></p>
              <p>
                Drag &amp; drop a new file or&nbsp;
                <span role="link" tabIndex={0} className="link-span">click to change</span>
              </p>
            </div>
          ) : (
            <div>
              <p>
                Drag &amp; drop file or&nbsp;
                <span role="link" tabIndex={0} className="link-span">click to choose file</span>
              </p>
              <p>(Maximum file upload size is 5MB)</p>
            </div>
          )}
        </Dropzone>
        {uploadError && (
          <Alert className="alert" bsStyle="danger">
            {uploadError}
          </Alert>
        )}
        {this.state.dropzoneError && (
          <Alert className="alert" bsStyle="danger">
            Only .PDF files under 5MB are supported
          </Alert>
        )}
        <Button
          className="highlight-btn"
          disabled={this.props.uploadingResume}
          onClick={() => {
            this.submitResume(this.state);
          }}
        >
          Upload
        </Button>
        <canvas id="upload-canvas" />
      </div>
    );
  }
}

UploadResume.defaultProps = {
  uploadError: null,
};

UploadResume.propTypes = {
  submit: PropTypes.func.isRequired,
  uploadError: PropTypes.string,
  defaultIndustries: PropTypes.string.isRequired,
  institutions: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  uploadingResume: PropTypes.bool.isRequired,
};

export default RezModal(UploadResume);
