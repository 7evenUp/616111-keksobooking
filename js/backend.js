'use strict';

window.backend = (function () {
  var GET_URL = 'https://js.dump.academy/keksobooking/data';
  var SEND_URL = 'https://js.dump.academy/keksobooking';
  var OK_STATUS = 200;
  var XHR_TIMEOUT = 10000;

  var dom = window.util.dom;

  return {
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = XHR_TIMEOUT;

      xhr.addEventListener('load', function () {
        if (xhr.status === OK_STATUS) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('GET', GET_URL);
      xhr.send();
    },
    upload: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.timeout = XHR_TIMEOUT;

      xhr.addEventListener('load', function () {
        if (xhr.status === OK_STATUS) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });

      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.open('POST', SEND_URL);
      xhr.send(new FormData(dom.form));
    }
  };
})();
