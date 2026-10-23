import assert from 'node:assert/strict';
import { createHash, createHmac } from 'node:crypto';
import {
  challengeProof,
  constantTimeEqual,
  decodeFirestoreFields,
  encodeFirestoreFields,
  legacyFallbackHash,
  legacyHash,
  parseTeacherLoginCredentials,
  parseJsonSequence,
  readJson,
  teacherChallengeMessage,
  validateTeacherLoginInput
} from './index.mjs';

const password = 'school-pass-742';
const salt = 'salt-for-local-test';
const expectedLegacy = createHash('sha256').update(salt + '|' + password + '|hafez_secure', 'utf8').digest('hex');
assert.equal(await legacyHash(password, salt), expectedLegacy, 'legacy SHA-256 hash remains compatible');

function fallbackReference(value, saltValue) {
  const input = saltValue + '|' + value + '|hafez_secure';
  let h1 = 5381;
  let h2 = 52711;
  for (let i = 0; i < input.length; i += 1) {
    const code = input.charCodeAt(i);
    h1 = ((h1 * 33) ^ code) >>> 0;
    h2 = ((h2 * 31) ^ code) >>> 0;
  }
  return 'f_' + h1.toString(16) + h2.toString(16);
}
assert.equal(legacyFallbackHash(password, salt), fallbackReference(password, salt), 'legacy fallback remains compatible');

const verifier = 'b7'.repeat(32);
const message = 'ta3lemy-login-v1|challenge|nonce|device|username';
const expectedProof = createHmac('sha256', Buffer.from(verifier, 'utf8')).update(message, 'utf8').digest('base64url');
assert.equal(await challengeProof(verifier, message), expectedProof, 'HMAC challenge proof matches browser WebCrypto format');
assert.equal(constantTimeEqual(expectedProof, expectedProof), true);
assert.equal(constantTimeEqual(expectedProof, 'wrong-proof'), false);

const teacherPassword = 'local-test-teacher-password-2026';
const teacherCredentials = parseTeacherLoginCredentials({
  TEACHER_LOGIN_CREDENTIALS_JSON: JSON.stringify({ 'teacher-hafez': teacherPassword })
});
assert.equal(teacherCredentials['teacher-hafez'].password, teacherPassword, 'teacher credentials are read from Worker secret JSON');
assert.throws(() => parseTeacherLoginCredentials({ TEACHER_LOGIN_CREDENTIALS_JSON: '{invalid' }));
assert.throws(() => parseTeacherLoginCredentials({ TEACHER_LOGIN_CREDENTIALS_JSON: JSON.stringify({ teacher: 'short' }) }));

const teacherChallenge = { nonce: 'teacher-nonce', deviceId: 'teacher-device', username: 'teacher-hafez' };
const teacherMessage = teacherChallengeMessage('a'.repeat(32), teacherChallenge);
assert.equal(teacherMessage, 'ta3lemy-teacher-login-v1|' + 'a'.repeat(32) + '|teacher-nonce|teacher-device|teacher-hafez');
const teacherProof = await challengeProof(teacherPassword, teacherMessage);
assert.equal(teacherProof, createHmac('sha256', Buffer.from(teacherPassword, 'utf8')).update(teacherMessage, 'utf8').digest('base64url'), 'teacher password is sent only as a challenge proof');
assert.deepEqual(validateTeacherLoginInput({ challengeId: 'a'.repeat(32), deviceId: 'teacher-device', proof: teacherProof }), {
  challengeId: 'a'.repeat(32), deviceId: 'teacher-device', proof: teacherProof
});
assert.throws(() => validateTeacherLoginInput({ challengeId: 'bad', deviceId: 'teacher-device', proof: 'proof' }));

const stream = '{"document":{"name":"projects/p/databases/(default)/documents/users/u1","fields":{"name":{"stringValue":"طالب"}}}}\n{"readTime":"2026-10-23T00:00:00Z"}\n';
assert.equal(parseJsonSequence(stream).length, 2, 'Firestore streaming JSON records are parsed');
assert.equal(parseJsonSequence('[{"document":{"name":"doc"}}]').length, 1, 'Firestore JSON arrays are parsed too');

const fields = { name: 'طالب', points: 7, visible: true, devices: ['a', 'b'], extra: { grade: '1' } };
assert.deepEqual(decodeFirestoreFields(encodeFirestoreFields(fields)), fields, 'Firestore field encoding round-trips');
const timestamp = new Date('2026-10-23T00:00:00.000Z');
assert.deepEqual(encodeFirestoreFields({ ttlExpiresAt: timestamp }), { ttlExpiresAt: { timestampValue: timestamp.toISOString() } }, 'TTL dates use Firestore timestampValue');

const validRequest = new Request('https://worker.example/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"ok":true}' });
assert.deepEqual(await readJson(validRequest), { ok: true }, 'bounded request parser accepts valid JSON');
const oversizedRequest = new Request('https://worker.example/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ' '.repeat(17000) });
await assert.rejects(readJson(oversizedRequest), (error) => error.status === 413, 'request parser rejects oversized streamed bodies');
console.log('Worker challenge, proof, TTL, body-limit, and Firestore tests passed.');
