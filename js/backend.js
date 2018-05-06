'use strict';

window.backend = (function () {
  var SHOW_SUCCESS_TIME = 2000;
  var UPDATE_TIME = 500;
  var SHOW_ERROR_TIME = 3500;

  var dom = window.util.dom;

  var onSuccess = function () {
    var success = document.querySelector('.success');
    success.classList.remove('hidden');
    setTimeout(function () {
      success.classList.add('hidden');
    }, SHOW_SUCCESS_TIME);
  };

  var onLoad = function (data) {
    window.map.showMapPins(data);
    window.util.undisableFilter();

    var timeout;
    dom.divFilters.addEventListener('change', function (evt) {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(function () {
        window.pin.closePopup();
        window.filter.updateMap(data, evt);
      }, UPDATE_TIME);
    });
  };

  var onError = function (errorMessage) {
    var div = document.createElement('div');
    div.style.zIndex = 1000;
    div.style.minHeight = 30 + 'px';
    div.style.minWidth = 500 + 'px';
    div.style.position = 'fixed';
    div.style.top = 0;
    div.style.left = 'calc(50% - 250px)';
    div.style.backgroundColor = 'white';
    div.style.opacity = 0.8;
    div.textContent = errorMessage;
    div.style.textAlign = 'center';
    div.style.lineHeight = 30 + 'px';
    div.style.color = 'red';
    dom.body.appendChild(div);
    setTimeout(function () {
      dom.body.removeChild(div);
    }, SHOW_ERROR_TIME);
  };

  return {
    getData: function () {
      window.load(onLoad, onError);
    },
    sendData: function () {
      window.upload(new FormData(dom.form), onSuccess, onError);
    }
  };
})();
