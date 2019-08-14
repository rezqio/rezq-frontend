import React, { Component } from 'react';
import Pagination from 'react-js-pagination';
import PropTypes from 'prop-types';
import PDFJSAnnotate from 'pdf-annotate.js';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import * as Mousetrap from 'mousetrap';

import {
  Button,
  FormGroup,
  FormControl,
  Overlay,
  OverlayTrigger,
  Tooltip,
  Glyphicon,
} from 'react-bootstrap';
import store from '../../index';
import {
  getAnnotations,
  getAnnotation,
  addAnnotation,
  editAnnotation,
  deleteAnnotation,
  setPageNumber,
  setPdfLoaded,
  setAnnotations,
  addComment,
  deleteComment,
  editComment,
  getComment,
  undoAnnotation,
  redoAnnotation,
  resetAnnotationHistory,
  showAnnotations,
  hideAnnotations,
} from './actions/Pdf';
import uuid from '../../utils/uuid';
import { makeCancelable } from '../../utils/helpers';

import './styles/pdf.css';
import './styles/pdf_viewer.css';
import './styles/toolbar.css';

require('pdfjs-dist/build/pdf');
require('pdfjs-dist/web/pdf_viewer');
const pdfjsWorker = require('pdfjs-dist/build/pdf.worker.min');

const pdfjsWorkerBlob = new Blob([pdfjsWorker]);
const pdfjsWorkerBlobURL = URL.createObjectURL(pdfjsWorkerBlob);

PDFJS.workerSrc = pdfjsWorkerBlobURL; // eslint-disable-line no-undef

const { UI } = PDFJSAnnotate;

const styles = () => ({
  message: {
    'font-size': '14px',
  },
});

const PdfStoreAdapter = new PDFJSAnnotate.StoreAdapter({
  getAnnotations(documentId, pageNumber) {
    return new Promise((resolve) => {
      const annotations = store
        .dispatch(getAnnotations())
        .filter(i => i.page === pageNumber && i.class === 'Annotation');

      resolve({
        documentId,
        pageNumber,
        annotations,
      });
    });
  },

  getAnnotation(documentId, annotationId) {
    return Promise.resolve(store.dispatch(getAnnotation(annotationId)));
  },

  addAnnotation(documentId, pageNumber, annotation) {
    return new Promise((resolve) => {
      /* eslint-disable no-param-reassign */
      annotation.class = 'Annotation';
      annotation.uuid = uuid();
      annotation.page = pageNumber;
      /* eslint-disable no-param-reassign */

      store.dispatch(addAnnotation(annotation));
      resolve(annotation);
    });
  },

  editAnnotation(documentId, annotationId, annotation) {
    return new Promise((resolve) => {
      store.dispatch(editAnnotation(annotationId, annotation));

      resolve(annotation);
    });
  },

  deleteAnnotation(documentId, annotationId) {
    return new Promise((resolve) => {
      store.dispatch(deleteAnnotation(annotationId));

      resolve(true);
    });
  },

  getComments(documentId, annotationId) {
    return new Promise((resolve) => {
      resolve(
        store
          .dispatch(getAnnotations())
          .filter(i => i.class === 'Comment' && i.uuid === annotationId),
      );
    });
  },

  addComment(documentId, annotationId, content) {
    return new Promise((resolve) => {
      const comment = {
        class: 'Comment',
        uuid: uuid(),
        annotation: annotationId,
        content,
      };

      store.dispatch(addComment(comment));
      resolve(comment);
    });
  },

  deleteComment(documentId, commentId) {
    return new Promise((resolve) => {
      store.dispatch(deleteComment(commentId));
      resolve(true);
    });
  },
});
PDFJSAnnotate.setStoreAdapter(PdfStoreAdapter);

class Pdf extends Component {
  constructor(props) {
    super(props);

    this.RENDER_OPTIONS = {
      documentId: this.props.filePath,
      pdfDocument: null,
      scale: 1,
      rotate: 0,
    };
    this.pages = [];
    this.pdfGetDocPromise = null;

    this.state = {
      numPages: 0,
      comment: '',
      oldComment: '',
      showComment: false,
      tool: 'cursor',
      showAnnotations: true,
    };

    this.onAnnotationClick = this.onAnnotationClick.bind(this);
    this.handleCloseComment = this.handleCloseComment.bind(this);

    this.commentTarget = null;
    this.pendingCommentAnnotation = null;
  }

  componentWillMount() {
    this.props.resetAnnotationHistory();
    const { annotations } = this.props;
    if (annotations) {
      this.props.setAnnotations(JSON.parse(annotations));
    }
    this.props.setPageNumber(1);
    this.props.setPdfLoaded(false);

    Mousetrap.bind(['ctrl+z', 'command+z'], this.onUndo.bind(this));
    Mousetrap.bind(['ctrl+shift+z', 'command+shift+z'], this.onRedo.bind(this));
  }

