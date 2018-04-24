'use strict';

window.util = (function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var Y_TOP_BORDER = 150;
  var Y_BOTTOM_BORDER = 500;
  var MAIN_PIN_SIZE = 65;
  var SHARP_END_HEIGHT = 12;
  var DOM = {
    body: document.querySelector('body'),
    map: document.querySelector('.map'),
    mapPinsList: document.querySelector('.map__pins'),
    mainPin: document.querySelector('.map__pin--main'),
    template: document.querySelector('template').content,
    filters: document.querySelector('.map__filters-container'),
    form: document.querySelector('.ad-form'),
    fieldsets: document.querySelector('.ad-form').querySelectorAll('fieldset'),
    address: document.querySelector('#address')
  };

  return {
    dom: DOM,
    getRandomInteger: function (min, max) {
      var rand = min - 0.5 + Math.random() * (max - min + 1);
      rand = Math.round(rand);
      return rand;
    },
    compareFunction: function () {
      return Math.random() - 0.5;
    },
    getPinPosX: function (x) {
      var offsetX = Math.round(PIN_WIDTH / 2);
      return x - offsetX;
    },
    getPinPosY: function (y) {
      var offsetY = Math.round(PIN_HEIGHT);
      return y - offsetY;
    },
    checkBorders: function () {
      var bottomBorder = DOM.mainPin.offsetTop + MAIN_PIN_SIZE + SHARP_END_HEIGHT;
      if (bottomBorder > Y_BOTTOM_BORDER) {
        DOM.mainPin.style.top = Y_BOTTOM_BORDER - (MAIN_PIN_SIZE + SHARP_END_HEIGHT) + 'px';
      }
      var topBorder = DOM.mainPin.offsetTop + MAIN_PIN_SIZE + SHARP_END_HEIGHT;
      if (topBorder < Y_TOP_BORDER) {
        DOM.mainPin.style.top = Y_TOP_BORDER - (MAIN_PIN_SIZE + SHARP_END_HEIGHT) + 'px';
      }
      var leftBorder = parseInt(DOM.mainPin.style.left, 10);
      if (leftBorder < 0) {
        DOM.mainPin.style.left = 0 + 'px';
      }
      var rightBorder = parseInt(DOM.mainPin.style.left, 10) + MAIN_PIN_SIZE;
      if (rightBorder > DOM.body.clientWidth) {
        DOM.mainPin.style.left = DOM.body.clientWidth - MAIN_PIN_SIZE + 'px';
      }
    },
    disableFields: function () {
      for (var i = 0; i < DOM.fieldsets.length; i++) {
        DOM.fieldsets[i].setAttribute('disabled', 'disabled');
      }
    },
  };
})();
