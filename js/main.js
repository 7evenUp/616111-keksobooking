'use strict';

(function () {
  var dom = window.util.dom;
  var mainPin = dom.mainPin;

  mainPin.addEventListener('mousedown', window.map.onMainPinMouseDown);
  window.util.disableFields();
  window.form.setAddressCoords();
})();
