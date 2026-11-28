import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const helperStart = html.indexOf('function updateAdFileAccept()');
const helperEnd = html.indexOf('async function addNewAd()', helperStart);
assert.ok(helperStart >= 0 && helperEnd > helperStart, 'ad media helpers should be present before addNewAd');
const helperSource = html.slice(helperStart, helperEnd);

function loadHelpers(elements) {
  const context = {
    document: { getElementById(id) { return elements[id] || null; } },
  };
  vm.runInNewContext(
    `${helperSource}\nglobalThis.testHelpers = { updateAdFileAccept, validateAdFile };`,
    context,
  );
  return context.testHelpers;
}

test('mobile file picker switches to video-only when video ads are selected', () => {
  const elements = {
    adType: { value: 'video' },
    adFile: { accept: 'image/*,video/*', value: 'old-selection' },
    adFileLabel: { textContent: '' },
  };
  loadHelpers(elements).updateAdFileAccept();
  assert.equal(elements.adFile.accept, 'video/*');
  assert.equal(elements.adFile.value, '');
  assert.match(elements.adFileLabel.textContent, /فيديو/);
});

test('mobile file picker switches to image-only when image ads are selected', () => {
  const elements = {
    adType: { value: 'image' },
    adFile: { accept: 'video/*', value: 'old-selection' },
    adFileLabel: { textContent: '' },
  };
  loadHelpers(elements).updateAdFileAccept();
  assert.equal(elements.adFile.accept, 'image/*');
  assert.equal(elements.adFile.value, '');
  assert.match(elements.adFileLabel.textContent, /صورة/);
});

test('ad file validation accepts common mobile media and extension-only Android files', () => {
  const { validateAdFile } = loadHelpers({});
  assert.equal(validateAdFile({ name: 'clip.mp4', type: 'video/mp4', size: 2_000_000 }, 'video'), null);
  assert.equal(validateAdFile({ name: 'camera-recording.MOV', type: '', size: 2_000_000 }, 'video'), null);
  assert.equal(validateAdFile({ name: 'photo.jpg', type: 'image/jpeg', size: 2_000_000 }, 'image'), null);
  assert.equal(validateAdFile({ name: 'camera-photo.HEIC', type: '', size: 2_000_000 }, 'image'), null);
});

test('ad file validation rejects the wrong media type and files over the size limits', () => {
  const { validateAdFile } = loadHelpers({});
  assert.equal(validateAdFile({ name: 'photo.jpg', type: 'image/jpeg', size: 10 }, 'video'), 'type');
  assert.equal(validateAdFile({ name: 'clip.mp4', type: 'video/mp4', size: 101 * 1024 * 1024 }, 'video'), 'size');
  assert.equal(validateAdFile({ name: 'photo.png', type: 'image/png', size: 21 * 1024 * 1024 }, 'image'), 'size');
  assert.equal(validateAdFile(null, 'image'), 'missing');
});

test('ad form ties the selected ad type to the native file-picker filter', () => {
  assert.match(html, /id="adType" onchange="updateAdFileAccept\(\)"/);
  assert.match(html, /id="adFile" accept="image\/\*"/);
  assert.equal((html.match(/validateAdFile\(file,ty\)/g) || []).length, 2, 'both existing addNewAd definitions should validate the chosen media');
  assert.ok((html.match(/playsinline preload="metadata"/g) || []).length >= 2, 'ad renderers should support inline mobile video playback');
});
