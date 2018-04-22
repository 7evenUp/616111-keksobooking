'use strict';

(function () {
  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var TIMINGS = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var ACCOMODATION_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var X_LEFT_BORDER = 100;
  var X_RIGHT_BORDER = 1150;
  var Y_TOP_BORDER = 150;
  var Y_BOTTOM_BORDER = 500;
  var MIN_PRICE = 1000;
  var MAX_PRICE = 1000000;

  window.data = {
    createAnnounElement: function (avatarNumber) {
      var photoNumber = avatarNumber < 9 ? '0' + (avatarNumber + 1) : avatarNumber + 1;
      var avatarSrc = 'img/avatars/user' + photoNumber + '.png';
      var coordX = window.util.getRandomInteger(X_LEFT_BORDER, X_RIGHT_BORDER);
      var coordY = window.util.getRandomInteger(Y_TOP_BORDER, Y_BOTTOM_BORDER);
      var firstPart = window.util.getRandomInteger(0, 3);
      var secondPart = window.util.getRandomInteger(3, FEATURES.length - 1);
      return {
        author: {
          avatar: avatarSrc
        },
        offer: {
          title: TITLES[window.util.getRandomInteger(0, TITLES.length - 1)],
          address: coordX + ', ' + coordY,
          price: window.util.getRandomInteger(MIN_PRICE, MAX_PRICE),
          type: TYPES[window.util.getRandomInteger(0, TYPES.length - 1)],
          rooms: window.util.getRandomInteger(1, 5),
          guests: window.util.getRandomInteger(1, 5),
          checkin: TIMINGS[window.util.getRandomInteger(0, TIMINGS.length - 1)],
          checkout: TIMINGS[window.util.getRandomInteger(0, TIMINGS.length - 1)],
          features: FEATURES.slice(firstPart, secondPart),
          description: '',
          photos: ACCOMODATION_PHOTOS
        },
        location: {
          x: coordX,
          y: coordY
        }
      };
    }
  };
})();
