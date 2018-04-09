'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMINGS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ACCOMODATION_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var AVATAR_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8];

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Нахождение случайного числа в промежутке [min, max)
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
// Функция для метода sort, для рандомного перемешивания массива
var compareFunction = function () {
  return Math.random() - 0.5;
};
// Рандомное перемешивание массива
var sortArray = function (arr) {
  return arr.sort(compareFunction);
};
// Нахождение центрального элемента массива
var findMiddleOfArray = function (arr) {
  return Math.round((arr.length - 1) / 2);
};

// Функция создания объекта объявления
var createAnnounElement = function (counter) {
  var coordX = getRandomInteger(100, 1150);
  var coordY = getRandomInteger(200, 650);
  var firstPart = getRandomInteger(0, findMiddleOfArray(FEATURES));
  var secondPart = getRandomInteger(findMiddleOfArray(FEATURES), FEATURES.length);
  return {
    author: {
      avatar: 'img/avatars/user0' + (counter + 1) + '.png'
    },
    offer: {
      title: TITLES[getRandomInteger(0, TITLES.length)],
      address: coordX + ', ' + coordY,
      price: String(getRandomInteger(1000, 1000000)),
      type: TYPES[getRandomInteger(0, TYPES.length)],
      rooms: getRandomInteger(1, 6),
      guests: getRandomInteger(1, 6),
      checkin: TIMINGS[getRandomInteger(0, TIMINGS.length)],
      checkout: TIMINGS[getRandomInteger(0, TIMINGS.length)],
      features: sortArray(FEATURES).slice(firstPart, secondPart),
      description: '',
      photos: sortArray(ACCOMODATION_PHOTOS)
    },
    location: {
      x: coordX,
      y: coordY
    }
  };
};

// Функция создания массива объектов объявлений
var createAnnouncements = function () {
  var announcements = [];
  for (var i = 0; i < 8; i++) {
    announcements.push(createAnnounElement(i));
  }
  return announcements;
};

var template = document.querySelector('template').content;

var mapPin = template.querySelector('.map__pin');
// Функция создания метки на карте
var createMapPin = function (arr) {
  var mapPinElement = mapPin.cloneNode(true);
  mapPinElement.style.left = (arr.location.x - 25) + 'px';
  mapPinElement.style.top = (arr.location.y - 70) + 'px';
  mapPinElement.querySelector('img').src = arr.author.avatar;
  mapPinElement.querySelector('img').alt = arr.offer.title;
  return mapPinElement;
};

var pinFragment = document.createDocumentFragment();
var mapPinsList = document.querySelector('.map__pins');
// Функция отрисовки меток
var renderMapPins = function () {
  for (var i = 0; i < createAnnouncements().length; i++) {
    pinFragment.appendChild(createMapPin(createAnnouncements()[i]));
  }
  mapPinsList.appendChild(pinFragment);
};
renderMapPins();

var mapCard = template.querySelector('.map__card');
// Функция создания карточки объявления
var createMapCard = function (arr) {
  var mapCardElement = mapCard.cloneNode(true);
  var photo = mapCardElement.querySelector('.popup__photos').querySelector('img');
  var ulFeature = mapCardElement.querySelector('.popup__features');
  var liFeatures = ulFeature.querySelectorAll('.popup__feature');
  mapCardElement.querySelector('.popup__title').textContent = arr.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = arr.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = arr.offer.price + '₽/ночь';
  // Работа с блоком Type
  if (arr.offer.type === 'flat') {
    mapCardElement.querySelector('.popup__type').textContent = 'Квартира';
  } else if (arr.offer.type === 'bungalo') {
    mapCardElement.querySelector('.popup__type').textContent = 'Бунгало';
  } else if (arr.offer.type === 'house') {
    mapCardElement.querySelector('.popup__type').textContent = 'Дом';
  } else {
    mapCardElement.querySelector('.popup__type').textContent = 'Дворец';
  }
  mapCardElement.querySelector('.popup__text--capacity').textContent = arr.offer.rooms + ' комнаты для ' + arr.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout;
  // Работа с блоком Features
  for (var i = 0; i < FEATURES.length; i++) {
    if (!arr.offer.features.some(function (elem) {
        return elem === FEATURES[i];
      })) {
      ulFeature.removeChild(liFeatures[i]);
    }
  }
  mapCardElement.querySelector('.popup__description').textContent = arr.offer.description;
  // Работа с блоком Photos
  mapCardElement.querySelector('.popup__photos').querySelector('img').src = arr.offer.photos[0];
  for (var i = 1; i < 3; i++) {
    mapCardElement.querySelector('.popup__photos').appendChild(photo.cloneNode()).src = arr.offer.photos[i];
  }
  mapCardElement.querySelector('.popup__avatar').src = arr.author.avatar;
  return mapCardElement;
};

var cardFragment = document.createDocumentFragment();
// Функция отрисовки карточки объявления
var renderMapCard = function () {
  cardFragment.appendChild(createMapCard(createAnnouncements()[0]));
  map.insertBefore(cardFragment, document.querySelector('.map__filters-container'));
};
renderMapCard();
