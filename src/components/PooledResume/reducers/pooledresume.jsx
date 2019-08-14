import filter from 'lodash/filter';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';

const initialState = {
  pooledResume: null,
  loading: true,
  error: null,
};

export function appendCommentToSet(commentSet, newComment) {
  return [
    ...commentSet.slice(0, commentSet.length),
    newComment,
  ];
}

export function getVoteChanged(prevVote, newVote) {
  if (newVote === true) {
    // Upvoted, +2 if previously downvoted, 1 otherwise
    return prevVote === false ? 2 : 1;
  }
  if (newVote === false) {
    // Downvoted, -2 if previously upvoted, -1 otherwise
    return prevVote === true ? -2 : -1;
  }
  // (null) Clearing vote, -1 if prev upvoted, +1 if prev downvoted
  return prevVote === true ? -1 : 1;
}

export default function pooledresume(state = initialState, action) {
  switch (action.type) {
    case 'COMMENT_VIA_POOLED_RESUME':
      return {
        ...state,
        pooledResume: {
          ...state.pooledResume,
          pooledcritiqueSet: map(state.pooledResume.pooledcritiqueSet, (critique) => {
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
      };
    case 'LOAD_POOLED_RESUME':
      return {
        ...state,
        pooledResume: null,
        loading: true,
        error: null,
      };
    case 'SET_POOLED_RESUME':
      return {
        ...state,
        pooledResume: {
          ...action.pooledResume,
          pooledcritiqueSet: orderBy(
            filter(action.pooledResume.pooledcritiqueSet, c => c.submitted === true),
            ['upvotes'],
            ['desc'],
          ),
          pooledCritiquesUserUpvoted: JSON.parse(action.pooledResume.pooledCritiquesUserUpvoted),
        },
        loading: false,
        error: null,
      };
    case 'UPVOTE_POOLED_RESUME':
      return {
        ...state,
        pooledResume: {
          ...state.pooledResume,
          pooledcritiqueSet: map(state.pooledResume.pooledcritiqueSet, (critique) => {
            if (critique.id === action.upvote.id) {
              return {
                ...critique,
                upvotes: critique.upvotes
                  + getVoteChanged(
                    state.pooledResume.pooledCritiquesUserUpvoted[action.upvote.id],
                    action.upvote.vote,
                  ),
              };
            }
            return critique;
          }),
          pooledCritiquesUserUpvoted: {
            ...state.pooledResume.pooledCritiquesUserUpvoted,
            [action.upvote.id]: action.upvote.vote,
          },
        },
      };
    case 'SET_POOLED_RESUME_ERROR':
      return {
        ...state,
        error: action.error,
      };
    default:
      return state;
  }
}
