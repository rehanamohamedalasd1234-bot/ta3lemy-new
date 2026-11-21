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
    self, caches, fetch: fetchImpl, URL, Request, Response, Headers, Set, Promise, console,
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

test('cached readable audio supports byte-range requests used by mobile players', async () => {
  const listeners = await makeServiceWorker({
    mediaResponse: new Response('0123456789', { headers: { 'Content-Type': 'audio/mpeg' } }),
  });
  const event = fetchEvent(new Request('https://media.test/lesson.mp3', { headers: { Range: 'bytes=2-5' } }));
  listeners.fetch(event);
  const response = await event.response;
  assert.equal(response.status, 206);
  assert.equal(response.headers.get('content-range'), 'bytes 2-5/10');
  assert.equal(await response.text(), '2345');
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
  const appVersion = JSON.parse(await read('version.json')).version;
  assert.match(updater, /var VERSION_URL = SITE_URL \+ 'version\.json'/);
  assert.match(updater, /fetch\('\.\/version\.json\?localVersionCheck='/);
  assert.doesNotMatch(updater, /releases\/latest\/download/);
  assert.match(updater, /registration\.update\(\)/);
  assert.match(html, /onclick="openAppUpdate\(\)"/);
  assert.match(html, /name="ta3lemy-version" content="[^"]+"/);
  assert.ok(appVersion, 'version.json should define the current app version');
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
  const activeQuran = html.slice(html.lastIndexOf('async function openQuran()'), html.lastIndexOf('async function playAyah('));
  assert.match(activeQuran, /window\.readOfflineQuran\?await window\.readOfflineQuran\(\):null/);
});

test('all same-origin scripts referenced by the app are included in the offline shell', async () => {
  const sw = await read('service-worker.js');
  const html = await read('index.html');
  const paths = new Set(Array.from(sw.matchAll(/['"](\.\/[^'"]+)['"]/g), (match) => match[1].split('?')[0]));
  for (const match of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    const src = match[1];
    if (/^(https?:)?\/\//i.test(src)) continue;
    assert.ok(paths.has(src.split('?')[0]), `${src} should be cached by the service worker`);
  }
});

test('offline lesson downloads have an IndexedDB-backed reader and writer', async () => {
  const extras = await read('extras.js');
  const html = await read('index.html');
  assert.match(extras, /window\.saveOfflineLessons=async function/);
  assert.match(extras, /window\.readOfflineLessons=async function/);
  assert.match(extras, /await window\.saveOfflineLessons\(lessons\)/);
  assert.match(html, /window\.readOfflineLessons\?await window\.readOfflineLessons\(\)/);
});

test('teacher image sets survive upload, owner approval, resync and student display', async () => {
  const teacher = await read('teacher-workflow.js');
  const approvals = await read('owner-approvals.js');
  const html = await read('index.html');
  assert.match(teacher, /image_url: imageUrl, image_urls: imageUrls, image_urls_json: JSON\.stringify\(imageUrls\), image_count: imageUrls\.length/);
  assert.match(approvals, /var candidates = \[item\.image_urls, item\.image_urls_json, item\.imageUrls, item\.images\]/);
  assert.match(approvals, /image_urls: rawImageUrls\(item\), image_urls_json: JSON\.stringify\(rawImageUrls\(item\)\), image_count: rawImageUrls\(item\)\.length/);
  assert.match(approvals, /window\.syncTeacherPublicationMedia = async function/);
  assert.match(html, /pageImageCandidates=\[pageImageCandidate\(it\.image_urls\),pageImageCandidate\(it\.image_urls_json\),pageImageCandidate\(it\.imageUrls\),pageImageCandidate\(it\.images\)\]/);
  assert.match(html, /pageImages\.forEach\(function\(src,index\)/);
  assert.match(html, /#viewerScreen \.teacher-gallery-page-image \{ max-height: 82vh; \}/);
  assert.match(html, /teacher-gallery-page-image:fullscreen \{[^}]*max-width: 100vw/);
});

test('students can answer image lessons with true/false, text and touch or mouse annotations', async () => {
  const html = await read('index.html');
  const worker = await read('service-worker.js');
  const activitySource = await read('student-image-activity.js');
  assert.match(html, /teacher-image-activity-canvas/);
  assert.match(html, /TeacherImageActivity\.choose/);
  assert.match(html, /response\.imageAnnotations=annotations/);
  assert.match(worker, /'\.\/student-image-activity\.js'/);
  assert.match(activitySource, /pointerdown/);
  assert.match(activitySource, /pointermove/);
  assert.match(activitySource, /MAX_POINTS = 12000/);

  const window = { addEventListener() {}, devicePixelRatio: 1 };
  vm.runInNewContext(activitySource, { window, requestAnimationFrame(callback) { callback(); } });
  window.TeacherImageActivity.init({ querySelectorAll() { return []; } }, 'lesson-123');
  window.TeacherImageActivity.choose('صح');
  assert.deepEqual(JSON.parse(JSON.stringify(window.TeacherImageActivity.getSubmission())), {
    lessonId: 'lesson-123', choice: 'صح', annotations: [],
  });
});
