const initialState = {
  resumes: [],
  loading: true,
  resumeCount: 0,
};

export default function publicpool(state = initialState, action) {
  switch (action.type) {
    case 'SET_POOLED_RESUMES':
      return {
        ...state,
        resumes: action.pooledResumes.resumes,
        loading: false,
        resumeCount: action.pooledResumes.totalCount,
      };
    default:
      return state;
  }
}
