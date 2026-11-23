/* Reliable radio playback, fallback streams, and Firestore-backed station recovery. */
(function () {
  'use strict';

  var audioElement = null;
  var activeUrl = '';
  var playbackToken = 0;
  var retryTimer = null;

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
        audioElement.preload = 'none';
        audioElement.setAttribute('playsinline', '');
        audioElement.setAttribute('aria-label', 'مشغل صوت محطة الإذاعة');
        audioElement.style.cssText = 'display:block;width:100%;max-width:480px;margin:0 auto 14px;direction:ltr;';
        var stopButton = player.querySelector('button[onclick="stopRadio()"]');
        player.insertBefore(audioElement, stopButton || null);
      }
      audioElement.addEventListener('playing', function () { setStatus('▶️ يعمل الآن'); });
      audioElement.addEventListener('waiting', function () { setStatus('⏳ جارٍ تحميل الصوت...'); });
    }
    return audioElement;
  }

  function getCachedStations() {
    try { return JSON.parse(localStorage.getItem('offline_station_items') || '[]'); }
    catch (_) { return []; }
  }

  function saveCachedStation(item) {
    if (!item || !item.id) return;
    var all = getCachedStations();
    var pos = all.findIndex(function (x) { return String(x.id) === String(item.id); });
    if (pos >= 0) all[pos] = item; else all.unshift(item);
    try { localStorage.setItem('offline_station_items', JSON.stringify(all)); } catch (_) {}
  }

  function stationUrls(station) {
    var urls = station && Array.isArray(station.urls) ? station.urls.slice() : [];
    if (station && station.url) urls.unshift(station.url);
    return urls.filter(function (url, i, list) { return typeof url === 'string' && url.trim() && list.indexOf(url) === i; });
  }

  function showOfficialFallback(station) {
    var page = station && station.officialUrl;
    if (page) {
      setStatus('❌ تعذر البث الصوتي. افتح الصفحة الرسمية للمحطة.');
      toast('❌ تعذر البث الصوتي؛ يمكنك فتح الصفحة الرسمية للمحطة.');
      var player = document.getElementById('radioPlayer');
      if (player && !player.querySelector('.radio-official-link')) {
        var link = document.createElement('a');
        link.className = 'radio-official-link';
        link.href = page;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'فتح الصفحة الرسمية للمحطة';
        link.style.cssText = 'display:block;color:#fff;text-decoration:underline;margin:10px auto;';
        player.appendChild(link);
      }
    } else {
      setStatus('❌ تعذر تشغيل جميع روابط المحطة.');
      toast('❌ تعذر تشغيل جميع روابط المحطة.');
    }
  }

  function showOfficialEmbed(station) {
    var player = document.getElementById('radioPlayer');
    if (!player || !station || !station.embedUrl) { showOfficialFallback(station || {}); return; }
    setPlayerTitle(station.name);
    setStatus('▶️ المشغل الرسمي قيد التحميل...');
    var frame = document.createElement('iframe');
    frame.className = 'radio-official-embed';
    frame.src = station.embedUrl;
    frame.title = station.name || 'البث الرسمي';
    frame.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    frame.style.cssText = 'display:block;width:100%;max-width:640px;height:220px;border:0;border-radius:12px;background:#000;margin:0 auto 14px;';
    var stopButton = player.querySelector('button[onclick="stopRadio()"]');
    player.insertBefore(frame, stopButton || null);
    var link = document.createElement('a');
    link.className = 'radio-official-link';
    link.href = station.officialUrl || station.embedUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'فتح المصدر الرسمي في صفحة مستقلة';
    link.style.cssText = 'display:block;color:#fff;text-decoration:underline;margin:8px auto 10px;';
    player.insertBefore(link, stopButton || null);
  }

  function setPlayerTitle(title) {
    var player = document.getElementById('radioPlayer');
    var titleNode = document.getElementById('radioStationName');
    if (player) player.style.display = 'block';
    if (titleNode) titleNode.textContent = title || 'ملف صوتي';
    var oldLink = player && player.querySelector('.radio-official-link');
    if (oldLink) oldLink.remove();
    var oldEmbed = player && player.querySelector('.radio-official-embed');
    if (oldEmbed) oldEmbed.remove();
  }

  function tryUrls(title, urls, officialUrl, index, token, onAllFailed) {
    if (token !== playbackToken) return;
    if (!urls[index]) { if (onAllFailed) onAllFailed(); else showOfficialFallback({ officialUrl: officialUrl }); return; }
    var audio = ensureAudioElement();
    if (!audio) { toast('⚠️ تعذر فتح مشغل الإذاعة.'); return; }
    activeUrl = urls[index];
    setStatus(index ? '⏳ الرابط البديل قيد التجربة...' : '🎵 جارٍ تجهيز الصوت...');
    audio.pause();
    audio.removeAttribute('src');
    audio.src = urls[index];
    audio.load();
    var settled = false;
    var fail = function () {
      if (settled || token !== playbackToken) return;
      settled = true;
      window.clearTimeout(retryTimer);
      retryTimer = window.setTimeout(function () { tryUrls(title, urls, officialUrl, index + 1, token, onAllFailed); }, 250);
    };
    audio.onerror = fail;
    var playPromise;
    try { playPromise = audio.play(); } catch (_) { fail(); return; }
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function (error) {
        if (error && error.name === 'NotAllowedError') {
          if (token === playbackToken) setStatus('اضغط زر ▶ داخل مشغل الصوت للبدء.');
        } else fail();
      });
    }
    audio.onplaying = function () { settled = true; setStatus('▶️ يعمل الآن'); };
  }

  function startPlayback(title, urls, officialUrl, onAllFailed) {
    urls = Array.isArray(urls) ? urls.filter(Boolean) : [urls];
    if (!urls.length) { if (onAllFailed) onAllFailed(); else showOfficialFallback({ officialUrl: officialUrl }); return; }
    var token = ++playbackToken;
    setPlayerTitle(title);
    tryUrls(title, urls, officialUrl, 0, token, onAllFailed || function () { showOfficialFallback({ officialUrl: officialUrl }); });
    toast('▶️ ' + (title || 'ملف صوتي'));
  }

  async function refreshStation(id) {
    if (!navigator.onLine || typeof db === 'undefined' || !db) return null;
    try {
      var doc = await db.collection('station').doc(String(id)).get();
      if (!doc.exists) return null;
      var item = Object.assign({ id: doc.id }, doc.data());
      saveCachedStation(item);
      return item;
    } catch (error) {
      console.warn('تعذر تحديث ملف محطتي من Firestore', error);
      return null;
    }
  }

  window.playMyStationAudio = function (id) {
    var item = getCachedStations().find(function (x) { return String(x.id) === String(id); }) || null;
    var initialUrl = item && (item.url || item.audio_url || item.audioUrl);
    if (!initialUrl && !navigator.onLine) { toast('📴 لا يوجد رابط محفوظ لهذا الملف. اتصل بالإنترنت لمزامنته.'); return; }
    if (initialUrl) {
      startPlayback(item.title || 'ملف صوتي', [initialUrl], null, async function () {
        var fresh = await refreshStation(id);
        var freshUrl = fresh && (fresh.url || fresh.audio_url || fresh.audioUrl);
        if (freshUrl) startPlayback(fresh.title || item.title || 'ملف صوتي', [freshUrl], null);
        else toast('❌ تعذر تشغيل الملف بعد تحديث بياناته من الخادم.');
      });
      return;
    }
    setStatus('⏳ جارٍ استعادة بيانات الملف...');
    refreshStation(id).then(function (fresh) {
      var url = fresh && (fresh.url || fresh.audio_url || fresh.audioUrl);
      if (url) startPlayback(fresh.title || 'ملف صوتي', [url], null);
      else toast('⚠️ لم أجد رابط الملف في Firestore.');
    });
  };

  window.playRadio = function (index) {
    var station = typeof radioStations !== 'undefined' ? radioStations[index] : null;
    if (!station) return;
    if (!navigator.onLine) { toast('📴 البث المباشر يحتاج إلى اتصال بالإنترنت.'); return; }
    // محطتا مصر والبرنامج العام تعملان عبر المشغل الرسمي المضمّن، وليستا روابط MP3.
    // فتح المشغل مباشرة يمنع مرور الضغط عبر محاولة صوت فارغة في النسخ القديمة.
    if (station.embedUrl) {
      playbackToken += 1;
      window.clearTimeout(retryTimer);
      setPlayerTitle(station.name);
      showOfficialEmbed(station);
      toast('▶️ فتح المشغل الرسمي: ' + station.name);
      return;
    }
    startPlayback(station.name, stationUrls(station), station.officialUrl, function () {
      if (station.embedUrl) showOfficialEmbed(station);
      else showOfficialFallback(station);
    });
  };

  window.stopRadio = function () {
    playbackToken += 1;
    window.clearTimeout(retryTimer);
    activeUrl = '';
    if (audioElement) { audioElement.pause(); audioElement.removeAttribute('src'); audioElement.load(); }
    var player = document.getElementById('radioPlayer');
    if (player) {
      var embed = player.querySelector('.radio-official-embed');
      var link = player.querySelector('.radio-official-link');
      if (embed) embed.remove();
      if (link) link.remove();
      player.style.display = 'none';
    }
    toast('⏹️ تم الإيقاف');
  };
})();
