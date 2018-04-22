'use strict';

(function () {
  var NUMBER_OF_PINS = 8;

  var dom = window.util.dom;

  var activateMap = function () {
    dom.map.classList.remove('map--faded');
    dom.form.classList.remove('ad-form--disabled');
    for (var i = 0; i < dom.fieldsets.length; i++) {
      dom.fieldsets[i].removeAttribute('disabled');
    }
    window.form.validateForms();
  };

  var deletePins = function (array) {
    for (var i = array.length - 1; i >= 0; i--) {
      if (array[i].type === 'button') {
        array[i].parentNode.removeChild(array[i]);
      }
    }
  };

  var showMapPins = function () {
    var pinFragment = document.createDocumentFragment();
    var mapPins = dom.mapPinsList;
    deletePins(mapPins.children);
    for (var i = 0; i < NUMBER_OF_PINS; i++) {
      var announElement = window.data.createAnnounElement(i);
      var mapPin = window.pin.createMapPin(announElement);
      pinFragment.appendChild(mapPin);
    }
    mapPins.appendChild(pinFragment);
  };

  window.map = {
    onMainPinMouseDown: function (evt) {
      activateMap();
      var dragElement = evt.target;
      dom.mainPin.style.zIndex = 1000;

      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };

      var onMouseMove = function (moveEvt) {
        window.form.setAddressCoords(dragElement);
        window.util.checkBorders();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
          y: startCoords.y - moveEvt.clientY
        };

        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };

        dom.mainPin.style.top = dom.mainPin.offsetTop - shift.y + 'px';
        dom.mainPin.style.left = dom.mainPin.offsetLeft - shift.x + 'px';
      };

      var onMouseUp = function () {
        window.form.setAddressCoords(dragElement);
        showMapPins();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };
})();
