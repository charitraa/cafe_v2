/* Opening popup for the brand statement on the home page. The same copy also
   lives in the .banner section further down the page; this puts it in front of
   the visitor the moment the site opens. */
(function () {
  'use strict';

  var popup = document.getElementById('introPopup');
  if (!popup) return;

  /* Set to true to show the popup only once per browsing session instead of on
     every page load. */
  var ONCE_PER_SESSION = false;
  var STORAGE_KEY = 'swadgasmIntroSeen';

  /* Long enough for the hero to paint behind the popup, short enough that it
     still reads as part of opening the site. */
  var OPEN_DELAY = 700;

  var lastFocused = null;

  function seen() {
    if (!ONCE_PER_SESSION) return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function remember() {
    if (!ONCE_PER_SESSION) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (e) { /* private browsing — just show it again next time */ }
  }

  function open() {
    lastFocused = document.activeElement;
    popup.hidden = false;
    /* Next frame, so the browser has a hidden->visible state to transition. */
    requestAnimationFrame(function () {
      popup.classList.add('is-open');
    });
    document.body.classList.add('intro-popup-open');
    document.addEventListener('keydown', onKeydown);
    var close = popup.querySelector('.intro-popup_close');
    if (close) close.focus();
    remember();
  }

  function close() {
    popup.classList.remove('is-open');
    document.body.classList.remove('intro-popup-open');
    document.removeEventListener('keydown', onKeydown);
    window.setTimeout(function () {
      popup.hidden = true;
    }, 300);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') close();
  }

  Array.prototype.forEach.call(
    popup.querySelectorAll('[data-intro-popup-close]'),
    function (el) { el.addEventListener('click', close); }
  );

  if (!seen()) window.setTimeout(open, OPEN_DELAY);
})();
