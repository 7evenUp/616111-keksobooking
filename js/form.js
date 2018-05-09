'use strict';

window.form = (function () {
  var MAIN_PIN_SIZE = 65;
  var SHARP_END_HEIGHT = 12;
  var SHOW_SUCCESS_TIME = 2000;
  var MinPrice = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000'
  };

  var dom = window.util.dom;
  var form = dom.form;

  var titleInput = form.querySelector('#title');
  var priceInput = form.querySelector('#price');
  var typeSelect = form.querySelector('#type');
  var timeInSelect = form.querySelector('#timein');
  var timeOutSelect = form.querySelector('#timeout');
  var timeSelects = form.querySelector('.ad-form__element--time');
  var roomSelect = form.querySelector('#room_number');
  var guestsSelect = form.querySelector('#capacity');

  var onTitleInputInvalid = function () {
    titleInput.addEventListener('input', function () {
      titleInput.setCustomValidity('');
    });

    if (titleInput.validity.tooShort) {
      titleInput.setCustomValidity('Заголовок должен состоять минимум из 30-ти символов');
    } else if (titleInput.validity.tooLong) {
      titleInput.setCustomValidity('Заголовок должен состоять максимум из 100-та символов');
    } else if (titleInput.validity.valueMissing) {
      titleInput.setCustomValidity('Обязательное поле для заполнения');
    } else {
      titleInput.setCustomValidity('');
    }
  };

  var onTypeSelectChange = function () {
    var selectedType = typeSelect.options[typeSelect.selectedIndex].value;
    priceInput.min = MinPrice[selectedType];
    priceInput.placeholder = MinPrice[selectedType];
  };

  var syncTimeSelects = function (firstSelect, secondSelect) {
    var selectedTime = firstSelect.selectedIndex;
    if (!selectedTime) {
      secondSelect.options[0].selected = 'true';
    } else if (selectedTime === 1) {
      secondSelect.options[1].selected = 'true';
    } else {
      secondSelect.options[2].selected = 'true';
    }
  };

  var onTimeSelectChange = function (evt) {
    if (evt.target === timeInSelect) {
      syncTimeSelects(evt.target, timeOutSelect);
    } else {
      syncTimeSelects(evt.target, timeInSelect);
    }
  };

  var disableOptions = function (array) {
    for (var i = 0; i < array.length; i++) {
      guestsSelect.options[i].setAttribute('disabled', 'true');
    }
  };

  var onRoomSelectChange = function () {
    var selects = guestsSelect.options;
    var selectedRoomNumber = roomSelect.selectedIndex;
    if (selectedRoomNumber === 0) {
      disableOptions(guestsSelect.children);
      selects[2].removeAttribute('disabled');
      selects[2].setAttribute('selected', 'true');
    } else if (selectedRoomNumber === 1) {
      disableOptions(guestsSelect.children);
      selects[2].removeAttribute('disabled');
      selects[1].removeAttribute('disabled');
      selects[1].setAttribute('selected', 'true');
    } else if (selectedRoomNumber === 2) {
      disableOptions(guestsSelect.children);
      selects[2].removeAttribute('disabled');
      selects[1].removeAttribute('disabled');
      selects[0].removeAttribute('disabled');
      selects[0].setAttribute('selected', 'true');
    } else {
      disableOptions(guestsSelect.children);
      selects[3].removeAttribute('disabled');
      selects[3].setAttribute('selected', 'true');
    }
  };

  var setCoordinations = function (trgt) {
    var address = dom.address;
    var left = Math.round(parseInt(dom.mainPin.style.left, 10) + MAIN_PIN_SIZE / 2);
    var top = Math.round(parseInt(dom.mainPin.style.top, 10) + MAIN_PIN_SIZE / 2);
    if (!trgt) {
      address.value = left + ', ' + top;
    } else {
      left = Math.round(parseInt(dom.mainPin.style.left, 10) + MAIN_PIN_SIZE / 2);
      top = Math.round(parseInt(dom.mainPin.style.top, 10) + MAIN_PIN_SIZE + SHARP_END_HEIGHT);
      address.value = left + ', ' + top;
    }
  };

  var onSuccess = function () {
    var success = document.querySelector('.success');
    success.classList.remove('hidden');
    setTimeout(function () {
      success.classList.add('hidden');
    }, SHOW_SUCCESS_TIME);
  };

  var onFormSumbit = function (evt) {
    evt.preventDefault();
    window.backend.upload(onSuccess, window.util.showErrorMsg);
    window.map.deactivate();
    setCoordinations();
  };

  return {
    validate: function () {
      titleInput.addEventListener('invalid', onTitleInputInvalid);
      typeSelect.addEventListener('change', onTypeSelectChange);
      timeSelects.addEventListener('change', onTimeSelectChange);
      roomSelect.addEventListener('change', onRoomSelectChange);
      form.addEventListener('submit', onFormSumbit);
    },
    setAddressCoords: setCoordinations
  };
})();
