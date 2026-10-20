'use strict';

const crypto = require('node:crypto');
const { promisify } = require('node:util');
const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { initializeApp, getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

if (!getApps().length) initializeApp();
const db = getFirestore();
const auth = getAuth();
const pbkdf2 = promisify(crypto.pbkdf2);
const LEGACY_PREFIX = 'hafez_secure';
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 8;
const PBKDF2_ITERATIONS = 210000;
const REGISTRATION_WINDOW_MS = 24 * 60 * 60 * 1000;
const REGISTRATION_LIMIT = 100;

function sha256(value) {
  return crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function constantTimeEqual(left, right) {
  const a = Buffer.from(String(left || ''), 'utf8');
  const b = Buffer.from(String(right || ''), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function legacyFallbackHash(password, salt) {
  const value = String(salt || '') + '|' + String(password) + '|' + LEGACY_PREFIX;
  let h1 = 5381;
  let h2 = 52711;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    h1 = ((h1 * 33) ^ code) >>> 0;
    h2 = ((h2 * 31) ^ code) >>> 0;
  }
  return 'f_' + h1.toString(16) + h2.toString(16);
}

function legacyHash(password, salt) {
  return sha256(String(salt || '') + '|' + String(password) + '|' + LEGACY_PREFIX);
}

async function strongHash(password, salt) {
  const derived = await pbkdf2(String(password), String(salt), PBKDF2_ITERATIONS, 32, 'sha256');
  return derived.toString('hex');
}

function validateInput(data) {
  const username = String(data && data.username || '').trim();
  const password = String(data && data.password || '');
  const deviceId = String(data && data.deviceId || '').trim();
  if (username.length < 3 || username.length > 64 || password.length < 4 || password.length > 256) {
    throw new HttpsError('invalid-argument', 'تحقق من اسم المستخدم وكلمة المرور.');
  }
  if (!deviceId || deviceId.length > 200) {
    throw new HttpsError('invalid-argument', 'تعذر التحقق من هذا الجهاز.');
  }
  return { username, password, deviceId, recoveryCode: String(data.recoveryCode || '').trim() };
}

async function checkRateLimit(username, request) {
  const ip = String(request.rawRequest && request.rawRequest.ip || 'unknown');
  const key = sha256(username + '|' + ip);
  const ref = db.collection('auth_rate_limits').doc(key);
  const now = Date.now();
  const snap = await ref.get();
  if (snap.exists) {
    const value = snap.data();
    if (now - Number(value.windowStart || 0) < RATE_WINDOW_MS && Number(value.attempts || 0) >= RATE_LIMIT) {
      throw new HttpsError('resource-exhausted', 'محاولات كثيرة. انتظر قليلًا ثم حاول مرة أخرى.');
    }
  }
  return ref;
}

async function recordFailure(ref) {
  const now = Date.now();
  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const old = snap.exists ? snap.data() : {};
    const stillInWindow = now - Number(old.windowStart || 0) < RATE_WINDOW_MS;
    transaction.set(ref, {
      windowStart: stillInWindow ? Number(old.windowStart) : now,
      attempts: stillInWindow ? Number(old.attempts || 0) + 1 : 1,
      updatedAt: FieldValue.serverTimestamp()
    }, { merge: true });
  });
}

async function clearRateLimit(ref) {
  await ref.delete().catch(() => {});
}

async function reserveRegistrationSlot(request) {
  const ip = String(request.rawRequest && request.rawRequest.ip || 'unknown');
  const ref = db.collection('auth_registration_limits').doc(sha256(ip));
  const now = Date.now();
  let denied = false;
  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    const old = snap.exists ? snap.data() : {};
    const active = now - Number(old.windowStart || 0) < REGISTRATION_WINDOW_MS;
    const count = active ? Number(old.accountsCreated || 0) : 0;
    if (count >= REGISTRATION_LIMIT) { denied = true; return; }
    transaction.set(ref, { windowStart: active ? Number(old.windowStart) : now, accountsCreated: count + 1, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  });
  if (denied) throw new HttpsError('resource-exhausted', 'وصل هذا الاتصال إلى حد إنشاء الحسابات اليومي؛ تواصل مع المالك لإكمال التسجيل.');
}

async function locateExistingUser(username) {
  const query = await db.collection('users').where('name', '==', username).limit(2).get();
  if (query.size > 1) {
    throw new HttpsError('failed-precondition', 'يوجد أكثر من حساب بهذا الاسم؛ يحتاج الحساب مراجعة المالك قبل التفعيل الآمن.');
  }
  if (query.empty) return null;
  return { ref: query.docs[0].ref, data: query.docs[0].data(), isNew: false };
}

async function createStudentAccount(username, password, deviceId, request) {
  await reserveRegistrationSlot(request);
  const registryId = sha256(username);
  const registryRef = db.collection('username_registry').doc(registryId);
  const uid = 'u_' + Date.now().toString(36) + '_' + crypto.randomBytes(9).toString('hex');
  const userRef = db.collection('users').doc(uid);
  const salt = crypto.randomBytes(18).toString('base64url');
  const passwordSaltV2 = crypto.randomBytes(18).toString('base64url');
  const recoveryCode = String(crypto.randomInt(100000, 1000000));
  const now = new Date().toISOString();
  const userData = {
    name: username,
    role: 'student',
    salt,
    passHash: legacyHash(password, salt),
    passwordSaltV2,
    passwordHashV2: await strongHash(password, passwordSaltV2),
    authProvider: 'firebase-custom-token',
    authMigrationVersion: 1,
    authUid: uid,
    recoveryCode,
    trustedDevices: [deviceId],
    points: 0,
    createdAt: now,
    lastLogin: now
  };

  let finalUid = uid;
  let created = false;
  await db.runTransaction(async (transaction) => {
    const registry = await transaction.get(registryRef);
    if (registry.exists) {
      finalUid = String(registry.data().uid || '');
      return;
    }
    const collision = await transaction.get(userRef);
    if (collision.exists) throw new HttpsError('aborted', 'تعذر إنشاء الحساب؛ أعد المحاولة.');
    transaction.create(userRef, userData);
    transaction.create(registryRef, { uid, createdAt: FieldValue.serverTimestamp() });
    created = true;
  });

  if (!created) {
    const ref = db.collection('users').doc(finalUid);
    const doc = await ref.get();
    if (!doc.exists) throw new HttpsError('failed-precondition', 'تعذر استعادة سجل الحساب؛ تواصل مع المالك.');
    return { ref, data: doc.data(), isNew: false };
  }
  return { ref: userRef, data: userData, isNew: true, recoveryCode };
}

async function ensureUsernameRegistry(username, uid) {
  const ref = db.collection('username_registry').doc(sha256(username));
  await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    if (snap.exists && String(snap.data().uid) !== String(uid)) {
      throw new HttpsError('failed-precondition', 'اسم المستخدم مرتبط بسجل آخر؛ يحتاج مراجعة المالك.');
    }
    if (!snap.exists) transaction.create(ref, { uid: String(uid), createdAt: FieldValue.serverTimestamp() });
  });
}

