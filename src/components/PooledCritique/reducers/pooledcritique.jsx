import { appendCommentToSet } from '../../PooledResume/reducers/pooledresume';

const initialState = {
  loading: true,
  pooledCritique: {},
  error: null,
  saved: false,
  submitted: false,
  hasUnsavedChanges: false,
};

export default function pooledCritique(state = initialState, action) {
  switch (action.type) {
    case 'COMMENT_VIA_POOLED_CRITIQUE':
      return {
        ...state,
        pooledCritique: {
          ...state.pooledCritique,
          pooledcritiquecommentSet: appendCommentToSet(
            state.pooledCritique.pooledcritiquecommentSet,
            action.comment.comment,
          ),
        },
      };
    case 'LOAD_POOLED_CRITIQUE':
      return {
        ...state,
        pooledCritique: {},
        loading: true,
        error: null,
        hasUnsavedChanges: false,
        saved: false,
      };
    case 'SET_POOLED_CRITIQUE':
      return {
        ...state,
        pooledCritique: action.pooledCritique,
        loading: false,
        error: null,
        saved: false,
      };
    case 'UPDATE_SUMMARY':
      return {
        ...state,
        pooledCritique: {
          ...state.pooledCritique,
          summary: action.summary,
        },
        saved: false,
        hasUnsavedChanges: true,
      };
    case 'RESET_EDIT':
      return {
        ...state,
        error: null,
        saved: false,
        hasUnsavedChanges: false,
      };
    case 'EDIT_ERRORED':
      return {
        ...state,
        error: action.error,
        hasUnsavedChanges: true,
      };
    case 'EDIT_SAVED':
      return {
        ...state,
        saved: true,
        hasUnsavedChanges: false,
      };
    case 'EDIT_SUBMITTED':
      return {
        ...state,
        submitted: true,
      };
    default:
      return state;
  }
}
