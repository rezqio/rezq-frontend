import values from 'lodash/values';

const initialState = {
  resumes: [],
  industries: '',
  loading: false,
  uploadError: null,
  uploadingResume: false,
};

export default function myresumes(state = initialState, action) {
  switch (action.type) {
    case 'SET_INDUSTRIES':
      return {
        ...state,
        industries: action.profile.industries,
        institutions: action.profile.institutions,
      };
    case 'LOAD_RESUMES':
      return {
        ...state,
        loading: true,
        uploadError: null,
      };
    case 'SET_RESUMES':
      return {
        ...state,
        resumes: action.resumes,
        loading: false,
        uploadError: null,
        uploadingResume: false,
      };
    case 'UPLOAD_ERROR':
      return {
        ...state,
        uploadError: values(JSON.parse(action.errors))[0],
        uploadingResume: false,
      };
    case 'CLEAR_UPLOAD_ERROR':
      return {
        ...state,
        uploadError: null,
      };
    case 'UPLOADING_RESUME':
      return {
        ...state,
        uploadingResume: true,
      };
    default:
      return state;
  }
}
