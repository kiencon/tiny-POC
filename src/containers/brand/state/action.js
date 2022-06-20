export const GET_INFORMATION_BRAND = 'GET_INFORMATION_BRAND';
export const GET_INFORMATION_BRAND_SUCCESS = 'GET_INFORMATION_BRAND_SUCCESS';
export const GET_INFORMATION_BRAND_ERROR = 'GET_INFORMATION_BRAND_ERROR';
export const UPDATE_INFORMATION_COMPANY = 'UPDATE_INFORMATION_COMPANY';
export const UPDATE_INFORMATION_COMPANY_SUCCESS = 'UPDATE_INFORMATION_COMPANY_SUCCESS';
export const UPDATE_INFORMATION_COMPANY_ERROR = 'UPDATE_INFORMATION_COMPANY_ERROR';
export const UPDATE_COLORS = 'UPDATE_COLORS';
export const UPDATE_COLORS_SUCCESS = 'UPDATE_COLORS_SUCCESS';
export const UPDATE_COLORS_ERROR = 'UPDATE_COLORS_ERROR';
export const UPDATE_FONTS = 'UPDATE_FONTS';
export const UPDATE_FONTS_SUCCESS = 'UPDATE_FONTS_SUCCESS';
export const UPDATE_FONTS_ERROR = 'UPDATE_FONTS_ERROR';

export const SIGNED_URL_FILE = 'SIGNED_URL_FILE';
export const SIGNED_URL_FILE_SUCCESS = 'SIGNED_URL_FILE_SUCCESS';
export const SIGNED_URL_FILE_ERROR = 'SIGNED_URL_FILE_ERROR';
export const UPLOAD_FILE = 'UPLOAD_FILE';
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'UPLOAD_FILE_ERROR';
export const UPDATE_FILES = 'UPDATE_FILES';
export const UPDATE_FILES_SUCCESS = 'UPDATE_FILES_SUCCESS';
export const UPDATE_FILES_ERROR = 'UPDATE_FILES_ERROR';

export const LOADING = 'LOADING';
export const LOADED = 'LOADED';

export const getInformationBrand = () => ({
  type: GET_INFORMATION_BRAND,
});
export const getInformationBrandSuccess = response => ({
  type: GET_INFORMATION_BRAND_SUCCESS,
  response,
});
export const getInformationBrandError = error => ({
  type: GET_INFORMATION_BRAND_ERROR,
  error,
});

export const updateInformationCompany = payload => ({
  type: UPDATE_INFORMATION_COMPANY,
  payload,
});
export const updateInformationCompanySuccess = response => ({
  type: UPDATE_INFORMATION_COMPANY_SUCCESS,
  response,
});
export const updateInformationCompanyError = error => ({
  type: UPDATE_INFORMATION_COMPANY_ERROR,
  error,
});

export const updateColors = payload => ({
  type: UPDATE_COLORS,
  payload,
});
export const updateColorsSuccess = response => ({
  type: UPDATE_COLORS_SUCCESS,
  response,
});
export const updateColorsError = error => ({
  type: UPDATE_COLORS_ERROR,
  error,
});

export const updateFonts = payload => ({
  type: UPDATE_FONTS,
  payload,
});
export const updateFontsSuccess = response => ({
  type: UPDATE_FONTS_SUCCESS,
  response,
});
export const updateFontsError = error => ({
  type: UPDATE_FONTS_ERROR,
  error,
});

export const signedUrlFile = payload => ({
  type: SIGNED_URL_FILE,
  payload,
});
export const signedUrlFileSuccess = response => ({
  type: SIGNED_URL_FILE_SUCCESS,
  response,
});
export const signedUrlFileError = error => ({
  type: SIGNED_URL_FILE_ERROR,
  error,
});

export const uploadFile = payload => ({
  type: UPLOAD_FILE,
  payload,
});
export const uploadFileSuccess = response => ({
  type: UPLOAD_FILE_SUCCESS,
  response,
});
export const uploadFileError = error => ({
  type: UPLOAD_FILE_ERROR,
  error,
});

export const updateFiles = payload => ({
  type: UPDATE_FILES,
  payload,
});
export const updateFilesSuccess = response => ({
  type: UPDATE_FILES_SUCCESS,
  response,
});
export const updateFilesError = error => ({
  type: UPDATE_FILES_ERROR,
  error,
});

export const updateLoading = () => ({
  type: LOADING,
});
export const updateLoaded = () => ({
  type: LOADED,
});
