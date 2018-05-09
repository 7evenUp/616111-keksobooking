'use strict';

window.util = (function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var Y_TOP_BORDER = 150;
  var Y_BOTTOM_BORDER = 500;
  var MAIN_PIN_SIZE = 65;
  var SHARP_END_HEIGHT = 12;
  var SHOW_ERROR_TIME = 3500;
  var DOM = {
    body: document.querySelector('body'),
    map: document.querySelector('.map'),
    mapPinsList: document.querySelector('.map__pins'),
    mainPin: document.querySelector('.map__pin--main'),
    template: document.querySelector('template').content,
    divFilters: document.querySelector('.map__filters-container'),
    mapFilters: document.querySelector('.map__filters'),
    filterSelects: document.querySelectorAll('.map__filter'),
    filterFeatures: document.querySelector('.map__features'),
    form: document.querySelector('.ad-form'),
    fieldsets: document.querySelector('.ad-form').querySelectorAll('fieldset'),
    address: document.querySelector('#address'),
    resetButton: document.querySelector('.ad-form__reset')
  };

  return {
    dom: DOM,
    showErrorMsg: function (errorMessage) {
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
      DOM.body.appendChild(div);
      setTimeout(function () {
        DOM.body.removeChild(div);
      }, SHOW_ERROR_TIME);
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
        DOM.mainPin.style.left = 0;
      }
      var rightBorder = parseInt(DOM.mainPin.style.left, 10) + MAIN_PIN_SIZE;
      if (rightBorder > DOM.body.clientWidth) {
        DOM.mainPin.style.left = DOM.body.clientWidth - MAIN_PIN_SIZE + 'px';
      }
    },
    disableFields: function () {
      DOM.fieldsets.forEach(function (item) {
        item.setAttribute('disabled', 'disabled');
      });
    },
    disableFilter: function () {
      DOM.filterSelects.forEach(function (item) {
        item.setAttribute('disabled', 'disabled');
      });
      DOM.filterFeatures.setAttribute('disabled', 'disabled');
    },
    undisableFilter: function () {
      DOM.filterSelects.forEach(function (item) {
        item.removeAttribute('disabled');
      });
      DOM.filterFeatures.removeAttribute('disabled');
    }
  };
})();
