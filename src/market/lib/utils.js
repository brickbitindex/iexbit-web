/* eslint import/prefer-default-export: 0 */
import { defineMessages } from 'react-intl';

export function getDecimalCount(d) {
  let nums = d.toString();
  if (nums.length === 0) return 0;
  nums = nums.split('.');
  if (nums.length === 1) return 0;
  return nums[1].length;
}

export function formatMessage({ intl, id, values }) {
  const messages = defineMessages({
    message: {
      id,
    },
  });
  return intl.formatMessage(messages.message, values);
}

export function format(str, ...args) {
  const t = typeof args[0];
  let key;
  if (args.length === 0) {
    return str;
  }
  args = (t === 'string' || t === 'number') ?
    args : args[0];

  for (key in args) {
    str = str.replace(new RegExp('\\{' + key + '\\}', 'gi'), args[key]);
  }
  return str;
}

