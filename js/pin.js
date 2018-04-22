'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var dom = util.dom;

  var openPopup = function (array) {
    var cardFragment = document.createDocumentFragment();
    var mapCard = card.createMapCard(array);
    cardFragment.appendChild(mapCard);
    dom.map.insertBefore(cardFragment, dom.filters);

    document.addEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
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

  var addCloseEvent = function () {
    var closeMapCard = document.querySelector('.popup__close');
    closeMapCard.addEventListener('click', function () {
      closePopup();
    });
  };

  window.pin = {
    createMapPin: function (arrElement) {
      var mapPin = dom.template.querySelector('.map__pin').cloneNode(true);
      mapPin.style.left = util.getPinPosX(arrElement.location.x) + 'px';
      mapPin.style.top = util.getPinPosY(arrElement.location.y) + 'px';
      mapPin.querySelector('img').src = arrElement.author.avatar;
      mapPin.querySelector('img').alt = arrElement.offer.title;

      mapPin.addEventListener('click', function () {
        if (document.querySelector('.popup')) {
          closePopup();
        }
        openPopup(arrElement);
        addCloseEvent();
      });

      return mapPin;
    }
  };
})()
