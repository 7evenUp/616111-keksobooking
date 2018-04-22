'use strict';

(function () {
  var dom = util.dom;
  var mainPin = dom.mainPin;

  mainPin.addEventListener('mousedown', map.onMainPinMouseDown);
  util.disableFields();
  form.setAddressCoords();
})()