  componentDidMount() {
    this.initPdf();
    this.initEventListeners();
  }

  componentDidUpdate(prevProps, prevState) {
    const { canWrite, pageNumber, annotations } = this.props;
    if (prevProps.canWrite && !canWrite) {
      UI.disableEdit();
      UI.disableRect();
      UI.disablePoint();
    }
    if (prevProps.pageNumber !== pageNumber) {
      this.renderPage();
    }
    if (prevProps.annotations !== annotations) {
      if (annotations) {
        this.props.setAnnotations(JSON.parse(annotations));
      } else {
        this.props.setAnnotations([]);
      }
      UI.renderPage(pageNumber, this.RENDER_OPTIONS);
    }

    if (prevState.showComment && !this.state.showComment && this.pendingCommentAnnotation) {
      // setTimeout here to prevent flickering
      setTimeout(() => {
        this.showCommentAnnotation(this.pendingCommentAnnotation);
      }, 100);
    }
  }

  componentWillUnmount() {
    if (this.pdfGetDocPromise) {
      this.pdfGetDocPromise.cancel();
    }
    this.removeEventListeners();

    Mousetrap.unbind(['ctrl+z', 'command+z']);
    Mousetrap.unbind(['ctrl+shift+z', 'command+shift+z']);

    this.props.resetAnnotationHistory();
  }

  onUndo() {
    const { canUndo, pageNumber } = this.props;
    if (canUndo) {
      this.props.undoAnnotation();

      UI.renderPage(pageNumber, this.RENDER_OPTIONS);
    }
  }

  onRedo() {
    const { canRedo, pageNumber } = this.props;
    if (canRedo) {
      this.props.redoAnnotation();

      UI.renderPage(pageNumber, this.RENDER_OPTIONS);
    }
  }

  onToggleShowHide() {
    const { pageNumber } = this.props;

    if (!this.state.showAnnotations) {
      UI.enableEdit();

      this.setState({
        tool: 'cursor',
      });

      this.props.showAnnotations();
    } else {
      UI.disableEdit();
      UI.disableRect();
      UI.disablePoint();
      UI.disablePen();

      this.props.hideAnnotations();
    }

    UI.renderPage(pageNumber, this.RENDER_OPTIONS);

    this.setState(prevState => ({
      showAnnotations: !prevState.showAnnotations,
    }));
  }

  onSelectToolType(type) {
    UI.disableEdit();
    UI.disableRect();
    UI.disablePoint();
    UI.disablePen();

    switch (type) {
      case 'cursor':
        UI.enableEdit();
        break;
      case 'area':
      case 'highlight':
      case 'strikeout':
        UI.enableRect(type);
        break;
      case 'comment':
        UI.enablePoint();
        break;
      case 'draw':
        UI.enablePen();
        break;
      default:
        break;
    }

    this.setState({
      tool: type,
    });
  }

  onAnnotationClick(annotation) {
    if (this.state.tool === 'cursor'
      && annotation.getAttribute('data-pdf-annotate-type') === 'point') {
      if (this.state.showComment
        && this.commentTarget
        && this.commentTarget.getAttribute('data-pdf-annotate-id') !== annotation.getAttribute('data-pdf-annotate-id')) {
        if (this.state.comment) {
          this.saveComment();
          this.pendingCommentAnnotation = annotation;
        }
        return;
      }
      this.showCommentAnnotation(annotation);
    }
  }

  showCommentAnnotation(annotation) {
    const commentAnnotation = this.props.getComment(
      annotation.getAttribute('data-pdf-annotate-id'),
    );
    if (!commentAnnotation) {
      return;
    }
    const commentContent = commentAnnotation.content;
    this.commentTarget = annotation;
    this.pendingCommentAnnotation = null;

    this.setState({
      oldComment: commentContent,
      comment: commentContent,
      showComment: true,
    });
  }

  saveComment() {
    const { oldComment, comment } = this.state;
    if (oldComment !== comment) {
      const annotationId = this.commentTarget.getAttribute('data-pdf-annotate-id');

      if (comment) {
        this.props.editComment(annotationId, comment);
      } else {
        this.props.deleteAnnotation(annotationId);
        UI.renderPage(this.props.pageNumber, this.RENDER_OPTIONS);
      }
    }
  }

  handleCloseComment() {
    if (!this.pendingCommentAnnotation) {
      this.saveComment();
    }
    this.setState({
      oldComment: '',
      comment: '',
      showComment: false,
    });
  }

