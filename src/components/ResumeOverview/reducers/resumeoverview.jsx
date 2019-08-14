import filter from 'lodash/filter';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';
import {
  appendCommentToSet,
  getVoteChanged,
} from '../../PooledResume/reducers/pooledresume';

const initialState = {
  resume: null,
  resumeToken: null,
  loading: true,
  editResumeError: null,
  poolChangeError: null,
};

export default function resumeoverview(state = initialState, action) {
  switch (action.type) {
    case 'COMMENT_VIA_RESUME_OVERVIEW':
      return {
        ...state,
        resume: {
          ...state.resume,
          pooledcritiqueSet: map(state.resume.pooledcritiqueSet, (critique) => {
            if (critique.id === action.comment.id) {
              return {
                ...critique,
                pooledcritiquecommentSet: appendCommentToSet(
                  critique.pooledcritiquecommentSet,
                  action.comment.comment,
                ),
              };
            }
            return critique;
          }),
        },
        editResumeError: null,
      };
    case 'VOTE_VIA_RESUME_OVERVIEW':
      return {
        ...state,
        resume: {
          ...state.resume,
          pooledcritiqueSet: map(state.resume.pooledcritiqueSet, (critique) => {
            if (critique.id === action.upvote.id) {
              return {
                ...critique,
                upvotes: critique.upvotes
                  + getVoteChanged(
                    state.resume.pooledCritiquesUserUpvoted[action.upvote.id],
                    action.upvote.vote,
                  ),
              };
            }
            return critique;
          }),
          pooledCritiquesUserUpvoted: {
            ...state.resume.pooledCritiquesUserUpvoted,
            [action.upvote.id]: action.upvote.vote,
          },
        },
        editResumeError: null,
      };
    case 'SET_INSTITUTION_VIA_RESUME_OVERVIEW':
      return {
        ...state,
        institutions: action.institutions,
      };
    case 'LOAD_RESUME':
      return {
        ...state,
        resume: null,
        loading: true,
        editResumeError: null,
      };
    case 'SET_RESUME':
      return {
        ...state,
        resume: {
          ...action.resume,
          pooledcritiqueSet: orderBy(
            filter(action.resume.pooledcritiqueSet, c => c.submitted === true),
            ['upvotes'],
            ['desc'],
          ),
          pooledCritiquesUserUpvoted: JSON.parse(action.resume.pooledCritiquesUserUpvoted),
        },
        loading: false,
        editResumeError: null,
      };
    case 'SET_RESUME_TOKEN':
      return {
        ...state,
        resumeToken: action.resumeToken,
        loading: false,
        editResumeError: null,
      };
    case 'SET_LINK_SHARING_STATUS':
      return {
        ...state,
        resume: {
          ...state.resume,
          linkEnabled: action.isLinkSharingEnabled,
        },
        loading: false,
        editResumeError: null,
      };
    case 'SET_POOL_STATUS':
      return {
        ...state,
        resume: {
          ...state.resume,
          pool: action.pool,
        },
        loading: false,
        editResumeError: null,
        poolChangeError: null,
      };
    case 'SET_RESUME_NOTES':
      return {
        ...state,
        resume: {
          ...state.resume,
          notesForCritiquer: action.notes,
        },
        editResumeError: null,
      };
    case 'SET_RESUME_EDIT_CHANGES':
      return {
        ...state,
        resume: {
          ...state.resume,
          name: action.resumeDetails.name,
          description: action.resumeDetails.description,
          industries: action.resumeDetails.industries,
        },
        loading: false,
        editResumeError: null,
      };
    case 'EDIT_RESUME_ERROR':
      return {
        ...state,
        editResumeError: action.error,
      };
    case 'POOL_CHANGE_ERROR':
      return {
        ...state,
        poolChangeError: action.error,
      };
    case 'CLEAR_POOL_CHANGE_ERROR':
      return {
        ...state,
        poolChangeError: '',
      };
    default:
      return state;
  }
}
