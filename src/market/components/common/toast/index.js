import './style.scss';

const $ = window.$;
const $body = $('body');


// init
$body.append('<div id="toasts"></div>');
const $toasts = $('#toasts');

const disappearTime = 3000;
const iconMap = {
  info: '<i class="anticon icon-info-circle-o"></i>',
  warn: '<i class="anticon icon-warning"></i>',
  error: '<i class="anticon icon-warning"></i>',
};

function toast(message, level = 'info') {
  const messages = window._appStore.getState().i18n.messages;
  let _message = message;
  if (message in messages) {
    _message = messages[message];
  }
  const $toast = $(`<div class="cb-toast ${level}"><span>${iconMap[level]}<span>${_message}</span></span></div>`);
  setTimeout(() => {
    $toast.addClass('show');
  }, 10);
  setTimeout(() => {
    $toast.removeClass('show');

    setTimeout(() => {
      $toast.remove();
    }, 600);
  }, disappearTime);
  $toasts.append($toast);
}

toast.info = function info(message) {
  toast(message);
};

toast.warn = function warn(message) {
  toast(message, 'warn');
};

toast.error = function error(message) {
  toast(message, 'error');
};

export default toast;