async function passwordMatches(password, user) {
  if (user.passwordHashV2 && user.passwordSaltV2) {
    return constantTimeEqual(await strongHash(password, user.passwordSaltV2), user.passwordHashV2);
  }
  if (!user.salt || !user.passHash) return false;
  const computed = String(user.passHash).startsWith('f_')
    ? legacyFallbackHash(password, user.salt)
    : legacyHash(password, user.salt);
  return constantTimeEqual(computed, user.passHash);
}

async function ensureCompatibleAuthUid(uid) {
  let existing;
  try {
    existing = await auth.getUser(String(uid));
  } catch (error) {
    if (!error || error.code !== 'auth/user-not-found') throw error;
    try { existing = await auth.createUser({ uid: String(uid) }); }
    catch (createError) {
      if (!createError || createError.code !== 'auth/uid-already-exists') throw createError;
      existing = await auth.getUser(String(uid));
    }
  }
  if (existing.phoneNumber || (existing.providerData && existing.providerData.length)) {
    throw new HttpsError('failed-precondition', 'معرّف الحساب مستخدم في مصادقة أخرى؛ أوقفنا الربط لحماية الحساب.');
  }
  const currentClaims = existing.customClaims || {};
  if (currentClaims.role && currentClaims.role !== 'student') {
    throw new HttpsError('failed-precondition', 'معرّف الحساب يحمل دورًا مختلفًا؛ أوقفنا الربط لحماية الصلاحيات.');
  }
  if (currentClaims.role !== 'student') {
    await auth.setCustomUserClaims(String(uid), Object.assign({}, currentClaims, { role: 'student' }));
  }
}

