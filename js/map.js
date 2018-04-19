'use strict';

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var TIMINGS = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var ACCOMODATION_PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var X_LEFT_BORDER = 100;
var X_RIGHT_BORDER = 1150;
var Y_TOP_BORDER = 200;
var Y_BOTTOM_BORDER = 650;
var MIN_PRICE = 1000;
var MAX_PRICE = 1000000;
var NUMBER_OF_PINS = 8;
var MAIN_PIN_SIZE = 65;
var ESC_KEYCODE = 27;
var HOUSE_TYPES = {
  flat: 'Квартира',
  bungalo: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец'
};
var SHARP_END_HEIGHT = 12;

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
// Функции для получения адреса PIN'ов
var getPinPosX = function (x) {
  var offsetX = Math.round(PIN_WIDTH / 2);
  return x - offsetX;
};
var getPinPosY = function (y) {
  var offsetY = Math.round(PIN_HEIGHT);
  return y - offsetY;
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
    body: document.querySelector('body'),
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

  var mapCardElement = tmpl.querySelector('.map__card').cloneNode(true);
  mapCardElement.querySelector('.popup__title').textContent = arr.offer.title;
  mapCardElement.querySelector('.popup__text--address').textContent = arr.offer.address;
  mapCardElement.querySelector('.popup__text--price').textContent = arr.offer.price + currency;
  mapCardElement.querySelector('.popup__type').textContent = HOUSE_TYPES[arr.offer.type];
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
    var popup = document.querySelector('.popup');
    if (popup) {
      dom.map.removeChild(document.querySelector('.popup'));
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  // Создание метки
  var createMapPin = function (arrElement) {
    var mapPinElement = dom.template.querySelector('.map__pin').cloneNode(true);
    mapPinElement.style.left = getPinPosX(arrElement.location.x) + 'px';
    mapPinElement.style.top = getPinPosY(arrElement.location.y) + 'px';
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

  // Работа с формами
  var validateForms = function (form) {
    // ТЗ 2.1
    var formTitle = form.querySelector('#title');
    formTitle.addEventListener('invalid', function () {
      if (formTitle.validity.tooShort) {
        formTitle.setCustomValidity('Объявление должно состоять минимум из 30-ти символов');
      } else if (formTitle.validity.tooLong) {
        formTitle.setCustomValidity('Объявление должно состоять максимум из 100-та символов');
      } else if (formTitle.validity.valueMissing) {
        formTitle.setCustomValidity('Обязательное поле для заполнения');
      } else {
        formTitle.setCustomValidity('');
      }
    });

    // ТЗ 2.3
    var onFormTypeChange = function () {
      var selectedType = formTypeSelect.options[formTypeSelect.selectedIndex].value;
      if (selectedType === 'bungalo') {
        formPrice.min = '0';
        formPrice.placeholder = '0';
      } else if (selectedType === 'flat') {
        formPrice.min = '1000';
        formPrice.placeholder = '1000';
      } else if (selectedType === 'house') {
        formPrice.min = '5000';
        formPrice.placeholder = '5000';
      } else {
        formPrice.min = '10000';
        formPrice.placeholder = '10000';
      }
    };
    var formPrice = form.querySelector('#price');
    var formTypeSelect = form.querySelector('#type');
    formTypeSelect.addEventListener('change', onFormTypeChange);

    // ТЗ 2.5
    // Функция синхронизации времени
    var syncFormTimes = function (firstSelect, secondSelect) {
      var selectedTime = firstSelect.selectedIndex;
      if (!selectedTime) {
        secondSelect.options[0].selected = 'true';
      } else if (selectedTime === 1) {
        secondSelect.options[1].selected = 'true';
      } else {
        secondSelect.options[2].selected = 'true';
      }
    };

    // Обработчик изменения select'ов
    var onFormTimeChange = function (e) {
      if (e.target === formTimeIn) {
        syncFormTimes(e.target, formTimeOut);
      } else {
        syncFormTimes(e.target, formTimeIn);
      }
    };
    var formTimeIn = form.querySelector('#timein');
    var formTimeOut = form.querySelector('#timeout');
    formTimeIn.addEventListener('change', onFormTimeChange);
    formTimeOut.addEventListener('change', onFormTimeChange);

    // ТЗ 2.6
    var disableOptions = function (array) {
      for (var i = 0; i < array.length; i++) {
        guestsNumber.options[i].setAttribute('disabled', 'true');
      }
    };

    var onRoomSelectChange = function () {
      var selects = guestsNumber.options;
      var selectedIndex = roomNumber.selectedIndex;
      if (selectedIndex === 0) {
        disableOptions(guestsNumber.children);
        selects[2].removeAttribute('disabled');
        selects[2].selected = 'true';
      } else if (selectedIndex === 1) {
        disableOptions(guestsNumber.children);
        selects[2].removeAttribute('disabled');
        selects[1].removeAttribute('disabled');
        selects[1].selected = 'true';
      } else if (selectedIndex === 2) {
        disableOptions(guestsNumber.children);
        selects[2].removeAttribute('disabled');
        selects[1].removeAttribute('disabled');
        selects[0].removeAttribute('disabled');
        selects[0].selected = 'true';
      } else {
        disableOptions(guestsNumber.children);
        selects[3].removeAttribute('disabled');
        selects[3].selected = 'true';
      }
    };

    var roomNumber = form.querySelector('#room_number');
    var guestsNumber = form.querySelector('#capacity');
    roomNumber.addEventListener('change', onRoomSelectChange);
  };

  var activateMap = function () {
    dom.map.classList.remove('map--faded');
    dom.form.classList.remove('ad-form--disabled');
    for (var i = 0; i < dom.fieldsets.length; i++) {
      dom.fieldsets[i].removeAttribute('disabled');
    }
    validateForms(dom.form);
  };

  // Установка координат метки с самого начала и в поставленной точке, соответственно
  var setAddressCoords = function (trgt) {
    var left = Math.round(parseInt(dom.mainPin.style.left, 10) + MAIN_PIN_SIZE / 2);
    var top = Math.round(parseInt(dom.mainPin.style.top, 10) + MAIN_PIN_SIZE / 2);
    if (!trgt) {
      dom.address.value = left + ', ' + top;
    } else {
      left = Math.round(parseInt(dom.mainPin.style.left, 10) + MAIN_PIN_SIZE / 2);
      top = Math.round(parseInt(dom.mainPin.style.top, 10) + MAIN_PIN_SIZE + SHARP_END_HEIGHT);
      dom.address.value = left + ', ' + top;
    }
  };

  // Функция удаления меток, если они уже существуют на карте
  var deletePins = function (array) {
    for (var i = array.length - 1; i >= 0; i--) {
      if (array[i].type === 'button') {
        array[i].parentNode.removeChild(array[i]);
      }
    }
  };

  // Функция отрисовки меток при нажатии на главную метку
  var showMapPins = function () {
    var pinFragment = document.createDocumentFragment();
    var mapPins = dom.mapPinsList;
    deletePins(mapPins.children);
    for (var i = 0; i < NUMBER_OF_PINS; i++) {
      var announElement = createAnnounElement(i);
      var mapPin = createMapPin(announElement);
      pinFragment.appendChild(mapPin);
    }
    mapPins.appendChild(pinFragment);
  };

  // Обработчик на нажатие главной метки
  dom.mainPin.addEventListener('mousedown', function (e) {
    activateMap();
    var dragElement = e.target;
    dom.mainPin.style.zIndex = 1000;

    var startCoords = {
      x: e.clientX,
      y: e.clientY
    };

    var checkBorders = function () {
      // ТЗ 3.4
      var bottomBorder = dom.mainPin.offsetTop + MAIN_PIN_SIZE;
      if (bottomBorder > 500) {
        dom.mainPin.style.top = 500 - MAIN_PIN_SIZE + 'px';
      }
      // -----
      var topBorder = parseInt(dom.mainPin.style.top, 10);
      if (topBorder < 150) {
        dom.mainPin.style.top = 150 + 'px';
      }
      // -----
      var leftBorder = parseInt(dom.mainPin.style.left, 10);
      if (leftBorder < 0) {
        dom.mainPin.style.left = 0 + 'px';
      }
      // -----
      var rightBorder = parseInt(dom.mainPin.style.left, 10) + MAIN_PIN_SIZE;
      if (rightBorder > dom.body.clientWidth) {
        dom.mainPin.style.left = dom.body.clientWidth - MAIN_PIN_SIZE + 'px';
      }
    };

    // ------------------------------------------------

    var onMouseMove = function (moveEvt) {
      setAddressCoords(dragElement);
      checkBorders();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      dom.mainPin.style.top = (dom.mainPin.offsetTop - shift.y) + 'px';
      dom.mainPin.style.left = (dom.mainPin.offsetLeft - shift.x) + 'px';
    };

    // ------------------------------------------------

    var onMouseUp = function () {
      setAddressCoords(dragElement);
      showMapPins();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    // ------------------------------------------------

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  disableFields();
  setAddressCoords();
};
beginAction();
