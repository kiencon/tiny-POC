import { call, put, takeLatest } from 'redux-saga/effects';
import { STATUS_CODE } from '../../../config/constant';
import * as types from './action';
import {
  getInformationBrand, signedUrlFile, updateColors, updateFiles,
  updateFonts, updateInformationCompany, uploadFile,
} from './api';

function* watchGetInformationBrand() {
  try {
    const response = yield call(getInformationBrand);
    if (response.status === STATUS_CODE.SUCCESS) {
      const information = response.data.data;
      yield put(types.getInformationBrandSuccess(information));
    }
  } catch (error) {
    yield put(types.getInformationBrandError(error));
  }
}
function* watchUpdateInformationCompany({ payload }) {
  try {
    const response = yield call(updateInformationCompany, payload);
    if (response.status === STATUS_CODE.SUCCESS) {
      yield put(types.updateInformationCompanySuccess(response));
      yield put(types.getInformationBrand());
    }
  } catch (error) {
    yield put(types.updateInformationCompanyError(error));
  }
}
function* watchUpdateColors({ payload }) {
  try {
    const response = yield call(updateColors, payload);
    if (response.status === STATUS_CODE.SUCCESS) {
      yield put(types.updateColorsSuccess(response));
      yield put(types.getInformationBrand());
    }
  } catch (error) {
    yield put(types.updateColorsError(error));
  }
}
function* watchSignedUploadUpdateFilesUrl({ payload }) {
  const typePayload = payload.type ? payload.type.split('/')[0] : 'font';
  let thumbnailData = {};
  const snapshotThumbnails = [];

  function* uploadThumbnail(pay) {
    const fileName = encodeURIComponent(pay.name);
    const typeFile = pay.type.split('/')[0];
    const response = yield call(signedUrlFile, fileName, typeFile);

    if (response.status === STATUS_CODE.SUCCESS) {
      // yield put(types.signedUrlFileSuccess(response));
      const data = {
        ...response.data.fields,
        'Content-Type': `${typeFile}/*`,
        file: pay,
      };
      const formData = new FormData();
      Object.keys(data).forEach(name => {
        formData.append(name, data[name]);
      });
      try {
        const responseUpload = yield call(uploadFile, formData);
        if (responseUpload.status === STATUS_CODE.NO_CONTENT) {
          // yield put(types.uploadFileSuccess(response));
          thumbnailData = {
            url: `${response.data.url}/${encodeURIComponent(response.data.fields.Key)}`,
            type: pay.typeFileUpload,
            label: fileName,
            width: pay.width,
            height: pay.height,
            typeThumbnail: pay.typeThumbnail,
          };
        }
      } catch (error) {
        yield put(types.uploadFileError(error));
      }
    }
  }
  function* uploadImage(pay) {
    const fileName = encodeURIComponent(pay.name);
    const typeFile = pay.type.split('/')[0];
    const response = yield call(signedUrlFile, fileName, typeFile);

    if (response.status === STATUS_CODE.SUCCESS) {
      // yield put(types.signedUrlFileSuccess(response));
      const data = {
        ...response.data.fields,
        'Content-Type': `${typeFile}/*`,
        file: pay,
      };
      const formData = new FormData();
      Object.keys(data).forEach(name => {
        formData.append(name, data[name]);
      });
      try {
        const responseUpload = yield call(uploadFile, formData);
        if (responseUpload.status === STATUS_CODE.NO_CONTENT) {
          // yield put(types.uploadFileSuccess(response));

          thumbnailData = {
            width: pay.width,
            height: pay.height,
          };
          const fileData = {
            url: `${response.data.url}/${encodeURIComponent(response.data.fields.Key)}`,
            type: pay.typeFileUpload,
            label: fileName,
            metadata: thumbnailData,
          };
          try {
            yield put(types.updateFiles());
            const responseUpdate = yield call(updateFiles, fileData);
            if (responseUpdate.status === STATUS_CODE.SUCCESS) {
              yield put(types.updateFilesSuccess(response));
              yield put(types.getInformationBrand());
            }
          } catch (error) {
            yield put(types.updateFilesError(error));
          }
        }
      } catch (error) {
        yield put(types.uploadFileError(error));
      }
    }
  }
  function* uploadVideo(pay) {
    const fileName = encodeURIComponent(pay.name);
    const typeFile = pay.type.split('/')[0];
    const response = yield call(signedUrlFile, fileName, typeFile);
    if (response.status === STATUS_CODE.SUCCESS) {
      // yield put(types.signedUrlFileSuccess(response));
      const data = {
        ...response.data.fields,
        'Content-Type': `${typeFile}/*`,
        file: pay,
      };
      const formData = new FormData();
      Object.keys(data).forEach(name => {
        formData.append(name, data[name]);
      });
      try {
        const responseUpload = yield call(uploadFile, formData);
        if (responseUpload.status === STATUS_CODE.NO_CONTENT) {
          // yield put(types.uploadFileSuccess(response));
          let loop = 0;
          while (true) {
            if (loop === 0 || loop === pay.thumbnails.length - 1) {
              yield uploadThumbnail(pay.thumbnails[loop]);
              yield snapshotThumbnails.push(thumbnailData);
            }
            loop += 1;
            if (loop > pay.thumbnails.length - 1) break;
          }
          const fileData = {
            url: `${response.data.url}/${encodeURIComponent(response.data.fields.Key)}`,
            type: pay.typeFileUpload,
            label: fileName,
            metadata: {
              ...snapshotThumbnails[0],
              duration: pay.duration,
              urlImageMerged: snapshotThumbnails[1].url,
            },
          };

          try {
            yield put(types.updateFiles());
            const responseUpdate = yield call(updateFiles, fileData);
            if (responseUpdate.status === STATUS_CODE.SUCCESS) {
              yield put(types.updateFilesSuccess(response));
              yield put(types.getInformationBrand());
            }
          } catch (error) {
            yield put(types.updateFilesError(error));
          }
        }
      } catch (error) {
        yield put(types.uploadFileError(error));
      }
    }
  }
  function* uploadAudio(pay) {
    const fileName = encodeURIComponent(pay.name);
    const typeFile = pay.type.split('/')[0];
    const response = yield call(signedUrlFile, fileName, typeFile);
    if (response.status === STATUS_CODE.SUCCESS) {
      // yield put(types.signedUrlFileSuccess(response));
      const data = {
        ...response.data.fields,
        'Content-Type': `${typeFile}/*`,
        file: pay,
      };
      const formData = new FormData();
      Object.keys(data).forEach(name => {
        formData.append(name, data[name]);
      });
      try {
        const responseUpload = yield call(uploadFile, formData);
        if (responseUpload.status === STATUS_CODE.NO_CONTENT) {
          yield uploadThumbnail(pay.thumbnail);
          // yield put(types.uploadFileSuccess(response));
          const fileData = {
            url: `${response.data.url}/${encodeURIComponent(response.data.fields.Key)}`,
            type: pay.typeFileUpload,
            label: fileName,
            metadata: {
              thumbnail: thumbnailData,
              duration: pay.duration,
            },
          };

          try {
            yield put(types.updateFiles());
            const responseUpdate = yield call(updateFiles, fileData);
            if (responseUpdate.status === STATUS_CODE.SUCCESS) {
              yield put(types.updateFilesSuccess(response));
              yield put(types.getInformationBrand());
            }
          } catch (error) {
            yield put(types.updateFilesError(error));
          }
        }
      } catch (error) {
        yield put(types.uploadFileError(error));
      }
    }
  }
  function* uploadFont(pay) {
    const fileName = encodeURIComponent(pay.name);
    const typeFile = 'font';
    const response = yield call(signedUrlFile, fileName, typeFile);
    if (response.status === STATUS_CODE.SUCCESS) {
      // yield put(types.signedUrlFileSuccess(response));
      const data = {
        ...response.data.fields,
        'Content-Type': `${typeFile}/*`,
        file: pay,
      };
      const formData = new FormData();
      Object.keys(data).forEach(name => {
        formData.append(name, data[name]);
      });
      try {
        const responseUpload = yield call(uploadFile, formData);
        if (responseUpload.status === STATUS_CODE.NO_CONTENT) {
          // yield put(types.uploadFileSuccess(response));
          const fileData = {
            url: `${response.data.url}/${encodeURIComponent(response.data.fields.Key)}`,
            type: pay.typeFileUpload,
            label: encodeURIComponent(pay.name.split('.')[0]),
          };

          try {
            yield put(types.updateFiles());
            const responseUpdate = yield call(updateFiles, fileData);
            if (responseUpdate.status === STATUS_CODE.SUCCESS) {
              yield put(types.updateFilesSuccess(response));
              yield put(types.getInformationBrand());
            }
          } catch (error) {
            yield put(types.updateFilesError(error));
          }
        }
      } catch (error) {
        yield put(types.uploadFileError(error));
      }
    }
  }

  try {
    const LOGO = 8;
    const IMAGE = 0;

    if (typePayload === 'image') {
      if (payload.typeFileUpload === LOGO) {
        yield uploadImage(payload);
      } else if (payload.typeFileUpload === IMAGE) {
        yield uploadThumbnail(payload.thumbnail);
        yield uploadImage(payload);
      }
    } else if (typePayload === 'video') {
      yield uploadVideo(payload);
    } else if (typePayload === 'audio') {
      yield uploadAudio(payload);
    } else if (typePayload === 'font') {
      yield uploadFont(payload);
    }
  } catch (error) {
    yield put(types.signedUrlFileError(error));
  }
}
function* watchUpdateFonts({ payload }) {
  try {
    const response = yield call(updateFonts, payload);
    if (response.status === STATUS_CODE.SUCCESS) {
      yield put(types.updateFontsSuccess(response));
      yield put(types.getInformationBrand());
    }
  } catch (error) {
    yield put(types.updateFontsError(error));
  }
}

function* brandSaga() {
  yield takeLatest(types.GET_INFORMATION_BRAND, watchGetInformationBrand);
  yield takeLatest(types.UPDATE_INFORMATION_COMPANY, watchUpdateInformationCompany);
  yield takeLatest(types.UPDATE_COLORS, watchUpdateColors);
  yield takeLatest(types.SIGNED_URL_FILE, watchSignedUploadUpdateFilesUrl);
  yield takeLatest(types.UPDATE_FONTS, watchUpdateFonts);
}

export default brandSaga;
