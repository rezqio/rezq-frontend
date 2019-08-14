import { combineReducers } from 'redux';
import map from 'lodash/map';
import filter from 'lodash/filter';
import { undoable } from './undoable';

const annotations = (state = [], action) => {
  switch (action.type) {
    case 'SET_ANNOTATIONS':
      return action.annotations;
    case 'SET_ANNOTATIONS_EDITED':
      return state;
    case 'ADD_ANNOTATION':
      return [...state, action.annotation];
    case 'EDIT_ANNOTATION':
      return map(
        state,
        annotation => (annotation.uuid === action.annotationId
          && (annotation.x !== action.annotation.x
            || annotation.y !== action.annotation.y)
          ? action.annotation
          : annotation),
      );
    case 'DELETE_ANNOTATION':
      return filter(state, (annotation) => {
        // delete comments that belong to the annotation
        if (annotation.class === 'Comment') {
          return annotation.annotation !== action.annotationId;
        }
        return annotation.uuid !== action.annotationId;
      });
    case 'ADD_COMMENT':
      return [...state, action.comment];
    case 'DELETE_COMMENT':
      return filter(state, comment => comment.uuid !== action.commentId);
    case 'EDIT_COMMENT':
      return map(state, (annotation) => {
        if (annotation.class === 'Comment'
            && annotation.annotation === action.annotationId) {
          return {
            ...annotation,
            content: action.comment,
          };
        }
        return annotation;
      });
    default:
      return state;
  }
};

const undoableAnnotations = undoable(annotations);

const pdf = (state = { pageNumber: 1, pdfLoaded: false }, action) => {
  switch (action.type) {
    case 'SET_PAGE_NUMBER':
      return {
        ...state,
        pageNumber: action.pageNumber,
      };
    case 'SET_PDF_LOADED':
      return {
        ...state,
        pdfLoaded: action.loaded,
      };
    default:
      return state;
  }
};

export default combineReducers({
  pdf,
  undoableAnnotations,
});
