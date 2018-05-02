'use strict';

window.map = (function () {
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

  return {
    showMapPins: function (data) {
      var pinFragment = document.createDocumentFragment();
      var mapPins = dom.mapPinsList;
      deletePins(mapPins.children);
      data.slice(0, 5).forEach(function (item) {
        var mapPin = window.pin.createMapPin(item);
        pinFragment.appendChild(mapPin);
      });
      mapPins.appendChild(pinFragment);
    },
    onMainPinMouseDown: function (evt) {
      var dragElement = evt.target;

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

        dom.mainPin.style.top = (dom.mainPin.offsetTop - shift.y) + 'px';
        dom.mainPin.style.left = (dom.mainPin.offsetLeft - shift.x) + 'px';
      };

      var onMouseUp = function () {
        window.form.setAddressCoords(dragElement);
        window.backend.getData();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      activateMap();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  };
})();
