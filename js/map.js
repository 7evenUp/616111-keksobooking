'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMINGS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ACCOMODATION_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_GAP = 25;
var LOCATION_Y_GAP = 70;
var X_LEFT_BORDER = 100;
var X_RIGHT_BORDER = 1151;
var Y_TOP_BORDER = 200;
var Y_BOTTOM_BORDER = 651;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000001;
var NUMBER_OF_PINS = 8;

// Нахождение случайного числа в промежутке [min, max)
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};
// Функция для метода sort, для рандомного перемешивания массива
var compareFunction = function () {
  return Math.random() - 0.5;
};
// Рандомное перемешивание массива
var shaffleArray = function (arr) {
  return arr.sort(compareFunction);
};
// Нахождение центрального элемента массива
var findMiddleOfArray = function (arr) {
  return Math.round((arr.length - 1) / 2);
};

// Начало основного функционала
// Функция вставки картинок в шаблон
var renderPhotos = function (array, mainTmplElement) {
  var photos = mainTmplElement.querySelector('.popup__photos');
  var photo = photos.querySelector('img');
  photo.src = array.offer.photos[0];
  for (var i = 1; i < 3; i++) {
    photos.appendChild(photo.cloneNode()).src = array.offer.photos[i];
  }
};
// Функция вставки сервисов в шаблон
var renderFeatures = function (array, mainTmplElement) {
  var ulFeature = mainTmplElement.querySelector('.popup__features');
  var liFeatures = ulFeature.querySelectorAll('.popup__feature');
  for (var i = 0; i < FEATURES.length; i++) {
    if (array.offer.features.some(function (elem) {
      return elem === FEATURES[i];
    })) {
      ulFeature.removeChild(liFeatures[i]);
    }
  }
};
// Функция получения объекта с ссылками на DOM элементы
var getDOMElements = function () {
  return {
    map: document.querySelector('.map'),
    mapPinsList: document.querySelector('.map__pins'),
    template: document.querySelector('template').content,
    filters: document.querySelector('.map__filters-container')
  };
};

// Функция создания объекта объявления
var createAnnounElement = function (avatarNumber) {
  var avatarSrc = avatarNumber < 9 ? 'img/avatars/user0' + (avatarNumber + 1) + '.png' :
    'img/avatars/user' + (avatarNumber + 1) + '.png';
  var coordX = getRandomInteger(X_LEFT_BORDER, X_RIGHT_BORDER);
  var coordY = getRandomInteger(Y_TOP_BORDER, Y_BOTTOM_BORDER);
  var firstPart = getRandomInteger(0, findMiddleOfArray(FEATURES));
  var secondPart = getRandomInteger(findMiddleOfArray(FEATURES), FEATURES.length);
  return {
    author: {
      avatar: avatarSrc
    },
    offer: {
      title: TITLES[getRandomInteger(0, TITLES.length)],
      address: coordX + ', ' + coordY,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: TYPES[getRandomInteger(0, TYPES.length)],
      rooms: getRandomInteger(1, 6),
      guests: getRandomInteger(1, 6),
      checkin: TIMINGS[getRandomInteger(0, TIMINGS.length)],
      checkout: TIMINGS[getRandomInteger(0, TIMINGS.length)],
      features: shaffleArray(FEATURES).slice(firstPart, secondPart),
      description: '',
      photos: shaffleArray(ACCOMODATION_PHOTOS)
    },
    location: {
      x: coordX,
      y: coordY
    }
  };
};

// Функция создания метки на карте
var createMapPin = function (arrElement, tmpl) {
  var mapPinElement = tmpl.querySelector('.map__pin').cloneNode(true);
  mapPinElement.style.left = (arrElement.location.x - LOCATION_X_GAP) + 'px';
  mapPinElement.style.top = (arrElement.location.y - LOCATION_Y_GAP) + 'px';
  mapPinElement.querySelector('img').src = arrElement.author.avatar;
  mapPinElement.querySelector('img').alt = arrElement.offer.title;
  return mapPinElement;
};
// Функция создания карточки объявления
var createMapCard = function (arr, typesObj, tmpl) {
  var currency = '₽/ночь';
  var roomsAndGuests = arr.offer.rooms + ' комнаты для ' + arr.offer.guests + ' гостей';
  var checkinCheckout = 'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout;
  var mapCardElement = tmpl.querySelector('.map__card').cloneNode(true);
  mapCardElement.querySelector('.popup__title').textContent = arr.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = arr.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = arr.offer.price + currency;
  mapCardElement.querySelector('.popup__type').textContent = typesObj[arr.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent = roomsAndGuests;
  mapCardElement.querySelector('.popup__text--time').textContent = checkinCheckout;
  mapCardElement.querySelector('.popup__description').textContent = arr.offer.description;
  mapCardElement.querySelector('.popup__avatar').src = arr.author.avatar;
  renderFeatures(arr, mapCardElement);
  renderPhotos(arr, mapCardElement);
  return mapCardElement;
};

// Функция, приводящая к рендерингу всех элементов
var renderAnnouncements = function () {
  var dom = getDOMElements();
  var pinFragment = document.createDocumentFragment();
  var cardFragment = document.createDocumentFragment();
  var announcements = [];

  if (dom.map) {
    dom.map.classList.remove('map--faded');
  }

  var mapPins = dom.mapPinsList;
  for (var i = 0; i < NUMBER_OF_PINS; i++) {
    var announElement = createAnnounElement(i);
    announcements.push(announElement);
    pinFragment.appendChild(createMapPin(announcements[i], dom.template));
  }
  mapPins.appendChild(pinFragment);

  var houseTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };
  var announce = createMapCard(announcements[0], houseTypes, dom.template);
  cardFragment.appendChild(announce);
  dom.map.insertBefore(cardFragment, dom.filters);

  return announcements;
};
renderAnnouncements();
