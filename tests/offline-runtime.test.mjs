import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const read = (path) => readFile(new URL(path, root), 'utf8');

async function makeServiceWorker({ mediaResponse = null, shellResponse = null, fetchImpl = async () => new Response('network') } = {}) {
  const listeners = {};
  const mediaCache = {
    async match() { return mediaResponse; },
    async put() {},
  };
  const shellCache = {
    async match(request, options = {}) {
      if (shellResponse && options.ignoreSearch && /recognition-and-azkar\.js/.test(String(request.url || request))) return shellResponse;
      return null;
    },
    async put() {},
  };
  const caches = {
    async open(name) { return name === 'ta3lemy-media-v1' ? mediaCache : shellCache; },
    async match(request, options) { return shellCache.match(request, options); },
    async keys() { return []; },
    async delete() { return true; },
  };
  const self = {
    location: { origin: 'https://platform.test' },
    registration: { scope: 'https://platform.test/' },
    clients: { claim: async () => {} },
    addEventListener(name, callback) { listeners[name] = callback; },
    skipWaiting: async () => {},
  };
  vm.runInNewContext(await read('service-worker.js'), {
    self, caches, fetch: fetchImpl, URL, Request, Response, Set, Promise, console,
  });
  return listeners;
}

function fetchEvent(request) {
  return {
    request,
    respondWith(value) { this.response = Promise.resolve(value); },
  };
}

test('downloaded cross-origin audio is served from the offline media cache', async () => {
  const listeners = await makeServiceWorker({ mediaResponse: new Response('saved audio') });
  const event = fetchEvent(new Request('https://media.test/lesson.mp3'));
  listeners.fetch(event);
  const response = await event.response;
  assert.equal(await response.text(), 'saved audio');
});

test('versioned azkar script URLs can use their cached app-shell file offline', async () => {
  const listeners = await makeServiceWorker({
    shellResponse: new Response('cached azkar script'),
    fetchImpl: async () => { throw new Error('offline'); },
  });
  const event = fetchEvent(new Request('https://platform.test/recognition-and-azkar.js?v=1.0.94'));
  listeners.fetch(event);
  const response = await event.response;
  assert.equal(await response.text(), 'cached azkar script');
});

test('uncached media fails safely offline instead of returning an invalid response', async () => {
  const listeners = await makeServiceWorker({ fetchImpl: async () => { throw new Error('offline'); } });
  const event = fetchEvent(new Request('https://media.test/not-downloaded.mp3'));
  listeners.fetch(event);
  const response = await event.response;
  assert.equal(response.status, 503);
});

test('offline mode leaves local radio browsing and downloaded station playback available', async () => {
  const offline = await read('offline-mode.js');
  const guard = offline.match(/function blockNetworkOnlyScreens\(\)\s*\{\s*\[([^\]]*)\]/s);
  assert.ok(guard, 'network-only guard should be present');
  assert.doesNotMatch(guard[1], /openRadio|playMyStationAudio/);
  assert.match(guard[1], /playRadio/);
  assert.match(guard[1], /addMyStationAudio/);
});

test('the updater checks the published repository version and refreshes the service worker', async () => {
  const updater = await read('app-update.js');
  const html = await read('index.html');
  assert.match(updater, /raw\.githubusercontent\.com\/rehanamohamedalasd1234-bot\/ta3lemy-new\/main\/version\.json/);
  assert.doesNotMatch(updater, /releases\/latest\/download/);
  assert.match(updater, /registration\.update\(\)/);
  assert.match(html, /onclick="openAppUpdate\(\)"/);
  assert.match(html, /name="ta3lemy-version" content="1\.0\.111"/);
});

test('the library is reachable from the student home and owner administration supports sign-out', async () => {
  const library = await read('library.js');
  assert.match(library, /id = 'libraryHomeButton'/);
  assert.match(library, /tile\.addEventListener\('click', openLibrary\)/);
  assert.match(library, /function openLibraryAdmin\(\)/);
  assert.match(library, /function signOutOwner\(\)/);
  assert.match(library, /HafezOwnerAuth\.signOut\(\)/);
});

test('Quran offline downloads use compact verse strings and IndexedDB fallback', async () => {
  const extras = await read('extras.js');
  const html = await read('index.html');
  assert.match(extras, /indexedDB\.open\(OFFLINE_DB_NAME,1\)/);
  assert.match(extras, /window\.readOfflineQuran/);
  assert.match(extras, /window\.saveOfflineQuran\(quran,surahIndex\)/);
  assert.match(extras, /ayahs:s\.ayahs\.map\(function\(a\)\{return a\.text;\}\)/);
  assert.match(html, /window\.readOfflineQuran\?await window\.readOfflineQuran\(\):null/);
});
