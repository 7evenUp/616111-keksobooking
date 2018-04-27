'use strict';

window.backend = (function () {
  var dom = window.util.dom;

  var onSuccess = function () {
    var success = document.querySelector('.success');
    success.classList.remove('hidden');
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
      window.load(window.map.showMapPins, onError);
    },
    sendData: function () {
      window.upload(new FormData(dom.form), onSuccess, onError);
    }
  };

})();
