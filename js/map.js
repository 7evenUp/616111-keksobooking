'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMINGS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ACCOMODATION_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var LOCATION_X_GAP = 25;
var LOCATION_Y_GAP = 70;
var X_LEFT_BORDER = 100;
var X_RIGHT_BORDER = 1150;
var Y_TOP_BORDER = 200;
var Y_BOTTOM_BORDER = 650;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var NUMBER_OF_PINS = 8;
var MAIN_PIN_SIZE = 65;
var ESC_KEYCODE = 27;

// Нахождение случайного числа в промежутке [min, max]
var getRandomInteger = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
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
    mainPin: document.querySelector('.map__pin--main'),
    template: document.querySelector('template').content,
    filters: document.querySelector('.map__filters-container'),
    form: document.querySelector('.ad-form'),
    fieldsets: document.querySelector('.ad-form').querySelectorAll('fieldset'),
    address: document.querySelector('#address')
  };
};

// Функция создания объекта объявления
var createAnnounElement = function (avatarNumber) {
  var photoNumber = avatarNumber < 9 ? '0' + (avatarNumber + 1) : avatarNumber + 1;
  var avatarSrc = 'img/avatars/user' + photoNumber + '.png';
  var coordX = getRandomInteger(X_LEFT_BORDER, X_RIGHT_BORDER);
  var coordY = getRandomInteger(Y_TOP_BORDER, Y_BOTTOM_BORDER);
  var firstPart = getRandomInteger(0, findMiddleOfArray(FEATURES) - 1);
  var secondPart = getRandomInteger(findMiddleOfArray(FEATURES), FEATURES.length - 1);
  return {
    author: {
      avatar: avatarSrc
    },
    offer: {
      title: TITLES[getRandomInteger(0, TITLES.length - 1)],
      address: coordX + ', ' + coordY,
      price: getRandomInteger(MIN_PRICE, MAX_PRICE),
      type: TYPES[getRandomInteger(0, TYPES.length - 1)],
      rooms: getRandomInteger(1, 5),
      guests: getRandomInteger(1, 5),
      checkin: TIMINGS[getRandomInteger(0, TIMINGS.length - 1)],
      checkout: TIMINGS[getRandomInteger(0, TIMINGS.length - 1)],
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

// Функция создания карточки объявления
var createMapCard = function (arr, tmpl) {
  var currency = '₽/ночь';
  var roomsAndGuests = arr.offer.rooms + ' комнаты для ' + arr.offer.guests + ' гостей';
  var checkinCheckout = 'Заезд после ' + arr.offer.checkin + ', выезд до ' + arr.offer.checkout;
  var houseTypes = {
    flat: 'Квартира',
    bungalo: 'Бунгало',
    house: 'Дом',
    palace: 'Дворец'
  };

  var mapCardElement = tmpl.querySelector('.map__card').cloneNode(true);
  mapCardElement.querySelector('.popup__title').textContent = arr.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = arr.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = arr.offer.price + currency;
  mapCardElement.querySelector('.popup__type').textContent = houseTypes[arr.offer.type];
  mapCardElement.querySelector('.popup__text--capacity').textContent = roomsAndGuests;
  mapCardElement.querySelector('.popup__text--time').textContent = checkinCheckout;
  mapCardElement.querySelector('.popup__description').textContent = arr.offer.description;
  mapCardElement.querySelector('.popup__avatar').src = arr.author.avatar;
  renderFeatures(arr, mapCardElement);
  renderPhotos(arr, mapCardElement);
  return mapCardElement;
};

// Функция, которая руководит взаимодейсвтием с пользователем
var beginAction = function () {
  var dom = getDOMElements();

  var disableFields = function () {
    for (var i = 0; i < dom.fieldsets.length; i++) {
      dom.fieldsets[i].setAttribute('disabled', 'disabled');
    }
  };

  // Функция открытия окна информации
  var openPopup = function (array) {
    var cardFragment = document.createDocumentFragment();
    var mapCard = createMapCard(array, dom.template);
    cardFragment.appendChild(mapCard);
    dom.map.insertBefore(cardFragment, dom.filters);

    document.addEventListener('keydown', onPopupEscPress);
  };

  // Функция закрытия окна информации
  var onPopupEscPress = function (e) {
    if (e.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var closePopup = function () {
    dom.map.removeChild(document.querySelector('.popup'));
    document.removeEventListener('keydown', onPopupEscPress);
  };

  // Создание метки
  var createMapPin = function (arrElement) {
    var mapPinElement = dom.template.querySelector('.map__pin').cloneNode(true);
    mapPinElement.style.left = (arrElement.location.x - LOCATION_X_GAP) + 'px';
    mapPinElement.style.top = (arrElement.location.y - LOCATION_Y_GAP) + 'px';
    mapPinElement.querySelector('img').src = arrElement.author.avatar;
    mapPinElement.querySelector('img').alt = arrElement.offer.title;

    // Добавление обработчиков событий
    mapPinElement.addEventListener('click', function () {
      // Проверка на уже открытое окно, чтобы они не накапливались
      if (document.querySelector('.popup')) {
        closePopup();
      }
      openPopup(arrElement);
      // Объявление переменной здесь, потому что искомый элемент появляется только после openPopup()
      var closeMapCard = document.querySelector('.popup__close');
      closeMapCard.addEventListener('click', function () {
        closePopup();
      });
    });

    return mapPinElement;
  };

  var activateMap = function () {
    dom.map.classList.remove('map--faded');
    dom.form.classList.remove('ad-form--disabled');
    for (var i = 0; i < dom.fieldsets.length; i++) {
      dom.fieldsets[i].removeAttribute('disabled');
    }
  };

  // Установка координат метки с самого начала и в поставленной точке, соответственно
  var setCoords = function (trgt) {
    var left = Math.round(parseInt(dom.mainPin.style.left, 10) + MAIN_PIN_SIZE / 2);
    var top = Math.round(parseInt(dom.mainPin.style.top, 10) + MAIN_PIN_SIZE / 2);
    if (!trgt) {
      dom.address.value = left + ', ' + top;
    } else {
      left = Math.round(parseInt(dom.mainPin.style.left, 10) + MAIN_PIN_SIZE / 2);
      top = Math.round(parseInt(dom.mainPin.style.top, 10) + MAIN_PIN_SIZE);
      dom.address.value = left + ', ' + top;
    }
  };

  // Функция отрисовки меток при нажатии на главную метку
  var showMapPins = function () {
    var pinFragment = document.createDocumentFragment();
    var mapPins = dom.mapPinsList;
    for (var i = 0; i < NUMBER_OF_PINS; i++) {
      var announElement = createAnnounElement(i);
      var mapPin = createMapPin(announElement);
      pinFragment.appendChild(mapPin);
    }
    mapPins.appendChild(pinFragment);
  };

  // Обработчик на нажатие главной метки
  dom.mainPin.addEventListener('mouseup', function (e) {
    var target = e.target;
    activateMap();
    setCoords(target);
    showMapPins();
  });

  disableFields();
  setCoords();
};
beginAction();
