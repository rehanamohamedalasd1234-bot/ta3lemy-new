/* تحديث مباشر للتطبيق — فحص النسخة المنشورة وتنبيه المستخدم داخل التطبيق */
(function () {
  'use strict';

  var VERSION_URL = 'https://github.com/rehanamohamedalasd1234-bot/ta3lemy-new/releases/latest/download/ta3lemy-version.json';
  var APK_URL = 'https://github.com/rehanamohamedalasd1234-bot/ta3lemy-new/releases/latest/download/ta3lemy-hafez.apk';
  var SITE_URL = 'https://rehanamohamedalasd1234-bot.github.io/ta3lemy-new/';
  var localVersion = '0.0.0';
  var latestVersion = null;
  var modalId = 'ta3lemyUpdateModal';
  var bannerId = 'ta3lemyUpdateBanner';
  var checkKey = 'ta3lemy_update_last_check';
  var noticeKey = 'ta3lemy_update_notified_';

  function compareVersions(a, b) {
    var left = String(a || '0').replace(/^v/i, '').split('.').map(Number);
    var right = String(b || '0').replace(/^v/i, '').split('.').map(Number);
    for (var i = 0; i < Math.max(left.length, right.length); i += 1) {
      var x = Number.isFinite(left[i]) ? left[i] : 0;
      var y = Number.isFinite(right[i]) ? right[i] : 0;
      if (x > y) return 1;
      if (x < y) return -1;
    }
    return 0;
  }

  function notify(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
    else if (typeof window.alert === 'function') window.alert(message);
  }

  function readLocalVersion() {
    return fetch('./version.json?cacheBust=' + Date.now(), { cache: 'no-store' })
      .then(function (response) { return response.ok ? response.json() : {}; })
      .then(function (data) {
        localVersion = String(data.version || window.TA3LEMY_VERSION || '0.0.0');
        return localVersion;
      })
      .catch(function () { return localVersion; });
  }

  function removeModal() {
    var old = document.getElementById(modalId);
    if (old) old.remove();
  }

  function removeBanner() {
    var old = document.getElementById(bannerId);
    if (old) old.remove();
  }

  function showUpdateBanner(info) {
    removeBanner();
    var banner = document.createElement('div');
    banner.id = bannerId;
    banner.dir = 'rtl';
    banner.style.cssText = 'position:fixed;top:14px;left:14px;right:14px;z-index:99998;background:linear-gradient(135deg,#0D47A1,#1976D2);color:#fff;border-radius:16px;padding:14px 16px;box-shadow:0 8px 28px rgba(13,71,161,.35);font-family:Cairo,Arial,sans-serif;display:flex;align-items:center;gap:12px;flex-wrap:wrap;';
    var content = document.createElement('div');
    content.style.cssText = 'flex:1;min-width:210px;line-height:1.65;font-size:13px;';
    content.innerHTML = '<b style="font-size:15px">يتوفر إصدار جديد من منصة حافظ</b><br><span>الإصدار الحالي: ' + escapeHtml(localVersion) + ' — الإصدار الجديد: ' + escapeHtml(info.version) + '</span>';
    var download = document.createElement('a');
    download.href = APK_URL;
    download.target = '_blank';
    download.rel = 'noopener';
    download.textContent = 'تحميل التحديث';
    download.style.cssText = 'background:#fff;color:#0D47A1;text-decoration:none;border-radius:10px;padding:9px 13px;font-weight:800;font-size:12px;white-space:nowrap;';
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'لاحقًا';
    close.style.cssText = 'border:1px solid rgba(255,255,255,.65);background:transparent;color:#fff;border-radius:10px;padding:8px 10px;font:inherit;font-size:12px;cursor:pointer;';
    close.onclick = removeBanner;
    banner.appendChild(content);
    banner.appendChild(download);
    banner.appendChild(close);
    document.body.appendChild(banner);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; });
  }

  function showModal(info, hasUpdate, checking) {
    removeModal();
    var overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.dir = 'rtl';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:100000;background:rgba(0,0,0,.58);display:flex;align-items:center;justify-content:center;padding:18px;font-family:Cairo,Arial,sans-serif;';
    var card = document.createElement('div');
    card.style.cssText = 'width:min(440px,100%);background:#fff;border-radius:22px;padding:24px;box-shadow:0 14px 50px rgba(0,0,0,.3);text-align:center;color:#263238;';
    var title = document.createElement('h2');
    title.textContent = hasUpdate ? 'يتوفر تحديث جديد' : (checking ? 'جاري فحص التحديثات...' : 'التطبيق محدث');
    title.style.cssText = 'margin:0 0 12px;color:#1B5E20;font-size:21px;';
    var text = document.createElement('p');
    text.style.cssText = 'white-space:pre-line;line-height:1.9;margin:0 0 16px;font-size:14px;';
    if (checking) text.textContent = 'يرجى الانتظار لحظات...';
    else if (hasUpdate) text.textContent = 'الإصدار المثبت: ' + localVersion + ' — الإصدار الأحدث: ' + info.version + (info.notes ? '\n' + info.notes : '');
    else text.textContent = 'أنت تستخدم آخر إصدار متاح حالياً (' + localVersion + ').';
    card.appendChild(title);
    card.appendChild(text);
    if (!checking && hasUpdate) {
      var download = document.createElement('a');
      download.href = APK_URL;
      download.target = '_blank';
      download.rel = 'noopener';
      download.textContent = '⬇️ تحميل التحديث';
      download.style.cssText = 'display:block;background:#2E7D32;color:#fff;text-decoration:none;padding:13px 16px;border-radius:12px;font-weight:bold;margin-bottom:10px;';
      card.appendChild(download);
      var note = document.createElement('div');
      note.textContent = 'بعد التحميل افتح ملف APK ووافق على تثبيته فوق النسخة الحالية.';
      note.style.cssText = 'font-size:12px;color:#607D8B;line-height:1.7;margin-bottom:12px;';
      card.appendChild(note);
    }
    var site = document.createElement('a');
    site.href = SITE_URL;
    site.target = '_blank';
    site.rel = 'noopener';
    site.textContent = 'فتح أحدث نسخة من المنصة';
    site.style.cssText = 'display:block;color:#1565C0;text-decoration:none;font-size:13px;margin:8px 0 14px;';
    card.appendChild(site);
    var close = document.createElement('button');
    close.type = 'button';
    close.textContent = 'إغلاق';
    close.onclick = removeModal;
    close.style.cssText = 'border:0;background:#ECEFF1;color:#37474F;padding:11px 24px;border-radius:11px;font:inherit;cursor:pointer;';
    card.appendChild(close);
    overlay.appendChild(card);
    overlay.addEventListener('click', function (event) { if (event.target === overlay) removeModal(); });
    document.body.appendChild(overlay);
  }

  function requestNotificationPermission() {
    if (!('Notification' in window) || Notification.permission !== 'default') return Promise.resolve();
    return Promise.resolve();
  }

  function checkAppUpdate(options) {
    options = options || {};
    var silent = options.silent === true;
    if (!silent) showModal({}, false, true);
    return readLocalVersion().then(function () {
      return fetch(VERSION_URL + '?cacheBust=' + Date.now(), { cache: 'no-store' });
    }).then(function (response) {
      if (!response.ok) throw new Error('version request failed');
      return response.json();
    }).then(function (info) {
      latestVersion = info;
      var hasUpdate = compareVersions(info.version, localVersion) > 0;
      if (hasUpdate && silent) {
        var noticeId = noticeKey + String(info.version);
        var alreadyNotified = false;
        try { alreadyNotified = localStorage.getItem(noticeId) === '1'; } catch (_) {}
        if (!alreadyNotified) {
          try { localStorage.setItem(noticeId, '1'); } catch (_) {}
          showUpdateBanner(info);
          notify('يتوفر تحديث جديد لمنصة حافظ: الإصدار ' + info.version);
        }
      } else if (!silent) {
        showModal(info, hasUpdate, false);
      }
      try { localStorage.setItem(checkKey, String(Date.now())); } catch (_) {}
      return info;
    }).catch(function () {
      if (!silent) {
        removeModal();
        notify('تعذر فحص التحديث الآن. تحقق من اتصال الإنترنت وحاول مرة أخرى.');
      }
      return null;
    });
  }

  function scheduleAutomaticCheck() {
    var sixHours = 6 * 60 * 60 * 1000;
    var last = 0;
    try { last = Number(localStorage.getItem(checkKey) || 0); } catch (_) {}
    if (last && Date.now() - last < sixHours) return;
    setTimeout(function () { checkAppUpdate({ silent: true }); }, 1800);
  }

  window.checkAppUpdate = checkAppUpdate;
  window.openAppUpdate = function () { return checkAppUpdate({ silent: false }); };
  window.dismissAppUpdateBanner = removeBanner;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', scheduleAutomaticCheck);
  else scheduleAutomaticCheck();
})();