  initPdf() {
    /* eslint-disable no-undef */
    this.pdfGetDocPromise = makeCancelable(
      PDFJS.getDocument({
        url: this.RENDER_OPTIONS.documentId,
      }),
    );
    /* eslint-disable no-undef */

    this.pdfGetDocPromise.promise
      .then((pdf) => {
        this.RENDER_OPTIONS.pdfDocument = pdf;

        this.setState({
          numPages: pdf.pdfInfo.numPages,
        });
        this.props.setPdfLoaded(true);

        for (let i = 0; i < pdf.pdfInfo.numPages; i += 1) {
          const page = UI.createPage(i + 1);
          this.pages.push(page);
        }

        this.renderPage();
      })
      .catch((err) => {
        if (process.env.NODE_ENV !== 'production') {
          console.error(err);
        }
      });
  }

  initEventListeners() {
    UI.addEventListener('annotation:click', this.onAnnotationClick);
  }

  removeEventListeners() {
    UI.removeEventListener('annotation:click', this.onAnnotationClick);
  }

  renderPage() {
    const viewer = document.getElementById('viewer');
    if (viewer) {
      viewer.innerHTML = '';
      viewer.appendChild(this.pages[this.props.pageNumber - 1]);

      UI.renderPage(this.props.pageNumber, this.RENDER_OPTIONS);
      if (this.props.canWrite) {
        UI.enableEdit();
      } else {
        document.getElementsByClassName('textLayer')[0].style.pointerEvents = 'none';
      }
    }
  }

