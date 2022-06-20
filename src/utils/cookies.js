import JsCookies from 'js-cookie';

const getSubDomain = () => {
  const host = window.location.hostname;
  if (host.indexOf('local') > -1) {
    return host;
  }
  return `.${host.split('.').slice(-2).join('.')}`;
};

const OPTS = {
  domain: getSubDomain(),
};

const Cookies = {
  set(key, value) {
    return JsCookies.set(key, value, OPTS);
  },
  get(key) {
    return JsCookies.get(key);
  },
  remove(key) {
    return JsCookies.remove(key);
  },
  deleteAllCookies() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i += 1) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  },
};

export default Cookies;
