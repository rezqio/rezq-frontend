import isEqual from 'lodash/isEqual';

export const undoable = (reducer) => {
  const initialState = {
    past: [],
    present: reducer(undefined, {}),
    future: [],
    annotationsEdited: false,
    unsavedAnnotations: [],
  };

  return (state = initialState, action) => {
    const {
      past, present, future, unsavedAnnotations,
    } = state;

    switch (action.type) {
      case 'UNDO': {
        let last = past[past.length - 1];
        let newPast = past.slice(0, past.length - 1);

        if (last[last.length - 1] && last[last.length - 1].type === 'point') {
          last = past[past.length - 2];
          newPast = past.slice(0, past.length - 2);
        }

        return {
          past: newPast,
          present: last,
          future: [present, ...future],
          annotationsEdited: true,
        };
      }
      case 'REDO': {
        const next = future[0];
        const newFuture = future.slice(1);

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
          annotationsEdited: true,
        };
      }
      case 'RESET_HISTORY': {
        return {
          past: [],
          present: [],
          future: [],
          annotationsEdited: false,
        };
      }
      case 'SHOW_ANNOTATIONS': {
        return {
          ...state,
          present: unsavedAnnotations,
          unsavedAnnotations: [],
        };
      }
      case 'HIDE_ANNOTATIONS': {
        return {
          ...state,
          present: [],
          unsavedAnnotations: present,
        };
      }
      default: {
        const newPresent = reducer(present, action);
        if (
          isEqual(present, newPresent)
          || (present.length === 0 && newPresent.length === 0)
        ) {
          return state;
        }
        if (action.type === 'SET_ANNOTATIONS') {
          return {
            past: [],
            present: newPresent,
            future: [],
            annotationsEdited: false,
          };
        }
        return {
          past: [...past, present],
          present: newPresent,
          future: [],
          annotationsEdited: true,
        };
      }
    }
  };
};
