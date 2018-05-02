'use strict';

window.filter = (function () {
  var dom = window.util.dom;

  var Filter = {
    TYPE: dom.filters.querySelector('#housing-type'),
    PRICE: dom.filters.querySelector('#housing-price'),
    ROOMS: dom.filters.querySelector('#housing-rooms'),
    GUESTS: dom.filters.querySelector('#housing-guests'),
    FEATURES: dom.filters.querySelector('#housing-features').children,
    WIFI: dom.filters.querySelector('#filter-wifi'),
    DISHWASHER: dom.filters.querySelector('#filter-dishwasher'),
    PARKING: dom.filters.querySelector('#filter-parking'),
    WASHER: dom.filters.querySelector('#filter-washer'),
    ELEVATOR: dom.filters.querySelector('#filter-elevator'),
    CONDITIONER: dom.filters.querySelector('#filter-conditioner')
  };

  var transferNumToStr = function (num) {
    if (num < 10000) {
      return 'low';
    } else if (num >= 10000 && num <= 50000) {
      return 'middle';
    } else {
      return 'high';
    }
  };

  var isSameType = function (it) {
    if (Filter.TYPE.value === 'any') {
      return it;
    } else {
      return it.offer.type === Filter.TYPE.value;
    }
  };

  var isSamePrice = function (it) {
    if (Filter.PRICE.value === 'any') {
      return it;
    } else {
      return transferNumToStr(it.offer.price) === Filter.PRICE.value;
    }
  };

  var isSameRooms = function (it) {
    if (Filter.ROOMS.value === 'any') {
      return it;
    } else {
      return it.offer.rooms === parseInt(Filter.ROOMS.value, 10);
    }
  };

  var isSameGuests = function (it) {
    if (Filter.GUESTS.value === 'any') {
      return it;
    } else {
      return it.offer.guests === parseInt(Filter.GUESTS.value, 10);
    }
  };

  // var isSameFeatures = function (it, checked) {
  //   return it.offer.features.every(function (elem1) {
  //     return checked.some(function (elem2) {
  //       return elem1 === elem2;
  //     });
  //   });
  // };

  return {
    updateMap: function (pins) {
      var uniquePins = pins.filter(function (item) {
        return isSameType(item) && isSamePrice(item) && isSameRooms(item) && isSameGuests(item);
      });

      window.map.showMapPins(uniquePins);
    }
  };

})();
