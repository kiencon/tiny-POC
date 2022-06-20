import { moengageTracking } from '../helpers/moeTracking';
import { clearUser } from '../helpers/users';
import $axios from './axios/axiosInstance';
import Cookies from './cookies';

const PRICING_API_ROOT = process.env.REACT_APP_PRICING_API_ROOT;
const { REACT_APP_LOGOUT_HOMEPAGE_API } = process.env;

const isHasTeam = userInformation => {
  const { team } = userInformation || {};
  return team?.length > 0;
};

const isAllowToCreateTeam = userInformation => {
  const { userType } = userInformation || {};
  if (userType && userType !== 'NORMAL') {
    return true;
  }
  return false;
};

const moengageDestroySession = () => {
  if (!window.Moengage || !window.Moengage.destroy_session) {
    console.log('moengageDestroySession notInit');
    return Promise.resolve({ status: 'NO_INIT' });
  }

  return window.Moengage.destroy_session();
};

const onLogoutDashboard = async () => {
  const {
    data: { ip },
  } = await $axios.get(`${PRICING_API_ROOT}/get-user-network?timestamp=${new Date().getTime()}`);

  await moengageTracking({
    event: 'logout',
    eventData: {
      ip_address: ip,
    },
  });

  try {
    const res = await moengageDestroySession();
    console.log('moengageDestroySession success', res);
    sessionStorage.setItem('moengageDestroySession', JSON.stringify({
      time: new Date().toISOString(),
      response: res,
      status: 'success',
    }));
  } catch (err) {
    console.log('moengageDestroySession error', err);
    sessionStorage.setItem('moengageDestroySession', JSON.stringify({
      time: new Date().toISOString(),
      response: err,
      status: 'error',
    }));
  }

  try {
    await $axios.post(`${REACT_APP_LOGOUT_HOMEPAGE_API}`);
  } catch (err) {
    console.log('logout error --> ', err);
  } finally {
    clearUser();
  }
};

export {
  $axios,
  Cookies,
  isHasTeam,
  isAllowToCreateTeam,
  onLogoutDashboard,
};
