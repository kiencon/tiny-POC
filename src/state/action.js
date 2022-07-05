export const INIT_EDITOR_REF = 'INIT_EDITOR_REF';
export const ON_BEFORE_EDITOR_CHANGE = 'ON_BEFORE_EDITOR_CHANGE';
export const DELETE_BLOCK_EDITOR = 'DELETE_BLOCK_EDITOR';

export const initEditorRef = (id, refObj) => {
  return {
    type: INIT_EDITOR_REF,
    payload: { id, refObj },
  };
};

export const handleOnBeforeEditorChange = (id, htmlContent) => ({
  type: ON_BEFORE_EDITOR_CHANGE,
  payload: { id, htmlContent },
});

export const handleDeleteBlockEditor = id => ({
  type: DELETE_BLOCK_EDITOR,
  payload: id,
});

export const OVERLFOW = 'OVERLFOW';
export const handleOverflow = (state, id) => ({
  type: OVERLFOW,
  payload: {
    id,
    state,
  },
});

export const ON_KEY_UP_EVENT = 'ON_KEY_UP_EVENT';
export const handleOnKeyUpEvent = id => ({
  type: ON_KEY_UP_EVENT,
  payload: id,
});
export const OVERLFOW_SUCCESS = 'OVERLFOW_SUCCESS';
export const handleOverflowSuccess = (data, refs, currentPageId) => ({
  type: OVERLFOW_SUCCESS,
  response: {
    data,
    refs,
    currentPageId,
  }
});
export const OVERLFOW_ERROR = 'OVERLFOW_ERROR';
export const handleOverflowError = state => ({
  type: OVERLFOW_ERROR,
  response: state,
});

export const ATTEMPT_MOVE_CONTENT_UP = 'ATTEMPT_MOVE_CONTENT_UP';
export const ATTEMPT_MOVE_CONTENT_UP_SUCCESS = 'ATTEMPT_MOVE_CONTENT_UP_SUCCESS';
export const ATTEMPT_MOVE_CONTENT_UP_ERROR = 'ATTEMPT_MOVE_CONTENT_UP_ERROR';
export const handleAttemptMoveContentUp = (state, currentPageId) => ({
  type: ATTEMPT_MOVE_CONTENT_UP,
  payload: {
    state,
    currentPageId,
  },
});
export const handleAttemptMoveContentUpSuccess = (data, refs, currentPageId) => ({
  type: ATTEMPT_MOVE_CONTENT_UP_SUCCESS,
  response: {
    data,
    refs,
    currentPageId,
  }
});
export const handleAttemptMoveContentUpError = () => ({
  type: ATTEMPT_MOVE_CONTENT_UP_ERROR,
});
export const handleDeleteEditor = (data, refs) => ({
  type: DELETE_BLOCK_EDITOR,
  response: { data, refs },
});
export const MOVE_CONTENT_UP_SUCCESS = 'MOVE_CONTENT_UP_SUCCESS';
export const handleMoveContentUpSuccess = data => ({
  type: MOVE_CONTENT_UP_SUCCESS,
  response: data,
});


export const GET_BASE_TEMPLATE_DATA = 'GET_BASE_TEMPLATE_DATA';
export const GET_BASE_TEMPLATE_DATA_SUCCESS = 'GET_BASE_TEMPLATE_DATA_SUCCESS';
export const GET_BASE_TEMPLATE_DATA_ERROR = 'GET_BASE_TEMPLATE_DATA_ERROR';

export const getBaseTemplateData = templateId => ({
  type: GET_BASE_TEMPLATE_DATA,
  payload: templateId,
});

export const handleGetBaseTemplateDataSuccess = (data, htmlBlocks) => ({
  type: GET_BASE_TEMPLATE_DATA_SUCCESS,
  payload: { data, htmlBlocks },
});
