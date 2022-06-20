export const GET_CURRENT_USER_REQUEST = 'GET_CURRENT_USER_REQUEST';
export const GET_CURRENT_USER_SUCCESS = 'GET_CURRENT_USER_SUCCESS';
export const GET_CURRENT_USER_ERROR = 'GET_CURRENT_USER_ERROR';
export const GET_AVAILABLE_CATEGORIES_REQUEST = 'GET_AVAILABLE_CATEGORIES_REQUEST';
export const GET_AVAILABLE_CATEGORIES_SUCCESS = 'GET_AVAILABLE_CATEGORIES_SUCCESS';
export const GET_AVAILABLE_CATEGORIES_ERROR = 'GET_AVAILABLE_CATEGORIES_ERROR';
export const GET_TEAM_INFORMATION_SUCCESS = 'GET_TEAM_INFORMATION_SUCCESS';
export const GET_MAPPING_CATEGORIES_REQUEST = 'GET_MAPPING_CATEGORIES_REQUEST';
export const GET_MAPPING_CATEGORIES_REQUEST_SUCCESS = 'GET_MAPPING_CATEGORIES_REQUEST_SUCCESS';
export const GET_MAPPING_CATEGORIES_REQUEST_ERROR = 'GET_MAPPING_CATEGORIES_REQUEST_ERROR';
export const CHANGE_TEAM_ACTION = 'CHANGE_TEAM_ACTION';
export const CHANGE_TEAM_SUCCESS = 'CHANGE_TEAM_SUCCESS';
export const CHANGE_TEAM_ERROR = 'CHANGE_TEAM_ERROR';

export const getCurrentUserRequest = payload => ({
  type: GET_CURRENT_USER_REQUEST,
  payload,
});

export const getCurrentUserSuccess = response => ({
  type: GET_CURRENT_USER_SUCCESS,
  response,
});

export const getCurrentUserError = response => ({
  type: GET_CURRENT_USER_ERROR,
  response,
});

export const getAvailableCategoriesRequest = payload => ({
  type: GET_AVAILABLE_CATEGORIES_REQUEST,
  payload,
});

export const getAvailableCategoriesSuccess = response => ({
  type: GET_AVAILABLE_CATEGORIES_SUCCESS,
  response,
});

export const getAvailableCategoriesError = response => ({
  type: GET_AVAILABLE_CATEGORIES_ERROR,
  response,
});

export const getTeamInformationSuccess = response => ({
  type: GET_TEAM_INFORMATION_SUCCESS,
  response,
});

export const changeTeamAction = payload => ({
  type: CHANGE_TEAM_ACTION,
  payload,
});

export const changeTeamSuccess = response => ({
  type: CHANGE_TEAM_SUCCESS,
  response,
});

export const changeTeamError = response => ({
  type: CHANGE_TEAM_ERROR,
  response,
});

export const INIT_EDITOR_REF = 'INIT_EDITOR_REF';
export const ON_BEFORE_EDITOR_CHANGE = 'ON_BEFORE_EDITOR_CHANGE';
export const DELETE_BLOCK_EDITOR = 'DELETE_BLOCK_EDITOR';

export const initEditorRef = (id, refObj) => {
  console.log(id);
  console.log(refObj);
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
