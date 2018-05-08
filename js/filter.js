'use strict';

window.filter = (function () {
  var LOWER_PRICE = 10000;
  var HIGHER_PRICE = 50000;

  var dom = window.util.dom;

  var Filter = {
    TYPE: dom.divFilters.querySelector('#housing-type'),
    PRICE: dom.divFilters.querySelector('#housing-price'),
    ROOMS: dom.divFilters.querySelector('#housing-rooms'),
    GUESTS: dom.divFilters.querySelector('#housing-guests')
  };

  var transferNumToStr = function (num) {
    if (num < LOWER_PRICE) {
      return 'low';
    } else if (num >= LOWER_PRICE && num <= HIGHER_PRICE) {
      return 'middle';
    } else {
      return 'high';
    }
  };

  var isSameType = function (it) {
    if (Filter.TYPE.value === 'any') {
      return it;
    }
    return it.offer.type === Filter.TYPE.value;
  };

  var isSamePrice = function (it) {
    if (Filter.PRICE.value === 'any') {
      return it;
    }
    return transferNumToStr(it.offer.price) === Filter.PRICE.value;
  };

  var isSameRooms = function (it) {
    if (Filter.ROOMS.value === 'any') {
      return it;
    }
    return it.offer.rooms === parseInt(Filter.ROOMS.value, 10);
  };

  var isSameGuests = function (it) {
    if (Filter.GUESTS.value === 'any') {
      return it;
    }
    return it.offer.guests === parseInt(Filter.GUESTS.value, 10);
  };

  var isSameFeatures = function (it, checkedArr) {
    if (checkedArr.length === 0) {
      return true;
    }
    var flag = true;

    if (!checkedArr.every(function (elem) {
      return it.offer.features.some(function (elem1) {
        return elem === elem1;
      });
    })) {
      flag = false;
    }
    return flag;
  };

  var checkedFeatures = [];
  var createCheckedFeatures = function (array, evt) {
    var target = evt.target;
    if (target.type === 'checkbox') {
      if (array.some(function (elem) {
        return elem === target.value;
      })) {
        array.some(function (elem) {
          if (elem === target.value) {
            array.splice(array.indexOf(elem), 1);
          }
        });
      } else {
        array.push(target.value);
      }
    }
  };

  return {
    updateMap: function (pins, evt) {
      createCheckedFeatures(checkedFeatures, evt);

      var uniquePins = pins.filter(function (item) {
        return isSameType(item) && isSamePrice(item) && isSameRooms(item) && isSameGuests(item) && isSameFeatures(item, checkedFeatures);
      });

      window.map.showPins(uniquePins);
    },
    clearForms: function (filter, form) {
      checkedFeatures = [];
      filter.reset();
      form.reset();
    }
  };
})();
