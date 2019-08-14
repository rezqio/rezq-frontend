const initialState = {
  reportSuccess: false,
  reportError: null,
};

export default function reportmodal(state = initialState, action) {
  switch (action.type) {
    case 'REPORT_PAGE_SUCCESS':
      return {
        ...state,
        reportSuccess: true,
        reportError: null,
      };
    case 'REPORT_PAGE_ERROR':
      return {
        ...state,
        reportSuccess: false,
        reportError: action.error,
      };
    case 'RESET_REPORT_MODAL':
      return {
        ...state,
        reportSuccess: false,
        reportError: null,
      };
    default:
      return state;
  }
}
