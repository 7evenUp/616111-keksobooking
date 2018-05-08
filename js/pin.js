'use strict';

window.pin = (function () {
  var ESC_KEYCODE = 27;

  var dom = window.util.dom;

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  };

  var closePopup = function () {
    var popup = document.querySelector('.popup');
    if (popup) {
      dom.map.removeChild(popup);
      document.removeEventListener('keydown', onPopupEscPress);
    }
  };

  var addCloseEvents = function () {
    var closeMapCard = document.querySelector('.popup__close');
    closeMapCard.addEventListener('click', function () {
      closePopup();
    });
    document.addEventListener('keydown', onPopupEscPress);
  };

  var openPopup = function (arrElem) {
    if (document.querySelector('.popup')) {
      closePopup();
    }
    var cardFragment = document.createDocumentFragment();
    var mapCard = window.card.createPopup(arrElem);
    cardFragment.appendChild(mapCard);
    dom.map.insertBefore(cardFragment, dom.divFilters);
    addCloseEvents();
  };

  return {
    create: function (arrElement) {
      var mapPin = dom.template.querySelector('.map__pin').cloneNode(true);
      mapPin.style.left = window.util.getPinPosX(arrElement.location.x) + 'px';
      mapPin.style.top = window.util.getPinPosY(arrElement.location.y) + 'px';
      mapPin.querySelector('img').src = arrElement.author.avatar;
      mapPin.querySelector('img').alt = arrElement.offer.title;

      mapPin.addEventListener('click', function () {
        openPopup(arrElement);
      });

      return mapPin;
    },
    closePopup: closePopup
  };
})();
