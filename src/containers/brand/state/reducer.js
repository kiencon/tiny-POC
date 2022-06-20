import immutable from 'immutable';
import {
  GET_INFORMATION_BRAND,
  GET_INFORMATION_BRAND_ERROR,
  GET_INFORMATION_BRAND_SUCCESS,
  UPDATE_INFORMATION_COMPANY,
  UPDATE_INFORMATION_COMPANY_ERROR,
  UPDATE_INFORMATION_COMPANY_SUCCESS,
  UPDATE_COLORS,
  UPDATE_COLORS_SUCCESS,
  UPDATE_COLORS_ERROR,
  UPDATE_FONTS,
  UPDATE_FONTS_SUCCESS,
  UPDATE_FONTS_ERROR,
  SIGNED_URL_FILE,
  SIGNED_URL_FILE_SUCCESS,
  SIGNED_URL_FILE_ERROR,
  UPLOAD_FILE,
  UPLOAD_FILE_SUCCESS,
  UPLOAD_FILE_ERROR,
  UPDATE_FILES,
  UPDATE_FILES_SUCCESS,
  UPDATE_FILES_ERROR,
  LOADING,
  LOADED,
} from './action';

export const initialState = {
  data: [],
};

const init = () => {
  const initValue = immutable.fromJS({
    data: undefined,
    isLoading: undefined,
    isFileLoading: undefined,
    typeFileUploading: undefined,
    effect: 0,
  });

  return initValue
    .set('data', {
      ...initialState,
    })
    .set('error', {
      ...initialState,
    })
    .set('isLoading', false) // Using to improve load category - recommend using skeleton to do it
    .set('isFileLoading', false)
    .set('typeFileUploading', -1)
    .set('effect', 0);
};

const reducer = (state = init(), action) => {
  switch (action.type) {
    case GET_INFORMATION_BRAND: {
      return state
        .set('isLoading', true);
    }
    case GET_INFORMATION_BRAND_SUCCESS: {
      const { response } = action;
      return state
        .set('isLoading', false)
        .update('data', data => ({
          ...data,
          data: response,
        }));
    }
    case GET_INFORMATION_BRAND_ERROR: {
      return state
        .set('isLoading', false);
    }
    case UPDATE_INFORMATION_COMPANY: {
      return state
        .set('isLoading', true);
    }
    case UPDATE_INFORMATION_COMPANY_SUCCESS: {
      return state
        .set('isLoading', false);
    }
    case UPDATE_INFORMATION_COMPANY_ERROR: {
      return state
        .set('isLoading', false);
    }
    case UPDATE_COLORS: {
      return state
        .set('isLoading', true);
    }
    case UPDATE_COLORS_SUCCESS: {
      return state
        .set('isLoading', false);
    }
    case UPDATE_COLORS_ERROR: {
      return state
        .set('isLoading', false);
    }
    case UPDATE_FONTS: {
      return state
        .set('isLoading', true);
    }
    case UPDATE_FONTS_SUCCESS: {
      return state
        .set('isLoading', false);
    }
    case UPDATE_FONTS_ERROR: {
      return state
        .set('isLoading', false);
    }
    case SIGNED_URL_FILE: {
      const { payload } = action;
      return state
        .set('isFileLoading', true)
        .set('typeFileUploading', payload.typeFileUpload);
    }
    case SIGNED_URL_FILE_SUCCESS: {
      return state
        .set('isFileLoading', false);
    }
    case SIGNED_URL_FILE_ERROR: {
      return state
        .set('isFileLoading', false);
    }
    case UPLOAD_FILE: {
      return state
        .set('isFileLoading', true);
    }
    case UPLOAD_FILE_SUCCESS: {
      return state
        .set('isFileLoading', false);
    }
    case UPLOAD_FILE_ERROR: {
      return state
        .set('isFileLoading', false);
    }
    case UPDATE_FILES: {
      return state
        .set('isFileLoading', true);
    }
    case UPDATE_FILES_SUCCESS: {
      return state
        .set('isFileLoading', false)
        .set('typeFileUploading', -1);
    }
    case UPDATE_FILES_ERROR: {
      return state
        .set('isFileLoading', false)
        .set('typeFileUploading', -1);
    }
    case LOADING: {
      return state
        .set('typeFileUploading', 6)
        .set('isFileLoading', true);
    }
    case LOADED: {
      return state
        .set('typeFileUploading', -1)
        .set('isFileLoading', false);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
