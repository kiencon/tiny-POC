import axios from 'axios';
import { API_ROOT, REACT_APP_IMAGE_API, S3_UPLOAD_URL } from '../../../config/constant';
import { $axios } from '../../../utils';

const AxiosService = () => {
  const instance = axios.create();

  const handleSuccess = response => response;
  const handleError = error => Promise.reject(error);
  instance.interceptors.response.use(handleSuccess, handleError);

  return instance;
};

export const getInformationBrand = () => $axios.get(`${API_ROOT}/brand-kit?timestamp=${new Date().getTime()}`);

export const updateInformationCompany = ({
  companyName, website, phoneNumber, emails, address,
}) => $axios.put(`${API_ROOT}/brand-kit/information`, {
  companyName, website, phoneNumber, emails, address,
});
export const updateColors = colors => $axios.put(`${API_ROOT}/brand-kit/color`, colors);
export const updateFonts = fonts => $axios.put(`${API_ROOT}/brand-kit/font`, fonts);

export const signedUrlFile = (
  fileName, type,
) => $axios.post(`${REACT_APP_IMAGE_API}/signed-url/${type}`, { fileName });
export const uploadFile = formData => AxiosService().post(S3_UPLOAD_URL, formData);
export const updateFiles = fileData => $axios.post(`${API_ROOT}/brand-kit/file`, fileData);
