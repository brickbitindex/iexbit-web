import qs from 'qs';
import '../../assets/lib/fetch';

const fetchlib = window.fetch;
const market = document.body.getAttribute('data-market') || null;

const QUERY = {
  ADD_BID_ORDER: `/markets/${market}/order_bids`,
  ADD_ASK_ORDER: `/markets/${market}/order_asks`,
};

const $token = document.querySelector('meta[name=csrf-token]');
let token = '';
if ($token) {
  token = $token.getAttribute('content');
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.json();
}

export const fetch = {
  post(url, data, options = {}) {
    const body = qs.stringify({
      utf8: '✓',
      ...data,
    });
    return fetchlib(url, {
      headers: {
        Accept: '*/*;q=0.5, text/javascript, application/javascript, application/ecmascript, application/x-ecmascript',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-CSRF-Token': token,
      },
      ...options,
      body,
      method: 'POST',
      credentials: 'include',
    })
    .then(checkStatus)
    .then(parseJSON);
  },
  get(url, options = {}) {
    return fetchlib(url, {
      ...options,
      method: 'GET',
    })
    .then(checkStatus)
    .then(parseJSON);
  },
};

export default QUERY;
