'use strict';

window.card = (function () {
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var HOUSE_TYPES = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var renderPhotos = function (arrElem, tmplElement) {
    var photos = tmplElement.querySelector('.popup__photos');
    var image = photos.querySelector('img');
    if (arrElem.offer.photos.length === 0) {
      photos.removeChild(image);
    }
    for (var i = 0; i < arrElem.offer.photos.length; i++) {
      if (i === 0) {
        image.src = arrElem.offer.photos[0];
      } else {
        photos.appendChild(image.cloneNode()).src = arrElem.offer.photos[i];
      }
    }
  };

  var renderFeatures = function (arrElem, tmplElement) {
    var ulFeature = tmplElement.querySelector('.popup__features');
    var liFeatures = ulFeature.querySelectorAll('.popup__feature');
    for (var i = 0; i < FEATURES.length; i++) {
      if (!arrElem.offer.features.some(function (elem) {
        return elem === FEATURES[i];
      })) {
        ulFeature.removeChild(liFeatures[i]);
      }
    }
  };

  return {
    createMapCard: function (arrElem) {
      var dom = window.util.dom;
      var currency = '₽/ночь';
      var roomsAndGuests = arrElem.offer.rooms + ' комнаты для ' + arrElem.offer.guests + ' гостей';
      var checkinCheckout = 'Заезд после ' + arrElem.offer.checkin + ', выезд до ' + arrElem.offer.checkout;
      var mapCard = dom.template.querySelector('.map__card').cloneNode(true);
      mapCard.querySelector('.popup__title').textContent = arrElem.offer.title;
      mapCard.querySelector('.popup__text--address').textContent = arrElem.offer.address;
      mapCard.querySelector('.popup__text--price').textContent = arrElem.offer.price + currency;
      mapCard.querySelector('.popup__type').textContent = HOUSE_TYPES[arrElem.offer.type];
      mapCard.querySelector('.popup__text--capacity').textContent = roomsAndGuests;
      mapCard.querySelector('.popup__text--time').textContent = checkinCheckout;
      mapCard.querySelector('.popup__description').textContent = arrElem.offer.description;
      mapCard.querySelector('.popup__avatar').src = arrElem.author.avatar;
      renderFeatures(arrElem, mapCard);
      renderPhotos(arrElem, mapCard);
      return mapCard;
    }
  };

})();
