import React from 'react';
import { FormattedMessage } from 'react-intl';

import './style.scss';

console.log(window.locale);
function redirect(open) {
  window.location = `/${window.locale.toLowerCase()}?open=${open}&redirect_to=${encodeURIComponent(window.location.pathname + window.location.hash)}`;
}

export default function AnonymousMask() {
  return (
    <div className="anonymousMask">
      <div className="opts">
        <a onClick={() => redirect('signin')}><FormattedMessage id="anonymous_signin" /></a>
        <FormattedMessage id="anonymous_or" />
        <a onClick={() => redirect('signup')}><FormattedMessage id="anonymous_signup" /></a>
      </div>
    </div>
  );
}
