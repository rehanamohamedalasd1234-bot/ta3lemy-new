/* Foreground incoming-call alerts for the Hafez PWA.
 * Web Push is not included; realtime alerts require the app to remain open and connected.
 */
(function () {
  'use strict';

  var audioContext = null;
  var activeCallId = '';
  var ringtoneInterval = null;
  var stopTimer = null;
  var activeOscillators = [];
  var activeNotification = null;

  function ensureAudioContext() {
    if (audioContext) return audioContext;
    var AudioContextType = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextType) return null;
    try { audioContext = new AudioContextType(); }
    catch (error) { console.warn('[call-alerts] AudioContext unavailable', error); }
    return audioContext;
  }

  function unlock() {
    var context = ensureAudioContext();
    if (!context) return Promise.resolve(false);
    if (context.state === 'running') return Promise.resolve(true);
    return context.resume().then(function () { return context.state === 'running'; }).catch(function () { return false; });
  }

  function playTone(frequency, offset, duration) {
    var context = audioContext;
    if (!context || context.state !== 'running') return;
    try {
      var oscillator = context.createOscillator();
      var volume = context.createGain();
      var startAt = context.currentTime + offset;
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, startAt);
      volume.gain.setValueAtTime(0.0001, startAt);
      volume.gain.linearRampToValueAtTime(0.12, startAt + 0.025);
      volume.gain.setValueAtTime(0.12, startAt + duration - 0.045);
      volume.gain.linearRampToValueAtTime(0.0001, startAt + duration);
      oscillator.connect(volume);
      volume.connect(context.destination);
      oscillator.onended = function () {
        try { oscillator.disconnect(); volume.disconnect(); } catch (_) {}
        var index = activeOscillators.indexOf(oscillator);
        if (index >= 0) activeOscillators.splice(index, 1);
      };
      activeOscillators.push(oscillator);
      oscillator.start(startAt);
      oscillator.stop(startAt + duration + 0.02);
    } catch (error) { console.warn('[call-alerts] Could not play ringtone', error); }
  }

  function playBurst() {
    if (!activeCallId || !audioContext || audioContext.state !== 'running') return;
    playTone(880, 0, 0.30);
    playTone(660, 0.40, 0.30);
    playTone(880, 0.80, 0.30);
  }

  function stop(callId) {
    if (callId && activeCallId && String(callId) !== activeCallId) return;
    activeCallId = '';
    if (ringtoneInterval) window.clearInterval(ringtoneInterval);
    if (stopTimer) window.clearTimeout(stopTimer);
    ringtoneInterval = null;
    stopTimer = null;
    activeOscillators.splice(0).forEach(function (oscillator) {
      try { oscillator.stop(); } catch (_) {}
      try { oscillator.disconnect(); } catch (_) {}
    });
    if (activeNotification) {
      try { activeNotification.close(); } catch (_) {}
      activeNotification = null;
    }
    if (navigator.vibrate) navigator.vibrate(0);
  }

  function start(callId, callerLabel) {
    if (!callId) return;
    stop();
    activeCallId = String(callId);
    if (navigator.vibrate) navigator.vibrate([450, 200, 450, 200, 700]);

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        activeNotification = new Notification('مكالمة واردة', {
          body: String(callerLabel || 'أحد الأصدقاء') + ' يتصل بك',
          tag: 'hafez-private-call-' + activeCallId,
          icon: './icon-512.png',
          requireInteraction: true,
          vibrate: [450, 200, 450]
        });
        activeNotification.onclick = function () { try { window.focus(); } catch (_) {} };
      } catch (error) { console.warn('[call-alerts] System notification unavailable', error); }
    }

    var context = ensureAudioContext();
    if (context) {
      var thisCall = activeCallId;
      unlock().then(function (ready) { if (ready && activeCallId === thisCall) playBurst(); });
      ringtoneInterval = window.setInterval(function () {
        if (activeCallId === thisCall) playBurst();
      }, 2800);
    }
    stopTimer = window.setTimeout(function () { stop(activeCallId); }, 45000);
  }

  function permissionLabel() {
    if (!('Notification' in window)) return '🔔 تفعيل نغمة المكالمة';
    if (Notification.permission === 'granted') return '✅ تنبيهات المكالمات مفعّلة';
    if (Notification.permission === 'denied') return '🔔 تفعيل نغمة المكالمة';
    return '🔔 تفعيل تنبيهات المكالمات';
  }

  function refreshButton(button) {
    if (!button) return;
    button.textContent = permissionLabel();
    button.title = 'تعمل النغمة والتنبيهات عندما تكون المنصة مفتوحة ومتّصلة بالإنترنت.';
  }

  async function enable(button) {
    var audioReady = await unlock();
    var permission = 'unsupported';
    if ('Notification' in window) {
      permission = Notification.permission;
      if (permission === 'default') {
        try { permission = await Notification.requestPermission(); }
        catch (_) { permission = 'denied'; }
      }
    }
    refreshButton(button);
    if (permission === 'granted') {
      if (typeof window.showToast === 'function') window.showToast('تم تفعيل تنبيهات المكالمات.');
    } else if (audioReady) {
      if (typeof window.showToast === 'function') window.showToast('تم تجهيز نغمة المكالمات داخل المنصة.');
    } else if (typeof window.showToast === 'function') {
      window.showToast('لم يسمح المتصفح بالصوت؛ استخدم زر التفعيل داخل التطبيق.');
    }
  }

  function bindButton(button) {
    if (!button) return;
    refreshButton(button);
    button.onclick = function () { enable(button); };
  }

  window.HafezCallAlerts = { unlock: unlock, start: start, stop: stop, bindButton: bindButton };
  window.addEventListener('pagehide', function () { stop(); });
})();
