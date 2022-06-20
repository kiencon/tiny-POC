import jwtDecode from 'jwt-decode';
import { put, takeLeading } from 'redux-saga/effects';
import { CATEGORIES, TEMPLATE_BASE_URL } from '../components/common/const';
import Cookies from '../helpers/cookies';
import {
  changeTeamError, changeTeamSuccess, CHANGE_TEAM_ACTION, getAvailableCategoriesSuccess,
  getCurrentUserError, getCurrentUserSuccess,
  getTeamInformationSuccess, GET_CURRENT_USER_REQUEST,
} from './action';
import {
  changeTokenWithTeamId, getAvailableCategories, getTeams, getUserInformation,
} from './api';

const getCurrentUser = async () => {
  let userId;
  let teamId;
  const authToken = Cookies.get('auth_token') || localStorage.getItem('auth_token');
  try {
    const { id, teamId: userTeamId } = jwtDecode(authToken);
    userId = id;
    teamId = userTeamId;
  } catch (e) {
    console.log(e);
    window.location.href = TEMPLATE_BASE_URL;
  }
  const { data: userInformation } = await getUserInformation(userId);
  const { data: team } = await getTeams();
  const user = { ...userInformation, ...team, teamId };
  Cookies.set('auth_token', authToken);
  Cookies.set('user_info', user);

  return user;
};

const getCategories = categoryIdObjects => Object.values(CATEGORIES).filter(item => categoryIdObjects[item.value]);

const getAllInformations = () => Promise.all([getAvailableCategories(), getCurrentUser(), getTeams()]);

export function* getCurrentUserSaga() {
  try {
    const [categoryIdObjects, userInformation, teamInformation] = yield getAllInformations();
    yield put(getCurrentUserSuccess(userInformation));
    yield put(getTeamInformationSuccess(teamInformation.data));
    yield put(getAvailableCategoriesSuccess(getCategories(categoryIdObjects.data)));
  } catch (error) {
    console.log(error);
    yield put(getCurrentUserError(error));
  }
}

function* changeTeamSaga({ payload }) {
  try {
    const teamId = payload;
    const { data } = yield changeTokenWithTeamId(teamId);
    yield put(changeTeamSuccess(data));
  } catch (error) {
    yield put(changeTeamError(error));
  }
}

export default function* createGetCurrentUserSaga() {
  yield takeLeading(GET_CURRENT_USER_REQUEST, getCurrentUserSaga);
  yield takeLeading(CHANGE_TEAM_ACTION, changeTeamSaga);
}
