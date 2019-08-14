import find from 'lodash/find';

export const setPageNumber = pageNumber => ({
  type: 'SET_PAGE_NUMBER',
  pageNumber,
});

export const setPdfLoaded = loaded => ({
  type: 'SET_PDF_LOADED',
  loaded,
});

export const setAnnotations = annotations => ({
  type: 'SET_ANNOTATIONS',
  annotations,
});

export const addAnnotation = annotation => ({
  type: 'ADD_ANNOTATION',
  annotation,
});

export const editAnnotation = (annotationId, annotation) => ({
  type: 'EDIT_ANNOTATION',
  annotationId,
  annotation,
});

export const deleteAnnotation = annotationId => ({
  type: 'DELETE_ANNOTATION',
  annotationId,
});

export const addComment = comment => ({
  type: 'ADD_COMMENT',
  comment,
});

export const deleteComment = commentId => ({
  type: 'DELETE_COMMENT',
  commentId,
});

export const editComment = (annotationId, comment) => ({
  type: 'EDIT_COMMENT',
  annotationId,
  comment,
});

export const undoAnnotation = () => ({
  type: 'UNDO',
});

export const redoAnnotation = () => ({
  type: 'REDO',
});

export const resetAnnotationHistory = () => ({
  type: 'RESET_HISTORY',
});

export const showAnnotations = () => ({
  type: 'SHOW_ANNOTATIONS',
});

export const hideAnnotations = () => ({
  type: 'HIDE_ANNOTATIONS',
});

export function getAnnotations() {
  return (dispatch, getState) => getState().pdf.undoableAnnotations.present;
}

export function getAnnotation(annotationId) {
  return (dispatch, getState) => find(
    getState().pdf.undoableAnnotations.present,
    annotation => annotation.uuid === annotationId,
  );
}

export function getComment(annotationId) {
  return (dispatch, getState) => find(
    getState().pdf.undoableAnnotations.present,
    annotation => annotation.class === 'Comment' && annotation.annotation === annotationId,
  );
}
