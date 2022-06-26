import { all } from 'redux-saga/effects';
// import brandSaga from '../containers/brand/state/saga';
// import createDesignTemplateSaga from '../containers/design/state/saga';
// import documentSaga from '../containers/document/state/saga';
// import getCategoryItemsSaga from '../containers/header/state/saga';
// import createDownloadedTemplateSaga from '../containers/myDownload/state/saga';
// import createTeamSaga from '../containers/team/state/saga';
import handleOverflowEventSaga from '../state/saga';

export default function* rootSaga() {
  yield all([
    handleOverflowEventSaga(),
  ]);
}
