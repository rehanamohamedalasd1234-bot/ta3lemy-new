/* Reliable playback and actionable diagnostics for the owner's radio station. */
(function () {
  'use strict';

  var audioElement = null;
  var activeUrl = '';
  var playbackToken = 0;
  var lastProbeUrl = '';
  var lastProbeAt = 0;
  var lastProbeResult = null;

  function toast(message) {
    if (typeof window.showToast === 'function') window.showToast(message);
  }

  function setStatus(message) {
    var status = document.getElementById('radioNowPlaying');
    if (status) status.textContent = message;
  }

  function ensureAudioElement() {
    var player = document.getElementById('radioPlayer');
    if (!player) return null;

    if (!audioElement || !player.contains(audioElement)) {
      audioElement = document.getElementById('radioNativeAudio');
      if (!audioElement) {
        audioElement = document.createElement('audio');
        audioElement.id = 'radioNativeAudio';
        audioElement.controls = true;
        audioElement.preload = 'metadata';
        audioElement.setAttribute('aria-label', 'مشغل صوت محطة الإذاعة');
        audioElement.style.cssText = 'display:block;width:100%;max-width:480px;margin:0 auto 14px;direction:ltr;';
        var stopButton = player.querySelector('button[onclick="stopRadio()"]');
        player.insertBefore(audioElement, stopButton || null);
      }
      audioElement.addEventListener('playing', function () {
        setStatus('▶️ يعمل الآن');
      });
      audioElement.addEventListener('waiting', function () {
        setStatus('⏳ جارٍ تحميل الصوت...');
      });
      audioElement.addEventListener('error', function () {
        diagnoseCurrentAsset();
      });
    }
    return audioElement;
  }

  function getCachedStation(id) {
    try {
      var entries = JSON.parse(localStorage.getItem('offline_station_items') || '[]');
      return entries.find(function (entry) { return String(entry.id) === String(id); }) || null;
    } catch (_) {
      return null;
    }
  }

  function describeStatus(status) {
    if (status === 401) {
      return 'تعذر الوصول إلى ملف Cloudinary (401). اسم السحابة أو إعداد بيئتها غير مطابق.';
    }
    if (status === 403) {
      return 'Cloudinary يمنع الوصول إلى هذا الملف (403).';
    }
    if (status === 404) {
      return 'ملف الصوت غير موجود في التخزين (404).';
    }
    if (status >= 200 && status < 300) {
      return 'الرابط متاح، لكن تعذّر على المتصفح فك صيغة الصوت. جرّب ملف MP3.';
    }
    return 'تعذر الوصول إلى ملف الصوت من التخزين (HTTP ' + status + ').';
  }

  async function diagnoseCurrentAsset() {
    var url = activeUrl;
    var token = playbackToken;
    if (!url || token !== playbackToken) return;

    if (!navigator.onLine) {
      setStatus('📴 تعذر التشغيل دون اتصال؛ نزّل الملف مسبقًا على هذا الجهاز.');
      return;
    }

    if (url === lastProbeUrl && Date.now() - lastProbeAt < 30000 && lastProbeResult) {
      setStatus(lastProbeResult);
      return;
    }

    try {
      var response = await fetch(url, { method: 'HEAD', mode: 'cors', cache: 'no-store' });
      var message = describeStatus(response.status);
      lastProbeUrl = url;
      lastProbeAt = Date.now();
      lastProbeResult = message;
      if (token === playbackToken) {
        setStatus('⚠️ ' + message);
        toast('⚠️ ' + message);
      }
    } catch (_) {
      if (token === playbackToken) {
        var message = 'تعذر فحص رابط الصوت. تحقق من الاتصال أو أعد رفع الملف.';
        setStatus('⚠️ ' + message);
        toast('⚠️ ' + message);
      }
    }
  }

  function startPlayback(title, url) {
    if (!url) {
      toast('⚠️ لا يوجد رابط صوت لهذا الملف.');
      return;
    }

    var player = document.getElementById('radioPlayer');
    var titleNode = document.getElementById('radioStationName');
    var audio = ensureAudioElement();
    if (!player || !audio) {
      toast('⚠️ تعذر فتح مشغل الإذاعة.');
      return;
    }

    var token = ++playbackToken;
    activeUrl = url;
    lastProbeResult = null;
    player.style.display = 'block';
    if (titleNode) titleNode.textContent = title || 'ملف صوتي';
    setStatus('🎵 جارٍ تجهيز الصوت...');

    audio.pause();
    audio.src = url;
    audio.load();

    // Start before any network/database await so mobile browsers keep the user's tap gesture.
    var playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function (error) {
        if (token === playbackToken) {
          if (error && error.name === 'NotAllowedError') {
            setStatus('اضغط زر ▶ داخل مشغل الصوت للبدء.');
          } else {
            diagnoseCurrentAsset();
          }
        }
      });
    }
    toast('▶️ ' + (title || 'ملف صوتي'));
  }

  window.playMyStationAudio = function (id) {
    var item = getCachedStation(id);
    if (!item || !item.url) {
      toast('⚠️ لم أجد رابط الملف في القائمة المحفوظة. افتح «محطتي» مجددًا مع الإنترنت.');
      return;
    }
    startPlayback(item.title || 'ملف صوتي', item.url);
  };

  window.playRadio = function (index) {
    var station = typeof radioStations !== 'undefined' ? radioStations[index] : null;
    if (!station) return;
    if (!navigator.onLine) {
      toast('📴 البث المباشر يحتاج إلى اتصال بالإنترنت.');
      return;
    }
    startPlayback(station.name, station.url);
  };

  window.stopRadio = function () {
    playbackToken += 1;
    activeUrl = '';
    if (audioElement) {
      audioElement.pause();
      audioElement.removeAttribute('src');
      audioElement.load();
    }
    var player = document.getElementById('radioPlayer');
    if (player) player.style.display = 'none';
    toast('⏹️ تم الإيقاف');
  };
})();
