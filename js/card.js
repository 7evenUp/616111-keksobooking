'use strict';

(function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var HOUSE_TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var renderPhotos = function (arr, tmplElement) {
    var photos = tmplElement.querySelector('.popup__photos');
    var image = photos.querySelector('img');
    image.src = arr.offer.photos[0];
    for (var i = 1; i < 3; i++) {
      photos.appendChild(image.cloneNode()).src = arr.offer.photos[i];
    }
  };

  var renderFeatures = function (arr, tmplElement) {
    var ulFeature = tmplElement.querySelector('.popup__features');
    var liFeatures = ulFeature.querySelectorAll('.popup__feature');
    for (var i = 0; i < FEATURES.length; i++) {
      if (arr.offer.features.some(function (elem) {
        return elem === FEATURES[i];
      })) {
        ulFeature.removeChild(liFeatures[i]);
      }
    }
  };

  window.card = {
    createMapCard: function (array) {
      var dom = window.util.dom;
      var currency = '₽/ночь';
      var roomsAndGuests = array.offer.rooms + ' комнаты для ' + array.offer.guests + ' гостей';
      var checkinCheckout = 'Заезд после ' + array.offer.checkin + ', выезд до ' + array.offer.checkout;
      var mapCard = dom.template.querySelector('.map__card').cloneNode(true);
      mapCard.querySelector('.popup__title').textContent = array.offer.title;
      mapCard.querySelector('.popup__text--address').textContent = array.offer.address;
      mapCard.querySelector('.popup__text--price').textContent = array.offer.price + currency;
      mapCard.querySelector('.popup__type').textContent = HOUSE_TYPES[array.offer.type];
      mapCard.querySelector('.popup__text--capacity').textContent = roomsAndGuests;
      mapCard.querySelector('.popup__text--time').textContent = checkinCheckout;
      mapCard.querySelector('.popup__description').textContent = array.offer.description;
      mapCard.querySelector('.popup__avatar').src = array.author.avatar;
      renderFeatures(array, mapCard);
      renderPhotos(array, mapCard);
      return mapCard;
    }
  };

})();
