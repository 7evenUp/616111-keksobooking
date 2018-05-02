'use strict';

window.backend = (function () {
  var dom = window.util.dom;

  var onSuccess = function () {
    var success = document.querySelector('.success');
    success.classList.remove('hidden');
    setTimeout(function () {
      success.classList.add('hidden');
    }, 2000);
  };

  var onLoad = function (data) {
    window.map.showMapPins(data);

    dom.filters.addEventListener('change', function () {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      var timeout = window.setTimeout(function () {
        window.filter.updateMap(data);
      }, 500);
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
    }, 3500);
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
