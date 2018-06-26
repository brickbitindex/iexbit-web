import qs from 'qs';
import '../../assets/lib/fetch';

const fetchlib = window.fetch;
const market = document.body.getAttribute('data-market') || '';
// const pairSymbol = market.toLowerCase().replace('/', '_');
const marketId = document.body.getAttribute('data-market_id') || '';

function getSign() {
  const d = new Date();
  return parseInt(d / 1000 / 60 / 60, 10) * 1000 * 60 * 60;
}

const QUERY = {
  ADD_BID_ORDER: `/markets/${market}/order_bids`,
  ADD_ASK_ORDER: `/markets/${market}/order_asks`,
  DELETE_ORDER: (id, type) => `/markets/${marketId}/order_${type}s/${id}`,
  K: '/api/v2/k.json',
  QUERY_PRICES: '/api/v2/markets',
  I18N: locale => `https://assets.bitrabbit.com/i18n/${__ENV__}/market/${locale}.json?_=${getSign()}`,
  TRADES: '/web/trades.json',
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
  throw response.json();
}

function parseJSON(response) {
  return response.json();
}

export const fetch = {
  post(url, data, options = {}) {
    const body = qs.stringify({
      utf8: '✓',
      ...data,
      locale: window.locale,
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
  delete(url, options = {}) {
    return fetchlib(url, {
      headers: {
        Accept: '*/*',
        'X-CSRF-Token': token,
      },
      ...options,
      method: 'DELETE',
      credentials: 'include',
    })
    .then(checkStatus);
  },
  get(url, data, options = {}) {
    let queryUrl = url;
    if (data) {
      queryUrl += '?' + qs.stringify({
        ...data,
        locale: window.locale,
      });
    }
    return fetchlib(queryUrl, {
      ...options,
      method: 'GET',
    })
    .then(checkStatus)
    .then(parseJSON);
  },
};

export default QUERY;
