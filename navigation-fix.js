/* إصلاح الرجوع: يتتبع تغييرات الشاشات تلقائيًا، مع منع تكرار السجل القديم. */
(function () {
  'use strict';
  if (window.__ta3lemyNavigationFixInstalled) return;

  var originalShowScreen = window.showScreen;
  if (typeof originalShowScreen !== 'function') return;

  var ROOT_SCREENS = { splashScreen: true, loginScreen: true };
  var movingBack = false;

  function historyList() {
    if (!Array.isArray(window.screenHistory)) window.screenHistory = [];
    return window.screenHistory;
  }

  function isRealScreen(id) {
    if (typeof id !== 'string' || !id) return false;
    var el = document.getElementById(id);
    return !!(el && el.classList && el.classList.contains('screen'));
  }

  function appendPrevious(id) {
    if (!id || ROOT_SCREENS[id]) return;
    var history = historyList();
    // أغلب انتقالات المنصة تضيف الشاشة الحالية بنفسها؛ لا نكرر إضافتها.
    if (history[history.length - 1] === id) return;
    history.push(id);
    if (history.length > 60) history.splice(0, history.length - 60);
  }

  window.showScreen = function (targetId) {
    var from = window.currentScreen;
    if (!movingBack && from && targetId !== from && !ROOT_SCREENS[from] && isRealScreen(targetId)) {
      appendPrevious(from);
    }
    return originalShowScreen.apply(this, arguments);
  };

  window.goBack = function () {
    var current = window.currentScreen;
    var history = historyList();
    var previous = null;
    // تجاهل أي شاشات مكررة أو محذوفة قديمة في السجل.
    while (history.length) {
      var candidate = history.pop();
      if (candidate !== current && isRealScreen(candidate)) {
        previous = candidate;
        break;
      }
    }
    if (!previous) previous = 'homeScreen';
    movingBack = true;
    try {
      window.showScreen(previous);
    } finally {
      movingBack = false;
    }
  };

  window.__ta3lemyNavigationFixInstalled = true;
})();
