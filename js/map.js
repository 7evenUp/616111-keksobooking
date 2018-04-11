'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMINGS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ACCOMODATION_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_GAP = 25;
var LOCATION_Y_GAP = 70;

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

// Начало основного функционала

// Функция выбора соответсвующего типа жилья
var selectCorrectType = function (array) {
  if (array.offer.type === 'flat') {
    return 'Квартира';
  } else if (array.offer.type === 'bungalo') {
    return 'Бунгало';
  } else if (array.offer.type === 'house') {
    return 'Дом';
  } else {
    return 'Дворец';
  }
};
// Функция вставки картинок в шаблон
var renderPhotos = function (array, mainTmplElement) {
  var photos = mainTmplElement.querySelector('.popup__photos');
  var photo = mainTmplElement.querySelector('.popup__photos').querySelector('img');
  photo.src = array.offer.photos[0];
  for (var i = 1; i < 3; i++) {
    photos.appendChild(photo.cloneNode()).src = array.offer.photos[i];
  }
};
// Функция вставки сервисов в шаблон
var renderFeatures = function (array, mainTmplElement) {
  var ulFeature = mainTmplElement.querySelector('.popup__features');
  var liFeatures = ulFeature.querySelectorAll('.popup__feature');
  for (var i = FEATURES.length - 1; i >= 0; i--) {
    if (array.offer.features.some(function (elem) {
      return elem === FEATURES.reverse()[i];
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
var createAnnounElement = function (avatar_number) {
  var coordX = getRandomInteger(100, 1150);
  var coordY = getRandomInteger(200, 650);
  var firstPart = getRandomInteger(0, findMiddleOfArray(FEATURES));
  var secondPart = getRandomInteger(findMiddleOfArray(FEATURES), FEATURES.length);
  return {
    author: {
      avatar: avatar_number < 9 ? 'img/avatars/user0' + (avatar_number + 1) + '.png':
                                  'img/avatars/user' + (avatar_number + 1) + '.png'
    },
    offer: {
      title: TITLES[getRandomInteger(0, TITLES.length)],
      address: coordX + ', ' + coordY,
      price: getRandomInteger(1000, 1000001),
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

var template = document.querySelector('template').content;
// Функция создания метки на карте
var createMapPin = function (arrElement) {
  var mapPinElement = template.querySelector('.map__pin').cloneNode(true);
  mapPinElement.style.left = (arrElement.location.x - LOCATION_X_GAP) + 'px';
  mapPinElement.style.top = (arrElement.location.y - LOCATION_Y_GAP) + 'px';
  mapPinElement.querySelector('img').src = arrElement.author.avatar;
  mapPinElement.querySelector('img').alt = arrElement.offer.title;
  return mapPinElement;
};
// Функция создания карточки объявления
var createMapCard = function (arr) {
  var mapCardElement = template.querySelector('.map__card').cloneNode(true);
  mapCardElement.querySelector('.popup__title').textContent = arr.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = arr.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = arr.offer.price + '₽/ночь';
  mapCardElement.querySelector('.popup__type').textContent = selectCorrectType(arr),
  mapCardElement.querySelector('.popup__text--capacity').textContent = arr.offer.rooms + ' комнаты для ' + arr.offer.guests + ' гостей';
  mapCardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout;
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
  for (var i = 0; i < 8; i++) {
    var announElement = createAnnounElement(i);
    announcements.push(announElement);
    pinFragment.appendChild(createMapPin(announcements[i]));
  }
  mapPins.appendChild(pinFragment);

  var announce = createMapCard(announcements[0]);
  cardFragment.appendChild(announce);
  dom.map.insertBefore(cardFragment, dom.filters);

  return announcements;
};
renderAnnouncements();
