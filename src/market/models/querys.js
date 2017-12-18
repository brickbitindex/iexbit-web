import qs from 'qs';
import '../../assets/lib/fetch';

const fetchlib = window.fetch;

const QUERY = {
  ADD_BID_ORDER: '/markets/btccny/order_bids',
};

export const fetch = {
  post(url, data, options = {}) {
    const body = qs.stringify({
      utf8: '✓',
      ...data,
    });
    return fetchlib(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      ...options,
      body,
      method: 'POST',
      credentials: 'include',
    });
  },
  get(url, options = {}) {
    return fetchlib(url, {
      ...options,
      method: 'GET',
    });
  },
};

export default QUERY;