  render() {
    const undoTooltip = (
      <Tooltip id="undo-tooltip">
        Undo
      </Tooltip>
    );
    const redoTooltip = (
      <Tooltip id="redo-tooltip">
        Redo
      </Tooltip>
    );
    const showHideTooltip = (
      <Tooltip id="show-hide-tooltip">
        {this.state.showAnnotations ? 'Hide' : 'Show'}
        {' '}
Annotations
      </Tooltip>
    );
    const cursorTooltip = (
      <Tooltip id="cursor-tooltip">
        Cursor
      </Tooltip>
    );
    const rectangleTooltip = (
      <Tooltip id="rectangle-tooltip">
        Draw Rectangle
      </Tooltip>
    );
    const highlightTooltip = (
      <Tooltip id="highlight-tooltip">
        Highlight Text
      </Tooltip>
    );
    const strikeoutTooltip = (
      <Tooltip id="strikeout-tooltip">
        Strikeout Text
      </Tooltip>
    );
    const commentTooltip = (
      <Tooltip id="comment-tooltip">
        Add Comment
      </Tooltip>
    );
    const drawTooltip = (
      <Tooltip id="draw-tooltip">
        Draw
      </Tooltip>
    );

    return (
      <div className="viewer">
        <div className="pdf-container">
          <div className="pdf-panel">
            <div className="pdf-view">
              <div id="viewer" className="pdfViewer" />
            </div>
            {(this.state.numPages > 1)
              && (
              <div className="pdf-page-numbers-toolbar">
                <div className="pdf-pagination">
                  <Pagination
                    activePage={this.props.pageNumber}
                    activeClass="active-page"
                    totalItemsCount={this.state.numPages}
                    itemsCountPerPage={1}
                    prevPageText="<"
                    nextPageText=">"
                    hideFirstLastPages
                    pageRangeDisplayed={5}
                    onChange={e => this.props.setPageNumber(parseInt(e, 10))}
                  />
                </div>
              </div>
              )
            }
          </div>
          {this.props.canWrite && (
            <div className="toolbar">
              <OverlayTrigger placement="right" overlay={showHideTooltip}>
                <Button
                  className="show-hide"
                  type="button"
                  title={this.state.showAnnotations ? 'Hide' : 'Show'}
                  onClick={() => this.onToggleShowHide()}
                >
                  <Glyphicon
                    glyph={this.state.showAnnotations ? 'eye-close' : 'eye-open'}
                  />
                </Button>
              </OverlayTrigger>

              <OverlayTrigger placement="right" overlay={undoTooltip}>
                <Button
                  className="undo-redo"
                  type="button"
                  title="Button"
                  disabled={!this.props.canUndo || !this.state.showAnnotations}
                  onClick={() => this.onUndo()}
                >
                  <Glyphicon
                    className="icon-flipped"
                    glyph="share-alt"
                  />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="right" overlay={redoTooltip}>
                <Button
                  className="undo-redo"
                  type="button"
                  title="Button"
                  disabled={!this.props.canRedo || !this.state.showAnnotations}
                  onClick={() => this.onRedo()}
                >
                  <Glyphicon
                    glyph="share-alt"
                  />
                </Button>
              </OverlayTrigger>
              <div />
              <OverlayTrigger placement="right" overlay={cursorTooltip}>
                <Button
                  className={this.state.tool === 'cursor' ? 'active-tool' : ''}
                  type="button"
                  title="Cursor"
                  disabled={!this.state.showAnnotations}
                  onClick={() => this.onSelectToolType('cursor')}
                >
                  <Glyphicon
                    glyph="hand-up"
                  />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="right" overlay={rectangleTooltip}>
                <Button
                  className={this.state.tool === 'area' ? 'active-tool' : ''}
                  type="button"
                  title="Rectangle"
                  disabled={!this.state.showAnnotations}
                  onClick={() => this.onSelectToolType('area')}
                >
                  <Glyphicon
                    glyph="unchecked"
                  />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="right" overlay={highlightTooltip}>
                <Button
                  className={this.state.tool === 'highlight' ? 'active-tool' : ''}
                  type="button"
                  title="Highlight"
                  disabled={!this.state.showAnnotations}
                  onClick={() => this.onSelectToolType('highlight')}
                >
                  <Glyphicon
                    glyph="filter"
                  />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="right" overlay={strikeoutTooltip}>
                <Button
                  className={this.state.tool === 'strikeout' ? 'active-tool' : ''}
                  type="button"
                  title="Strikeout"
                  disabled={!this.state.showAnnotations}
                  onClick={() => this.onSelectToolType('strikeout')}
                >
                  <Glyphicon
                    glyph="text-width"
                  />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="right" overlay={commentTooltip}>
                <Button
                  className={this.state.tool === 'comment' ? 'active-tool' : ''}
                  type="button"
                  title="Comment Tool"
                  disabled={!this.state.showAnnotations}
                  onClick={() => this.onSelectToolType('comment')}
                >
                  <Glyphicon
                    glyph="comment"
                  />
                </Button>
              </OverlayTrigger>
              <OverlayTrigger placement="right" overlay={drawTooltip}>
                <Button
                  className={this.state.tool === 'draw' ? 'active-tool' : ''}
                  type="button"
                  title="Draw Tool"
                  disabled={!this.state.showAnnotations}
                  onClick={() => this.onSelectToolType('draw')}
                >
                  <Glyphicon
                    glyph="pencil"
                  />
                </Button>
              </OverlayTrigger>
            </div>
          )}
          <Overlay
            show={this.state.showComment}
            rootClose
            onHide={this.handleCloseComment}
            placement="bottom"
            container={this}
            target={() => this.commentTarget}
          >
            <Tooltip className="comment-tooltip" id="comment-tooltip">
              {this.props.canWrite
                ? (
                  <FormGroup>
                    <FormControl
                      componentClass="textarea"
                      rows={3}
                      value={this.state.comment}
                      onChange={e => this.setState({
                        comment: e.target.value,
                      })}
                    />
                  </FormGroup>
                )
                : <div className="comment-tooltip-readonly">{this.state.comment}</div>
              }
            </Tooltip>
          </Overlay>
        </div>
      </div>
    );
  }
}

Pdf.propTypes = {
  canWrite: PropTypes.bool.isRequired,
  filePath: PropTypes.string.isRequired,
  pageNumber: PropTypes.number.isRequired,
  annotations: PropTypes.string.isRequired,
  setAnnotations: PropTypes.func.isRequired,
  setPageNumber: PropTypes.func.isRequired,
  setPdfLoaded: PropTypes.func.isRequired,
  getComment: PropTypes.func.isRequired,
  editComment: PropTypes.func.isRequired,
  deleteAnnotation: PropTypes.func.isRequired,
  resetAnnotationHistory: PropTypes.func.isRequired,
  canUndo: PropTypes.func.isRequired,
  canRedo: PropTypes.func.isRequired,
  undoAnnotation: PropTypes.func.isRequired,
  redoAnnotation: PropTypes.func.isRequired,
  showAnnotations: PropTypes.func.isRequired,
  hideAnnotations: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  pageNumber: state.pdf.pdf.pageNumber,
  canUndo: state.pdf.undoableAnnotations.past.length > 0,
  canRedo: state.pdf.undoableAnnotations.future.length > 0,
});

const mapDispatchToProps = dispatch => bindActionCreators(
  {
    setPageNumber,
    setPdfLoaded,
    setAnnotations,
    getComment,
    editComment,
    deleteAnnotation,
    undoAnnotation,
    redoAnnotation,
    resetAnnotationHistory,
    showAnnotations,
    hideAnnotations,
  },
  dispatch,
);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(Pdf));