exports.loginLegacyStudent = onCall({ region: 'us-central1', maxInstances: 10, enforceAppCheck: false }, async (request) => {
  const input = validateInput(request.data);
  const limiterRef = await checkRateLimit(input.username, request);
  let account;

  try {
    account = await locateExistingUser(input.username);
    if (!account) account = await createStudentAccount(input.username, input.password, input.deviceId, request);

    const user = account.data;
    if (user.role && user.role !== 'student') {
      throw new HttpsError('permission-denied', 'هذا الحساب يستخدم مسار دخول آخر؛ اختر طريقة الدخول المناسبة.');
    }
    if (!(await passwordMatches(input.password, user))) {
      await recordFailure(limiterRef);
      await db.collection('login_logs').add({ username: input.username, role: 'student', success: false, reason: 'invalid credentials', timestamp: FieldValue.serverTimestamp() }).catch(() => {});
      throw new HttpsError('permission-denied', 'اسم المستخدم أو كلمة المرور غير صحيحة.');
    }

    const devices = Array.isArray(user.trustedDevices) ? user.trustedDevices.map(String) : [];
    if (!account.isNew && devices.indexOf(input.deviceId) < 0) {
      if (!input.recoveryCode) return { needsRecovery: true };
      if (!constantTimeEqual(input.recoveryCode, user.recoveryCode || '')) {
        await recordFailure(limiterRef);
        throw new HttpsError('permission-denied', 'اسم المستخدم أو كلمة المرور أو كود الاستعادة غير صحيح.');
      }
      await account.ref.update({ trustedDevices: FieldValue.arrayUnion(input.deviceId) });
    }

    await ensureCompatibleAuthUid(account.ref.id);
    await ensureUsernameRegistry(input.username, account.ref.id);
    const patch = {
      authUid: account.ref.id,
      authProvider: 'firebase-custom-token',
      authMigrationVersion: 1,
      lastLogin: new Date().toISOString()
    };
    if (!user.passwordHashV2 || !user.passwordSaltV2) {
      patch.passwordSaltV2 = crypto.randomBytes(18).toString('base64url');
      patch.passwordHashV2 = await strongHash(input.password, patch.passwordSaltV2);
    }
    await account.ref.update(patch);
    await clearRateLimit(limiterRef);

    const token = await auth.createCustomToken(account.ref.id, { role: 'student' });
    await db.collection('login_logs').add({ username: input.username, role: 'student', success: true, reason: 'custom auth', timestamp: FieldValue.serverTimestamp() }).catch(() => {});
    return {
      customToken: token,
      uid: account.ref.id,
      name: String(user.name || input.username),
      points: Number.isFinite(Number(user.points)) ? Number(user.points) : 0,
      role: 'student',
      isNew: !!account.isNew,
      recoveryCode: account.isNew ? account.recoveryCode : null
    };
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    console.error('loginLegacyStudent failed:', error && error.code || 'unknown');
    throw new HttpsError('internal', 'تعذر إكمال تسجيل الدخول الآمن. حاول مرة أخرى لاحقًا.');
  }
});
